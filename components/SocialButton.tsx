import React from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AuthButtonProps = {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  imageSource?: ImageSourcePropType;
};

const SocialButton = ({ title, onPress, icon, imageSource }: AuthButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-1 px-5 py-5 rounded-[18px] border border-[#2A2845] bg-[#141325] flex-row items-center justify-center gap-2"
    >
      {imageSource && (
        <Image
          source={imageSource}
          className="w-6 h-6 rounded-[4px]"
          resizeMode="contain"
        />
      )}

      {icon && <View>{icon}</View>}

      <Text className="text-[#EDEAF8] text-base font-bold">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SocialButton;