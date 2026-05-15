import i18n from "@/interfaces/i18n";

const TMDB_LANGUAGE_MAP: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  de: "de-DE",
  pt: "pt-PT",
  ja: "ja-JP",
  ko: "ko-KR",
  ar: "ar-SA",
};

export const getTMDBLanguage = () => {
  const appLanguage = i18n.language?.split("-")[0] || "en";

  return TMDB_LANGUAGE_MAP[appLanguage] || "en-US";
};

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const language = getTMDBLanguage();

  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=${language}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&language=${language}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();

  return data.results;
};

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  const language = getTMDBLanguage();
  try {
     const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}&append_to_response=release_dates&language=${language}`, {
       method: "GET",
       headers: TMDB_CONFIG.headers
     })
     if(!response.ok) throw new Error("Failed to fetch movie details");
     
     const data =  await response.json();
     return data;
  }catch(error) {
     console.log("Error fetching movie details:", error);
     throw error;
  }
}