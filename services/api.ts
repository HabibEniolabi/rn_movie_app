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

export type TMDBVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
};

export type MovieVideosResponse = {
  id: number;
  results: TMDBVideo[];
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
};

const mergeUniqueVideos = (videos: TMDBVideo[]) => {
  const uniqueVideos = new Map<string, TMDBVideo>();

  videos.forEach((video) => {
    if (!video?.key) return;

    uniqueVideos.set(video.key, video);
  });

  return Array.from(uniqueVideos.values());
};


export const playClickedMovies = async (
  movieId: string,
  languageOverride?: string
): Promise<MovieVideosResponse> => {
  const language = languageOverride || getTMDBLanguage();

  const params = new URLSearchParams({
    language,
  });

  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos?${params.toString()}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.status_message || "Failed to fetch movie videos");
  }

  return data;
};

export const fetchMovieVideos = async (
  movieId: string
): Promise<TMDBVideo[]> => {
  const currentLanguage = getTMDBLanguage();

  const currentLanguageData = await playClickedMovies(movieId, currentLanguage);

  let englishLanguageData: MovieVideosResponse = {
    id: Number(movieId),
    results: [],
  };

  if (currentLanguage !== "en-US") {
    englishLanguageData = await playClickedMovies(movieId, "en-US");
  }

  const mergedVideos = mergeUniqueVideos([
    ...(currentLanguageData.results || []),
    ...(englishLanguageData.results || []),
  ]);

  return mergedVideos.filter(
    (video) => video.key && video.site?.toLowerCase() === "youtube"
  );
};

export const fetchSimilarMovies = async (
  movieId: string,
  page = 1
): Promise<Movie[]> => {
  const language = getTMDBLanguage();

  const params = new URLSearchParams({
    language,
    page: String(page),
  });

  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/similar?${params.toString()}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.status_message || "Failed to fetch similar movies");
  }

  return data.results || [];
};



export type MovieCastMember = {
  id: number;
  name: string;
  original_name?: string;
  character?: string;
  profile_path?: string | null;
  order?: number;
};

export type MovieCrewMember = {
  id: number;
  name: string;
  original_name?: string;
  job?: string;
  department?: string;
  profile_path?: string | null;
};

export type MovieCreditsResponse = {
  id: number;
  cast: MovieCastMember[];
  crew: MovieCrewMember[];
};

export const fetchMovieCredits = async (
  movieId: string
): Promise<MovieCreditsResponse> => {
  const language = getTMDBLanguage();

  const params = new URLSearchParams({
    language,
  });

  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/credits?${params.toString()}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.status_message || "Failed to fetch movie credits");
  }

  return data;
};

export const fetchTVDetails = async (id: string) => {
  const language = getTMDBLanguage();

  const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${id}?language=${language}&append_to_response=credits`

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers
  });

  const data = await response.json();

  if(!response.ok) {
    throw new Error(data?.status_message || "Failed to fetch TV show details");
  }

  return data;
}