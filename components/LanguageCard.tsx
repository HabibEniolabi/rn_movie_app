import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";

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
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} className="mb-3">
      <LinearGradient
        colors={selected ? ["#D83EBE", "#9B4DFF"] : ["#2A2845", "#2A2845"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 1.5,
        }}
      >
        <View
          className={`min-h-[75px] rounded-[23px] px-6 flex-row items-center justify-between ${
            selected ? "bg-[#24104A]" : "bg-dark-300"
          }`}
        >
          <View className="flex-row items-center flex-1">
            <Text className="text-[30px] mr-5">{item.flag}</Text>

            <View className="flex-1">
              <Text className="text-white text-[22px] font-bold">
                {item.name}
              </Text>

              <Text className="text-[#7A7699] text-[18px] font-semibold mt-1">
                {item.nativeName}
              </Text>
            </View>
          </View>

          <LinearGradient
            colors={selected ? ["#D83EBE", "#9B4DFF"] : ["#333052", "#333052"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 46,
              height: 46,
              borderRadius: 999,
              padding: selected ? 0 : 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              className={`w-full h-full rounded-full items-center justify-center ${
                selected ? "" : "bg-dark-300"
              }`}
            >
              {selected && <Feather name="check" size={24} color="#FFFFFF" />}
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default LanguageCard;