import { Client, Databases, Query } from "react-native-appwrite";
import i18n from "@/interfaces/i18n";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const GENRES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_GENRES_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export type AppGenreDocument = {
  $id: string;
  genreId: string;
  icon: string;
  name_en: string;
  name_fr?: string;
  name_es?: string;
  name_de?: string;
  name_pt?: string;
  name_ja?: string;
  name_ko?: string;
  name_ar?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type MovieGenre = {
  id: string;
  icon: string;
  name: string;
  sortOrder?: number;
};

const LANGUAGE_FIELD_MAP: Record<string, keyof AppGenreDocument> = {
  en: "name_en",
  fr: "name_fr",
  es: "name_es",
  de: "name_de",
  pt: "name_pt",
  ja: "name_ja",
  ko: "name_ko",
  ar: "name_ar",
};

const getSafeLanguageCode = (language?: string) => {
  const code = language?.split("-")[0] || "en";

  return LANGUAGE_FIELD_MAP[code] ? code : "en";
};

const getLocalizedGenreName = (
  genre: AppGenreDocument,
  language?: string
) => {
  const code = getSafeLanguageCode(language);
  const field = LANGUAGE_FIELD_MAP[code];

  return String(genre[field] || genre.name_en || genre.genreId);
};

export const getMovieGenres = async (
  language = i18n.language
): Promise<MovieGenre[]> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      GENRES_COLLECTION_ID,
      [
        Query.equal("isActive", true),
        Query.orderAsc("sortOrder"),
        Query.limit(100),
      ]
    );

    return result.documents.map((document) => {
      const genre = document as unknown as AppGenreDocument;

      return {
        id: genre.genreId,
        icon: genre.icon,
        name: getLocalizedGenreName(genre, language),
        sortOrder: genre.sortOrder,
      };
    });
  } catch (error: any) {
    console.log("Error fetching genres:", {
      message: error?.message,
      code: error?.code,
      type: error?.type,
      response: error?.response,
    });

    return [];
  }
};