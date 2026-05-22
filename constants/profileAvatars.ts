import { ImageSourcePropType } from "react-native";
import { images } from "@/constants/images";

export type AvatarType = "initials" | "gallery" | "memoji";

export type ProfileAvatarOption = {
  key: string;
  type: AvatarType;
  image?: ImageSourcePropType;
  backgroundColor: string;
};

export const GALLERY_AVATARS: ProfileAvatarOption[] = [
  {
    key: "profileGalleryPopcorn",
    type: "gallery",
    image: images.profileGalleryPopcorn,
    backgroundColor: "#D946C4",
  },
  {
    key: "profileGalleryCinema",
    type: "gallery",
    image: images.profileGalleryCinema,
    backgroundColor: "#9B4DFF",
  },
  {
    key: "profileGallerySuperhero",
    type: "gallery",
    image: images.profileGallerySuperhero,
    backgroundColor: "#F97316",
  },
  {
    key: "profileGalleryTom",
    type: "gallery",
    image: images.profileGalleryTom,
    backgroundColor: "#1E40AF",
  },
  {
    key: "profileGalleryVerify",
    type: "gallery",
    image: images.profileGalleryVerify,
    backgroundColor: "#DC2626",
  },
];

export const MEMOJI_AVATARS: ProfileAvatarOption[] = [
  {
    key: "memojiOne",
    type: "memoji",
    image: images.memojiOne,
    backgroundColor: "#C044D8",
  },
  {
    key: "memojiTwo",
    type: "memoji",
    image: images.memojiTwo,
    backgroundColor: "#3B82F6",
  },
  {
    key: "memojiThree",
    type: "memoji",
    image: images.memojiThree,
    backgroundColor: "#10B981",
  },
  {
    key: "memojiFour",
    type: "memoji",
    image: images.memojiFour,
    backgroundColor: "#06B6D4",
  },
  {
    key: "memojiFive",
    type: "memoji",
    image: images.memojiFive,
    backgroundColor: "#EC4899",
  }
];

export const ALL_PROFILE_AVATARS = [
  ...GALLERY_AVATARS,
  ...MEMOJI_AVATARS,
];

export const getProfileAvatarByKey = (key?: string | null) => {
  if (!key) return undefined;

  return ALL_PROFILE_AVATARS.find((avatar) => avatar.key === key);
};