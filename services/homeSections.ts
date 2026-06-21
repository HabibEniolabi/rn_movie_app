import { TMDB_CONFIG, getTMDBLanguage } from "@/services/api";

export type HomeMediaType = "movie" | "tv";
export type HomeSectionType = "movie" | "tv" | "mixed";

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
  title?: string;
  titleParams?: Record<string, string | number>;
  type: HomeSectionType;
  items: HomeMediaItem[];
  variant?: "normal" | "top10" | "large";
  showSeeAll?: boolean;
};

type SectionConfig = {
  id: string;
  titleKey: string;
  type: HomeSectionType;
  path: string;
  params?: Record<string, string>;
  variant?: "normal" | "top10" | "large";
  limit?: number;
  pages?: number[];
};

export type RecommendationSeed = {
  id: number | string;
  mediaType: HomeMediaType;
  title?: string;
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

const normalizeMixed = (item: any): HomeMediaItem | null => {
  if (item.media_type === "tv") {
    return normalizeTV(item);
  }

  if (item.media_type === "movie") {
    return normalizeMovie(item);
  }

  return null;
};

const fetchTMDB = async (path: string, params: Record<string, string> = {}) => {
  const language = getTMDBLanguage();
  const url = new URL(`${TMDB_CONFIG.BASE_URL}${path}`);

  url.searchParams.append("language", language);
  url.searchParams.append("include_adult", "false");

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
  return items.filter((item) => {
    return (
      item.id && item.posterPath && item.title && item.title !== "Untitled"
    );
  });
};

const getItemKey = (item: HomeMediaItem) => {
  return `${item.mediaType}:${item.id}`;
};

const getDateSeed = () => {
  return new Date().toISOString().split("T")[0];
};

const getSeedNumber = (value: string) => {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
};

const abbreviateTitle = (title?: string, maxLength = 24) => {
  if (!title) return "this";

  const cleanTitle = title.trim();

  if (cleanTitle.length <= maxLength) return cleanTitle;

  return `${cleanTitle.slice(0, maxLength).trim()}...`;
};

const stableShuffle = <T>(items: T[], seed: string) => {
  const copied = [...items];
  let currentIndex = copied.length;
  let seedNumber = getSeedNumber(seed);

  while (currentIndex !== 0) {
    seedNumber = (seedNumber * 9301 + 49297) % 233280;

    const randomIndex = Math.floor((seedNumber / 233280) * currentIndex);

    currentIndex -= 1;

    const temporaryValue = copied[currentIndex];
    copied[currentIndex] = copied[randomIndex];
    copied[randomIndex] = temporaryValue;
  }

  return copied;
};

const dedupeSectionItems = (
  items: HomeMediaItem[],
  seenKeys: Set<string>,
  limit: number,
  seed: string
) => {
  const sectionSeenKeys = new Set<string>();
  const shuffledItems = stableShuffle(items, seed);
  const uniqueItems: HomeMediaItem[] = [];

  for (const item of shuffledItems) {
    const itemKey = getItemKey(item);

    if (seenKeys.has(itemKey)) continue;
    if (sectionSeenKeys.has(itemKey)) continue;

    sectionSeenKeys.add(itemKey);
    seenKeys.add(itemKey);
    uniqueItems.push(item);

    if (uniqueItems.length >= limit) break;
  }

  return uniqueItems;
};

const normalizeBySectionType = (
  results: any[],
  type: HomeSectionType
): HomeMediaItem[] => {
  if (type === "movie") {
    return results.map(normalizeMovie);
  }

  if (type === "tv") {
    return results.map(normalizeTV);
  }

  return results.map(normalizeMixed).filter(Boolean) as HomeMediaItem[];
};

const fetchSectionRawItems = async (section: SectionConfig) => {
  const pages = section.pages || [1];

  const pageResults = await Promise.all(
    pages.map((page) =>
      fetchTMDB(section.path, {
        ...(section.params || {}),
        page: String(page),
      })
    )
  );

  const results = pageResults.flat();
  const items = normalizeBySectionType(results, section.type);

  return cleanItems(items);
};

const fetchBecauseYouLikedSection = async (
  seed: RecommendationSeed,
  seenKeys: Set<string>
): Promise<HomeSection | null> => {
  try {
    const mediaType = seed.mediaType === "tv" ? "tv" : "movie";

    const recommendationResults = await fetchTMDB(
      `/${mediaType}/${seed.id}/recommendations`,
      {
        page: "1",
      }
    );

    let items =
      mediaType === "tv"
        ? cleanItems(recommendationResults.map(normalizeTV))
        : cleanItems(recommendationResults.map(normalizeMovie));

    /**
     * TMDB recommendations can sometimes be empty.
     * Fallback to similar titles.
     */
    if (!items.length) {
      const similarResults = await fetchTMDB(
        `/${mediaType}/${seed.id}/similar`,
        {
          page: "1",
        }
      );

      items =
        mediaType === "tv"
          ? cleanItems(similarResults.map(normalizeTV))
          : cleanItems(similarResults.map(normalizeMovie));
    }

    const uniqueItems = dedupeSectionItems(
      items,
      seenKeys,
      20,
      `because_you_liked-${seed.mediaType}-${seed.id}-${getDateSeed()}`
    );

    if (!uniqueItems.length) return null;

    return {
      id: `because_you_liked_${seed.mediaType}_${seed.id}`,
      titleKey: "home.becauseYouLikedSpecific",
      title: `Because you liked ${abbreviateTitle(seed.title)}`,
      type: mediaType,
      variant: "normal",
      showSeeAll: false,
      items: uniqueItems,
    };
  } catch (error) {
    console.log("Because you liked section error:", error);
    return null;
  }
};

const HOME_SECTION_CONFIGS: SectionConfig[] = [
  {
    id: "top_searches",
    titleKey: "home.topSearches",
    type: "mixed",
    path: "/trending/all/week",
    variant: "top10",
    limit: 10,
    pages: [1, 2],
  },
  {
    id: "top_tv_ng",
    titleKey: "home.topTVShowsNigeria",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      watch_region: "NG",
      "vote_count.gte": "200",
      without_genres: "10763,10764,10767",
    },
    variant: "top10",
    limit: 10,
    pages: [1, 2],
  },
  {
    id: "tv_sci_fi_fantasy",
    titleKey: "home.tvSciFiFantasy",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_genres: "10765",
      "vote_count.gte": "100",
    },
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "teen_tv_shows",
    titleKey: "home.teenTVShows",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_genres: "18,35",
      "vote_count.gte": "80",
      without_genres: "10763,10764,10767",
    },
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "adventure_fantasy_twist",
    titleKey: "home.adventureFantasyTwist",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "popularity.desc",
      with_genres: "12,14",
      "vote_count.gte": "150",
    },
    variant: "large",
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "boredom_busters",
    titleKey: "home.boredomBusters",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "popularity.desc",
      with_genres: "35|12|10751",
      "vote_average.gte": "6.5",
      "vote_count.gte": "200",
    },
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "only_on_movieflix",
    titleKey: "home.onlyOnMovieflix",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "vote_average.desc",
      "vote_count.gte": "1500",
      without_genres: "99",
    },
    variant: "large",
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "new_on_movieflix",
    titleKey: "home.newOnMovieflix",
    type: "movie",
    path: "/movie/now_playing",
    params: {
      region: "NG",
    },
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "anime",
    titleKey: "home.anime",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_genres: "16",
      "vote_count.gte": "100",
    },
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "mind_bending_movies",
    titleKey: "home.mindBendingMovies",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "popularity.desc",
      with_genres: "878,9648",
      "vote_count.gte": "300",
    },
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "suspenseful_tv",
    titleKey: "home.suspensefulTVShows",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_genres: "80,9648",
      "vote_count.gte": "150",
    },
    limit: 20,
    pages: [1, 2],
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
      "vote_count.gte": "150",
    },
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "korean_dramas",
    titleKey: "home.koreanDramas",
    type: "tv",
    path: "/discover/tv",
    params: {
      sort_by: "popularity.desc",
      with_origin_country: "KR",
      with_genres: "18",
      "vote_count.gte": "80",
    },
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "kids_family_movies",
    titleKey: "home.kidsFamilyMovies",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "popularity.desc",
      with_genres: "10751,16",
      "vote_count.gte": "150",
    },
    limit: 20,
    pages: [1, 2],
  },
  {
    id: "get_in_on_action",
    titleKey: "home.getInOnAction",
    type: "movie",
    path: "/discover/movie",
    params: {
      sort_by: "popularity.desc",
      with_genres: "28",
      "vote_count.gte": "300",
    },
    limit: 20,
    pages: [1, 2],
  },
];

