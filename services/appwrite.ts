import { Client, Databases, ID, Query, Account } from "react-native-appwrite";
import { FIREBASE_AUTH } from "@/FirebaseConfig";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const FAVORITES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

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
export const getTrendingMovies =  async():Promise<TrendingMovie[]> => {
  try {
     const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]); 
    return result.documents as unknown as TrendingMovie[];
  } catch(error) {
    console.error(error);
    return [];
  }
}

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

export const saveFavorite = async (movie: Movie | MovieDetails) => {
  try {
    console.log("🟡 Starting saveFavorite for:", movie.title);
    
    const firebaseUser = FIREBASE_AUTH.currentUser;
    
    console.log("🟡 Firebase user:", firebaseUser?.uid);
    
    if (!firebaseUser) {
      console.log("❌ No Firebase user found");
      throw new Error("User not authenticated");
    }

    const existingFavorite = await getExistingFavorite(movie.id);
    console.log("🟡 Existing favorite:", existingFavorite);

    if (existingFavorite) {
      console.log("✅ Already favorited");
      return existingFavorite;
    }

    console.log("🟡 Creating document in Appwrite...");
    
    const result = await database.createDocument(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      ID.unique(),
      {
        userId: firebaseUser.uid,
        movieId: String(movie.id),
        title: movie.title,
        posterPath: movie.poster_path ?? "",
        releaseDate: movie.release_date ?? "",
        voteAverage: movie.vote_average ?? 0,
        overview: movie.overview ?? "",
        runtime: "runtime" in movie ? `${movie.runtime} mins` : "",
        reviewCount: movie.vote_count ? `${movie.vote_count} reviews` : "",
        genres: 
          "genres" in movie
            ? movie.genres.map((genre) => genre.name).join(",")
            : "",
      }
    );

    console.log("✅ Favorite saved:", result);
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