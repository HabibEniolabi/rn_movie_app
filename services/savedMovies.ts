import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVED_MOVIES_KEY = "savedMovies";

export type SavedMovie = {
  tmdbMovieId: number;
  title: string;
  posterPath: string;
  voteAverage?: number;
  releaseDate?: string;
  savedAt: string;
};

export const getSavedMovies = async (): Promise<SavedMovie[]> => {
  try {
    const raw = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.log("Error getting saved movies:", error);
    return [];
  }
};

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  const savedMovies = await getSavedMovies();
  return savedMovies.some((movie) => movie.tmdbMovieId === movieId);
};

export const saveMovie = async (movie: SavedMovie) => {
  try {
    const savedMovies = await getSavedMovies();

    const alreadySaved = savedMovies.some(
      (item) => item.tmdbMovieId === movie.tmdbMovieId
    );

    if (alreadySaved) return savedMovies;

    const updatedMovies = [movie, ...savedMovies];
    await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));

    return updatedMovies;
  } catch (error) {
    console.log("Error saving movie:", error);
    return [];
  }
};

export const removeSavedMovie = async (movieId: number) => {
  try {
    const savedMovies = await getSavedMovies();

    const updatedMovies = savedMovies.filter(
      (movie) => movie.tmdbMovieId !== movieId
    );

    await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));

    return updatedMovies;
  } catch (error) {
    console.log("Error removing saved movie:", error);
    return [];
  }
};

export const toggleSavedMovie = async (movie: SavedMovie) => {
  const alreadySaved = await isMovieSaved(movie.tmdbMovieId);

  if (alreadySaved) {
    await removeSavedMovie(movie.tmdbMovieId);
    return false;
  } else {
    await saveMovie(movie);
    return true;
  }
};