export const fetchHomeSections = async (
  recommendationSeed?: RecommendationSeed
): Promise<HomeSection[]> => {
  const seenKeys = new Set<string>();
  const dateSeed = getDateSeed();

  const rawSections = await Promise.all(
    HOME_SECTION_CONFIGS.map(async (section) => {
      try {
        const items = await fetchSectionRawItems(section);

        return {
          section,
          items,
        };
      } catch (error) {
        console.log(`Failed to fetch section ${section.id}:`, error);

        return {
          section,
          items: [],
        };
      }
    })
  );

  const sections: HomeSection[] = [];

  for (const { section, items } of rawSections) {
    const limit = section.limit || (section.variant === "top10" ? 10 : 20);

    const uniqueItems = dedupeSectionItems(
      items,
      seenKeys,
      limit,
      `${section.id}-${dateSeed}`
    );

    if (!uniqueItems.length) continue;

    sections.push({
      id: section.id,
      titleKey: section.titleKey,
      type: section.type,
      variant: section.variant || "normal",
      showSeeAll: false,
      items: uniqueItems,
    });

    /**
     * Put "Because you liked..." close to the top,
     * after Top Searches / first major section.
     */
    if (sections.length === 2 && recommendationSeed) {
      const becauseSection = await fetchBecauseYouLikedSection(
        recommendationSeed,
        seenKeys
      );

      if (becauseSection) {
        sections.push(becauseSection);
      }
    }
  }

  return sections.filter((section) => section.items.length > 0);
};
