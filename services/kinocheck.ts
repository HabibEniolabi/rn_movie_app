import i18n from "@/interfaces/i18n";

const KINOCHECK_BASE_URL = "https://api.kinocheck.com";

const KINOCHECK_API_KEY = process.env.EXPO_PUBLIC_KINOCHECK_API_KEY;

export type KinoCheckVideo = {
  id: string;
  youtube_video_id?: string;
  youtube_channel_id?: string;
  youtube_thumbnail?: string;
  title: string;
  url?: string;
  thumbnail?: string;
  language?: string;
  categories?: string[];
  published?: string;
  views?: string | number;
  resource?: {
    type?: "movie" | "show";
    path?: string;
    id?: string;
    imdb_id?: string;
    tmdb_id?: number;
  };
};

export type KinoCheckMovieResponse = {
  id: string;
  tmdb_id: number | null;
  imdb_id: string | null;
  language: string;
  title: string;
  url?: string;
  trailer?: KinoCheckVideo | null;
  videos?: KinoCheckVideo[];
  recommendations?: {
    id: string;
    tmdb_id: number;
    imdb_id?: string;
    language?: string;
    title: string;
    url?: string;
  }[];
};

export type AppTrailerVideo = {
  id: string;
  key: string;
  name: string;
  site: "YouTube" | "KinoCheck";
  type: string;
  official: boolean;
  published_at: string;
  thumbnail?: string;
  source: "kinocheck";
};

const getKinoCheckLanguage = () => {
  const lang = i18n.language?.split("-")[0] || "en";

  // KinoCheck public docs list only "de" and "en" as acceptable language values.
  if (lang === "de") return "de";

  return "en";
};

const getKinoCheckHeaders = () => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (KINOCHECK_API_KEY) {
    headers["X-Api-Key"] = KINOCHECK_API_KEY;
    headers["X-Api-Host"] = "api.kinocheck.com";
  }

  return headers;
};

const buildKinoCheckUrl = (
  path: string,
  params: Record<string, string | number | undefined>
) => {
  const url = new URL(`${KINOCHECK_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
};

const mapKinoCheckVideoToAppTrailer = (
  video: KinoCheckVideo
): AppTrailerVideo | null => {
  if (!video.youtube_video_id) return null;

  const firstCategory = video.categories?.[0] || "Trailer";

  return {
    id: video.id,
    key: video.youtube_video_id,
    name: video.title,
    site: "YouTube",
    type: firstCategory,
    official: true,
    published_at: video.published || "",
    thumbnail: video.thumbnail || video.youtube_thumbnail,
    source: "kinocheck",
  };
};

export const fetchKinoCheckMovie = async (
  tmdbId: string | number
): Promise<KinoCheckMovieResponse | null> => {
  const language = getKinoCheckLanguage();

  const endpoint = buildKinoCheckUrl("/movies", {
    tmdb_id: tmdbId,
    language,
    categories: "Trailer,Teaser,Clip,Featurette",
    limit: 100,
  });

  const response = await fetch(endpoint, {
    method: "GET",
    headers: getKinoCheckHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch KinoCheck movie");
  }

  return data;
};

export const fetchKinoCheckTrailers = async (
  tmdbId: string | number
): Promise<AppTrailerVideo[]> => {
  const movieData = await fetchKinoCheckMovie(tmdbId);

  if (!movieData) return [];

  const allVideos = [
    ...(movieData.trailer ? [movieData.trailer] : []),
    ...(movieData.videos || []),
  ];

  const uniqueVideos = new Map<string, AppTrailerVideo>();

  allVideos.forEach((video) => {
    const mappedVideo = mapKinoCheckVideoToAppTrailer(video);

    if (!mappedVideo) return;

    uniqueVideos.set(mappedVideo.key, mappedVideo);
  });

  return Array.from(uniqueVideos.values());
};