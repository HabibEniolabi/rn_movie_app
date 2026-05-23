import { ImageSourcePropType } from "react-native";
import { images } from "@/constants/images";

export type AvatarType = "initials" | "gallery" | "memoji";

export type ProfileAvatarOption = {
  key: string;
  type: AvatarType;
  image?: ImageSourcePropType;
  backgroundColor?: string;
};

const MEMOJI_BACKGROUNDS = [
  "#E9DDFF", // soft lavender
  "#FFE1F3", // soft pink
  "#DFF7FF", // icy blue
  "#E6FBEA", // mint green
  "#FFF1D6", // warm cream
  "#E7E9FF", // pale indigo
  "#F2E8FF", // light violet
  "#FFE8DD", // peach
  "#D7F9F1", // aqua mint
  "#FFF5CC", // pastel yellow
  "#E3F2FD", // sky blue
  "#FCE7F3", // rose pink
  "#EDE9FE", // purple mist
  "#DCFCE7", // fresh green
  "#FEF3C7", // soft amber
  "#FEE2E2", // blush red
  "#DBEAFE", // calm blue
  "#FAE8FF", // orchid tint
  "#CCFBF1", // teal tint
  "#FFEDD5", // orange cream
  "#F0FDFA", // very soft cyan
  "#FDF2F8", // baby pink
  "#ECFCCB", // lime pastel
  "#F5F3FF", // dreamy purple
  "#E0F2FE", // light ocean blue
];

const getStableBackground = (key: string) => {
  const index = key
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return MEMOJI_BACKGROUNDS[index % MEMOJI_BACKGROUNDS.length];
};

export const GALLERY_AVATARS: ProfileAvatarOption[] = [
  {
    key: "profileGalleryPopcorn",
    type: "gallery",
    image: images.profileGalleryPopcorn,
  },
  {
    key: "profileGalleryCinema",
    type: "gallery",
    image: images.profileGalleryCinema,
  },
  {
    key: "profileGallerySuperhero",
    type: "gallery",
    image: images.profileGallerySuperhero,
  },
  {
    key: "profileGalleryTom",
    type: "gallery",
    image: images.profileGalleryTom,
  },
  {
    key: "profileGalleryVerify",
    type: "gallery",
    image: images.profileGalleryVerify,
  },
  {
    key: "profileGalleryCold",
    type: "gallery",
    image: images.profileGalleryCold,
  },
  {
    key: "profileGalleryBaby",
    type: "gallery",
    image: images.profileGalleryBaby,
  },
  {
    key: "profileGalleryMoot",
    type: "gallery",
    image: images.profileGalleryMoot,
  },
  {
    key: "profileGalleryChill",
    type: "gallery",
    image: images.profileGalleryChill,
  },
  {
    key: "profileGalleryLuffy",
    type: "gallery",
    image: images.profileGalleryLuffy,
  },
  {
    key: "profileGalleryNews",
    type: "gallery",
    image: images.profileGalleryNews,
  },
];

export const MEMOJI_AVATARS: ProfileAvatarOption[] = [
  {
    key: "memojiOne",
    type: "memoji",
    image: images.memojiOne,
    backgroundColor: getStableBackground("memojiOne"),
  },
  {
    key: "memojiTwo",
    type: "memoji",
    image: images.memojiTwo,
    backgroundColor: getStableBackground("memojiTwo"),
  },
  {
    key: "memojiThree",
    type: "memoji",
    image: images.memojiThree,
    backgroundColor: getStableBackground("memojiThree"),
  },
  {
    key: "memojiFour",
    type: "memoji",
    image: images.memojiFour,
    backgroundColor: getStableBackground("memojiFour"),
  },
  {
    key: "memojiFive",
    type: "memoji",
    image: images.memojiFive,
    backgroundColor: getStableBackground("memojiFive"),
  },
  {
    key: "memojiSix",
    type: "memoji",
    image: images.memojiSix,
    backgroundColor: getStableBackground("memojiSix"),
  },
  {
    key: "memojiSeven",
    type: "memoji",
    image: images.memojiSeven,
    backgroundColor: getStableBackground("memojiSeven"),
  },
  {
    key: "memojiEight",
    type: "memoji",
    image: images.memojiEight,
    backgroundColor: getStableBackground("memojiEight"),
  },
  {
    key: "memojiNine",
    type: "memoji",
    image: images.memojiNine,
    backgroundColor: getStableBackground("memojiNine"),
  },
  {
    key: "memojiTen",
    type: "memoji",
    image: images.memojiTen,
    backgroundColor: getStableBackground("memojiTen"),
  },
  {
    key: "memojiEleven",
    type: "memoji",
    image: images.memojiEleven,
    backgroundColor: getStableBackground("memojiEleven"),
  },
];

export const ALL_PROFILE_AVATARS = [...GALLERY_AVATARS, ...MEMOJI_AVATARS];

export const getProfileAvatarByKey = (key?: string | null) => {
  if (!key) return undefined;

  return ALL_PROFILE_AVATARS.find((avatar) => avatar.key === key);
};
