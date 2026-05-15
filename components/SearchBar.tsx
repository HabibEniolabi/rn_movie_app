import { View, Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import { useTranslation } from "react-i18next";

interface Props {
  onPress?: () => void;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

const SearchBar = ({ onPress, placeholder, value, onChangeText }: Props) => {
  const { t, i18n } = useTranslation();
  
  const currentLanguage = i18n.language?.split("-")[0] || "en";
  const isRTL = RTL_LANGUAGES.includes(currentLanguage);
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      className="flex-row items-center bg-dark-200 rounded-full px-5 py-4"
      style={{
        flexDirection: isRTL ? "row-reverse" : "row",
      }}
    >
      <Image source={icons.search} className="size-5" tintColor="#AB8BFF" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={!onPress}
        placeholder={placeholder || t("search.placeholder")}
        placeholderTextColor="#A8B5DB"
        className="flex-1 text-white"
        style={{
          marginLeft: isRTL ? 0 : 12,
          marginRight: isRTL ? 12 : 0,
          textAlign: isRTL ? "right" : "left",
          writingDirection: isRTL ? "rtl" : "ltr",
        }}
      />
    </TouchableOpacity>
  );
};

export default SearchBar;
