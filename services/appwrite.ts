import { Client, Databases, ID, Query, Account } from "react-native-appwrite";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { fetchMovieDetails } from "./api";
import { HomeMediaItem } from "./homeSections";
import { Platform } from "react-native";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const FAVORITES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;

const APPWRITE_PLATFORM = Platform.select({
  ios: process.env.EXPO_PUBLIC_APPWRITE_IOS_PLATFORM,
  android: process.env.EXPO_PUBLIC_APPWRITE_ANDROID_PLATFORM,
  default: process.env.EXPO_PUBLIC_APPWRITE_ANDROID_PLATFORM,
});

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(APPWRITE_PLATFORM!);

const database = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    // check if the record of that search has already been stored
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log("Error updating search count", error);
    throw error;
  }
};
export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    const localizedTrendingMovies = await Promise.all(
      result.documents.map(async (doc) => {
        try {
          const details = await fetchMovieDetails(String(doc.movie_id));

          return {
            ...doc,
            title: details.title || doc.title,
            poster_url: details.poster_path
              ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
              : doc.poster_url,
          };
        } catch (error) {
          return doc;
        }
      })
    );

    return localizedTrendingMovies as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export type SavedMovie = {
  $id: string;
  $createdAt: string;
  userId: string;
  movieId: string;
  title: string;
  posterPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  overview?: string;
  runtime?: string;
  reviewCount?: string;
  genres?: string;
};

export const getExistingFavorite = async (movieId: number | string) => {
  try {
    const firebaseUser = FIREBASE_AUTH.currentUser;

    if (!firebaseUser) return undefined;

    const result = await database.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      [
        Query.equal("userId", firebaseUser.uid),
        Query.equal("movieId", String(movieId)),
        Query.limit(1),
      ]
    );

    return result.documents[0] as unknown as SavedMovie | undefined;
  } catch (error) {
    console.log("Error checking favorite", error);
    return undefined;
  }
};

const formatReviewCountForAppwrite = (movie: FavoriteMediaInput) => {
  if (typeof movie.reviewCount === "string") {
    return movie.reviewCount;
  }

  const count = movie.reviewCount ?? movie.vote_count ?? 0;

  return `${count} reviews`;
};

export const saveFavorite = async (movie: FavoriteMediaInput) => {
  try {
    const firebaseUser = FIREBASE_AUTH.currentUser;

    if (!firebaseUser) {
      console.log("❌ No Firebase user found");
      throw new Error("User not authenticated");
    }

    const existingFavorite = await getExistingFavorite(movie.id);

    if (existingFavorite) {
      console.log("✅ Already favorited");
      return existingFavorite;
    }

    const result = await database.createDocument(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      ID.unique(),
      {
        userId: firebaseUser.uid,
        movieId: String(movie.id),

        title: movie.title || movie.name || "Untitled",

        posterPath: movie.poster_path ?? "",
        backdropPath: movie.backdrop_path ?? "",

        releaseDate: movie.release_date || movie.first_air_date || "",

        voteAverage: movie.vote_average ?? 0,
        reviewCount: formatReviewCountForAppwrite(movie),

        overview: movie.overview ?? "",

        runtime: movie.runtime ?? movie.episode_run_time?.[0] ?? 0,

        genres: Array.isArray(movie.genres)
          ? movie.genres.map((genre) => genre.name).join(", ")
          : "",

        mediaType: movie.mediaType || "movie",
      }
    );

    return result as unknown as SavedMovie;
  } catch (error) {
    console.error("❌ Error saving favorite:", error);
    throw error;
  }
};

export const removeFavorite = async (movieId: number | string) => {
  try {
    const existingFavorite = await getExistingFavorite(movieId);

    if (!existingFavorite) return;

    await database.deleteDocument(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      existingFavorite.$id
    );
  } catch (error) {
    console.log("Error removing favorite", error);
    throw error;
  }
};

export const getSavedMovies = async (): Promise<SavedMovie[]> => {
  try {
    const firebaseUser = FIREBASE_AUTH.currentUser;

    if (!firebaseUser) return [];

    const result = await database.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      [
        Query.equal("userId", firebaseUser.uid),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ]
    );

    return result.documents as unknown as SavedMovie[];
  } catch (error) {
    console.log("Error fetching saved movies", error);
    return [];
  }
};

export const getMyListMovies = async (): Promise<HomeMediaItem[]> => {
  try {
    const savedMovies = await getSavedMovies();

    return savedMovies.map((movie: any) => ({
      id: Number(movie.movieId),
      mediaType: movie.mediaType || "movie",
      title: movie.title || "Untitled",
      posterPath: movie.posterPath || null,
      backdropPath: movie.backdropPath || null,
      overview: movie.overview || "",
      releaseDate: movie.releaseDate || "",
      voteAverage: movie.voteAverage || 0,
    }));
  } catch (error) {
    console.log("Get my list movies error:", error);
    return [];
  }
};

// export type AppNotification = {
//   $id: string;
//   title: string;
//   message: string;
//   type: "info" | "warning" | "critical" | "update";
//   isActive: boolean;
//   $createdAt: string;
//   $updatedAt: string;
//   target?: "all" | "ios" | "android";
// };

// const NOTIFICATIONS_COLLECTION_ID =
//   process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID!;

// export const getSystemNotifications = async (): Promise<AppNotification[]> => {
//   try {
//     const response = await database.listDocuments(
//       DATABASE_ID,
//       NOTIFICATIONS_COLLECTION_ID,
//       [
//         Query.equal("isActive", true),
//         Query.orderDesc("$createdAt"),
//         Query.limit(30),
//       ]
//     );

//     return response.documents as unknown as AppNotification[];
//   } catch (error) {
//     console.log("Get system notifications error:", error);
//     return [];
//   }
// };

export const subscribeToMyListChanges = (
  userId: string,
  onChange: () => void
) => {
  const channel = `databases.${DATABASE_ID}.collections.${FAVORITES_COLLECTION_ID}.documents`;

  const unsubscribe = client.subscribe(channel, (response) => {
    const payload = response.payload as any;
    const events = response.events || [];

    const isFavoritesEvent = events.some((event: string) =>
      event.includes(
        `databases.${DATABASE_ID}.collections.${FAVORITES_COLLECTION_ID}.documents`
      )
    );

    if (!isFavoritesEvent) return;

    /**
     * If payload has userId, only refresh for the current user.
     * If payload does not have userId, refresh anyway because delete events
     * may not always give the full document shape depending on response.
     */
    if (payload?.userId && payload.userId !== userId) return;

    onChange();
  });

  return unsubscribe;
};

//Notification
export type ContentNotification = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  message: string;
  type: "movie" | "tv" | "category" | "update";
  category:
    | "movies"
    | "comedies"
    | "series"
    | "tv_shows"
    | "anime"
    | "new_hot"
    | "romance"
    | "action";
  mediaId?: string;
  mediaType?: "movie" | "tv";
  posterPath?: string;
  isActive: boolean;
};

const NOTIFICATIONS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID!;

export const getContentNotifications = async (): Promise<
  ContentNotification[]
> => {
  try {
    const response = await database.listDocuments(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      [
        Query.equal("isActive", true),
        Query.orderDesc("$createdAt"),
        Query.limit(30),
      ]
    );

    return response.documents as unknown as ContentNotification[];
  } catch (error) {
    console.log("Get content notifications error:", error);
    return [];
  }
};
