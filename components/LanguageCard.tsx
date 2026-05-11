import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Feather from "react-native-vector-icons/Feather";


const LanguageCard = ({
  item,
  selected,
  onPress,
}: {
  item: {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
  };
  selected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`min-h-[105px] rounded-[24px] border px-7 mb-3 flex-row items-center justify-between ${
        selected
          ? 'bg-[#24104A] border-[#9B4DFF]'
          : 'bg-dark-300 border-[#2A2845]'
      }`}
    >
      <View className="flex-row items-center">
        <Text className="text-[30px] mr-6">{item.flag}</Text>

        <View>
          <Text className="text-white text-[22px] font-bold">
            {item.name}
          </Text>

          <Text className="text-[#7A7699] text-[18px] font-semibold mt-1">
            {item.nativeName}
          </Text>
        </View>
      </View>

      <View
        className={`w-[46px] h-[46px] rounded-full border-[3px] items-center justify-center ${
          selected
            ? 'bg-[#9B4DFF] border-[#9B4DFF]'
            : 'border-[#333052]'
        }`}
      >
        {selected && (
          <Feather name="check" size={24} color="#FFFFFF" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LanguageCard