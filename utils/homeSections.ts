import { TMDB_CONFIG, getTMDBLanguage } from "@/services/api";
import { getDailyShuffleSlot, seededShuffle } from "@/utils/seededShuffle";

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
  type: "movie" | "tv" | "mixed";
  items: HomeMediaItem[];
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
    throw new Error(data?.status_message || "Failed to fetch TMDB data");
  }

  return data.results || [];
};

const cleanItems = (items: HomeMediaItem[]) => {
  return items.filter((item) => item.posterPath && item.backdropPath);
};

export const fetchHomeSections = async (
  selectedGenreIds: string[] = []
): Promise<HomeSection[]> => {
  const shuffleSlot = getDailyShuffleSlot(6); // 6 times daily. Use 4 for 4 times daily.

  const genreQuery = selectedGenreIds.length
    ? selectedGenreIds.join(",")
    : "";

  const [
    trendingMovies,
    gemsForYou,
    newMovies,
    topTVShows,
    popularTVShows,
    comedyMovies,
    romanticMovies,
    animeShows,
    bingeTVShows,
  ] = await Promise.all([
    fetchTMDB("/trending/movie/week"),

    fetchTMDB("/discover/movie", {
      sort_by: "popularity.desc",
      with_genres: genreQuery,
      "vote_count.gte": "300",
    }),

    fetchTMDB("/movie/now_playing"),

    fetchTMDB("/tv/top_rated", {
      "vote_count.gte": "500",
    }),

    fetchTMDB("/tv/popular"),

    fetchTMDB("/discover/movie", {
      sort_by: "popularity.desc",
      with_genres: "35",
      "vote_count.gte": "300",
    }),

    fetchTMDB("/discover/movie", {
      sort_by: "popularity.desc",
      with_genres: "10749",
      "vote_count.gte": "300",
    }),

    fetchTMDB("/discover/tv", {
      sort_by: "popularity.desc",
      with_genres: "16",
      "vote_count.gte": "100",
    }),

    fetchTMDB("/discover/tv", {
      sort_by: "popularity.desc",
      "vote_count.gte": "700",
    }),
  ]);

  const sections: HomeSection[] = [
    {
      id: "top_movies",
      titleKey: "home.topMovies",
      type: "movie",
      items: cleanItems(trendingMovies.map(normalizeMovie)),
    },
    {
      id: "gems_for_you",
      titleKey: "home.gemsForYou",
      type: "movie",
      items: cleanItems(gemsForYou.map(normalizeMovie)),
    },
    {
      id: "new_on_movieflix",
      titleKey: "home.newOnMovieflix",
      type: "movie",
      items: cleanItems(newMovies.map(normalizeMovie)),
    },
    {
      id: "top_tv_shows",
      titleKey: "home.topTVShows",
      type: "tv",
      items: cleanItems(topTVShows.map(normalizeTV)),
    },
    {
      id: "popular_tv_shows",
      titleKey: "home.popularTVShows",
      type: "tv",
      items: cleanItems(popularTVShows.map(normalizeTV)),
    },
    {
      id: "comedies",
      titleKey: "home.comedies",
      type: "movie",
      items: cleanItems(comedyMovies.map(normalizeMovie)),
    },
    {
      id: "romantic_picks",
      titleKey: "home.romanticPicks",
      type: "movie",
      items: cleanItems(romanticMovies.map(normalizeMovie)),
    },
    {
      id: "anime",
      titleKey: "home.anime",
      type: "tv",
      items: cleanItems(animeShows.map(normalizeTV)),
    },
    {
      id: "bingeworthy_tv",
      titleKey: "home.bingeworthyTVShows",
      type: "tv",
      items: cleanItems(bingeTVShows.map(normalizeTV)),
    },
  ];

  return sections.map((section) => ({
    ...section,
    items: seededShuffle(
      section.items,
      `${shuffleSlot}-${section.id}`
    ).slice(0, 20),
  }));
};