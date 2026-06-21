import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import {
  getSavedMovies,
  saveFavorite,
  removeFavorite,
  subscribeToMyListChanges,
  type SavedMovie,
} from "@/services/appwrite";

type MediaType = "movie" | "tv";

type MyListContextValue = {
  savedMovies: SavedMovie[];
  loading: boolean;
  isInMyList: (id: number | string, mediaType?: MediaType) => boolean;
  refreshMyList: () => Promise<void>;
  addToMyList: (media: any, mediaType: MediaType) => Promise<SavedMovie>;
  removeFromMyList: (
    id: number | string,
    mediaType: MediaType
  ) => Promise<void>;
};

const MyListContext = createContext<MyListContextValue | undefined>(undefined);

const getSavedKey = (id: number | string, mediaType: MediaType = "movie") => {
  return `${mediaType}:${String(id)}`;
};

export const MyListProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUserId, setAuthUserId] = useState<string | null>(
    FIREBASE_AUTH.currentUser?.uid || null
  );

  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshMyList = useCallback(async () => {
    if (!FIREBASE_AUTH.currentUser) {
      setSavedMovies([]);
      return;
    }

    setLoading(true);

    try {
      const movies = await getSavedMovies();
      setSavedMovies(movies);
    } catch (error) {
      console.log("Refresh My List error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setAuthUserId(user?.uid || null);

      if (!user) {
        setSavedMovies([]);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authUserId) return;

    console.log("✅ Subscribing to My List realtime:", authUserId);

    const unsubscribe = subscribeToMyListChanges(authUserId, () => {
      refreshMyList();
    });

    refreshMyList();

    return () => {
      console.log("🛑 Unsubscribing from My List realtime");
      unsubscribe();
    };
  }, [authUserId, refreshMyList]);

  const savedKeys = useMemo(() => {
    return new Set(
      savedMovies.map((movie) =>
        getSavedKey(
          movie.movieId,
          movie.mediaType === "tv" ? "tv" : "movie"
        )
      )
    );
  }, [savedMovies]);

  const isInMyList = useCallback(
    (id: number | string, mediaType: MediaType = "movie") => {
      return savedKeys.has(getSavedKey(id, mediaType));
    },
    [savedKeys]
  );

  const addToMyList = useCallback(
    async (media: any, mediaType: MediaType) => {
      const saved = await saveFavorite({
        ...media,
        mediaType,
      });

      setSavedMovies((current) => {
        const savedKey = getSavedKey(
          saved.movieId,
          saved.mediaType === "tv" ? "tv" : "movie"
        );

        const alreadyExists = current.some((item) => {
          const itemKey = getSavedKey(
            item.movieId,
            item.mediaType === "tv" ? "tv" : "movie"
          );

          return itemKey === savedKey;
        });

        if (alreadyExists) return current;

        return [saved, ...current];
      });

      refreshMyList();

      return saved;
    },
    [refreshMyList]
  );

  const removeFromMyList = useCallback(
    async (id: number | string, mediaType: MediaType) => {
      const keyToRemove = getSavedKey(id, mediaType);

      setSavedMovies((current) =>
        current.filter((item) => {
          const itemKey = getSavedKey(
            item.movieId,
            item.mediaType === "tv" ? "tv" : "movie"
          );

          return itemKey !== keyToRemove;
        })
      );

      await removeFavorite(id, mediaType);

      refreshMyList();
    },
    [refreshMyList]
  );

  return (
    <MyListContext.Provider
      value={{
        savedMovies,
        loading,
        isInMyList,
        refreshMyList,
        addToMyList,
        removeFromMyList,
      }}
    >
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const context = useContext(MyListContext);

  if (!context) {
    throw new Error("useMyList must be used inside MyListProvider");
  }

  return context;
};