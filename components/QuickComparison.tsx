import React from "react";
import { Text, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";

type PlanValue = string | number | "check" | "x" | "infinity";

const rows: {
  label: string;
  free: PlanValue;
  pro: PlanValue;
  ultra: PlanValue;
}[] = [
  {
    label: "Movies",
    free: "100+",
    pro: "300+",
    ultra: "500+",
  },
  {
    label: "Quality",
    free: "720p",
    pro: "1080p",
    ultra: "4K HDR",
  },
  {
    label: "Screens",
    free: "1",
    pro: "2",
    ultra: "4",
  },
  {
    label: "Ad-free",
    free: "x",
    pro: "check",
    ultra: "check",
  },
  {
    label: "Downloads",
    free: "x",
    pro: "10",
    ultra: "infinity",
  },
  {
    label: "Profiles",
    free: "1",
    pro: "3",
    ultra: "6",
  },
  {
    label: "Exclusives",
    free: "x",
    pro: "x",
    ultra: "check",
  },
];

const CellValue = ({
  value,
  type,
}: {
  value: PlanValue;
  type: "free" | "pro" | "ultra";
}) => {
  const textColor =
    type === "ultra"
      ? "text-[#FFD84D]"
      : type === "pro"
        ? "text-[#C084FC]"
        : "text-[#EDEAF8]";

  if (value === "check") {
    return <Feather name="check" size={26} color="#45E0B8" />;
  }

  if (value === "x") {
    return <Feather name="x" size={26} color="#343151" />;
  }

  if (value === "infinity") {
    return <Text className="text-[#FFD84D] text-[26px] font-bold">∞</Text>;
  }

  return (
    <Text className={`${textColor} text-[20px] font-extrabold`}>
      {value}
    </Text>
  );
};

const QuickComparison = () => {
  return (
    <View className="mt-10">
      <Text className="text-[#6A6880] text-[14px] font-extrabold tracking-[2px] mb-5">
        QUICK COMPARISON
      </Text>

      {/* Header */}
      <View className="flex-row">
        <View className="flex-[1.3]" />

        <View className="flex-1 items-center py-3">
          <Text className="text-[#8B88A8] text-[16px] font-bold">Free</Text>
        </View>

        <View className="flex-1 items-center py-3 bg-[#151026]">
          <Text className="text-[#C084FC] text-[16px] font-bold">Pro</Text>
        </View>

        <View className="flex-1 items-center py-3">
          <Text className="text-[#8B88A8] text-[16px] font-bold">Ultra</Text>
        </View>
      </View>

      {/* Rows */}
      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;

        return (
          <View
            key={row.label}
            className={`flex-row min-h-[58px] ${
              !isLast ? "border-b border-[#25243A]" : ""
            }`}
          >
            {/* Label */}
            <View className="flex-[1.3] justify-center">
              <Text className="text-[#9B97B8] text-[17px] font-semibold">
                {row.label}
              </Text>
            </View>

            {/* Free */}
            <View className="flex-1 items-center justify-center">
              <CellValue value={row.free} type="free" />
            </View>

            {/* Pro highlighted column */}
            <View className="flex-1 items-center justify-center bg-[#151026]">
              <CellValue value={row.pro} type="pro" />
            </View>

            {/* Ultra */}
            <View className="flex-1 items-center justify-center">
              <CellValue value={row.ultra} type="ultra" />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default QuickComparison;