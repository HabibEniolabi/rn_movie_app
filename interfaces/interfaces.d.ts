interface Movie {
  id: number;
  title: string;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface TrendingMovie {
  searchTerm?: string;
  movie_id: number;
  title: string;
  mediaType?: "movie" | "tv";
  count?: number;
  poster_url: string;
}

interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  release_dates?: {
    results?: {
      iso_3166_1: string;
      release_dates?: {
        certification: string;
      }[];
    }[];
  };
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}

type MediaType = "movie" | "tv";

interface FavoriteMediaInput {
  id: number;

  // Movie uses title, TV uses name
  title?: string;
  name?: string;

  poster_path?: string | null;
  backdrop_path?: string | null;

  // Movie uses release_date, TV uses first_air_date
  release_date?: string;
  first_air_date?: string;

  vote_average?: number;
  vote_count?: number;

  overview?: string | null;

  // Movie uses runtime, TV can use episode_run_time
  runtime?: number | null;
  episode_run_time?: number[];

  genres?: {
    id: number;
    name: string;
  }[];

  mediaType?: MediaType;
}