import { TMDB_CONFIG, getTMDBLanguage } from "@/services/api";

export type HomeMediaType = "movie" | "tv";

export type HomeMediaItem = {
  id: number;
  mediaType: HomeMediaType;
  title: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  overview?: string;
  releaseDate?: string;
  voteAverage?: number;
};

export type HomeSection = {
  id: string;
  titleKey: string;
  type: "movie" | "tv";
  items: HomeMediaItem[];
  variant?: "normal" | "top10" | "large";
  showSeeAll?: boolean;
};

type SectionConfig = {
  id: string;
  titleKey: string;
  type: "movie" | "tv";
  path: string;
  params?: Record<string, string>;
  variant?: "normal" | "top10" | "large";
};

const normalizeMovie = (item: any): HomeMediaItem => ({
  id: item.id,
  mediaType: "movie",
  title: item.title || item.original_title || "Untitled",
  posterPath: item.poster_path,
  backdropPath: item.backdrop_path,
  overview: item.overview,
  releaseDate: item.release_date,
  voteAverage: item.vote_average,
});

const normalizeTV = (item: any): HomeMediaItem => ({
  id: item.id,
  mediaType: "tv",
  title: item.name || item.original_name || "Untitled",
  posterPath: item.poster_path,
  backdropPath: item.backdrop_path,
  overview: item.overview,
  releaseDate: item.first_air_date,
  voteAverage: item.vote_average,
});

const fetchTMDB = async (
  path: string,
  params: Record<string, string> = {}
) => {
  const language = getTMDBLanguage();
  const url = new URL(`${TMDB_CONFIG.BASE_URL}${path}`);

  url.searchParams.append("language", language);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.status_message || "Failed to fetch home section");
  }

  return data.results || [];
};

const cleanItems = (items: HomeMediaItem[]) => {
  return items.filter((item) => item.posterPath);
};

const HOME_SECTION_CONFIGS: SectionConfig[] = [
  {
    id: "top_tv_ng",
    titleKey: "home.topTVShowsNigeria",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      watch_region: "NG",
      "vote_count.gte": "200",
    },
    variant: "top10",
  },
  {
    id: "only_on_movieflix",
    titleKey: "home.onlyOnMovieflix",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "vote_average.desc",
      "vote_count.gte": "1000",
    },
    variant: "large",
  },
  {
    id: "because_you_liked",
    titleKey: "home.becauseYouLiked",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "popularity.desc",
      "vote_count.gte": "300",
    },
  },
  {
    id: "anime",
    titleKey: "home.anime",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_genres: "16",
    },
  },
  {
    id: "new_on_movieflix",
    titleKey: "home.newOnMovieflix",
    type: "movie",
    path: "/movie/now_playing",
    params: {
      region: "NG",
    },
  },
  {
    id: "us_tv_shows",
    titleKey: "home.usTVShows",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_origin_country: "US",
    },
  },
  {
    id: "top_movies_ng",
    titleKey: "home.topMoviesNigeria",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "popularity.desc",
      region: "NG",
      "vote_count.gte": "300",
    },
    variant: "top10",
  },
  {
    id: "suspenseful_tv",
    titleKey: "home.suspensefulTVShows",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_genres: "80,9648",
    },
  },
  {
    id: "anime_series",
    titleKey: "home.animeSeries",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_genres: "16",
    },
  },
  {
    id: "kids_movies",
    titleKey: "home.kidsMovies",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "popularity.desc",
      with_genres: "10751",
    },
  },
  {
    id: "bingeworthy_tv",
    titleKey: "home.bingeworthyTVShows",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      "vote_count.gte": "700",
    },
  },
  {
    id: "watch_it_again",
    titleKey: "home.watchItAgain",
    type: "movie",
    path: "/movie/popular",
  },
  {
    id: "your_next_watch",
    titleKey: "home.yourNextWatch",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "popularity.desc",
      "vote_average.gte": "7",
      "vote_count.gte": "800",
    },
  },
  {
    id: "exciting_japanese_tv",
    titleKey: "home.excitingJapaneseTVShows",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_origin_country: "JP",
    },
  },
  {
    id: "us_tv_action",
    titleKey: "home.usTVActionAdventure",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_origin_country: "US",
      with_genres: "10759",
    },
  },
  {
    id: "us_tv_dramas",
    titleKey: "home.usTVDramas",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_origin_country: "US",
      with_genres: "18",
    },
  },
  {
    id: "get_in_on_action",
    titleKey: "home.getInOnAction",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "popularity.desc",
      with_genres: "28",
    },
  },
];

export const fetchHomeSections = async (): Promise<HomeSection[]> => {
  const responses = await Promise.all(
    HOME_SECTION_CONFIGS.map(async (section) => {
      const results = await fetchTMDB(section.path, section.params || {});

      const items =
        section.type === "movie"
          ? cleanItems(results.map(normalizeMovie))
          : cleanItems(results.map(normalizeTV));

      return {
        id: section.id,
        titleKey: section.titleKey,
        type: section.type,
        variant: section.variant || "normal",
        items: items.slice(0, section.variant === "top10" ? 10 : 20),
      };
    })
  );

  return responses.filter((section) => section.items.length > 0);
};