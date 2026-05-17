import React from "react";
import { Text, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";

type PlanValue = string | number | "check" | "x" | "infinity";

const rows: {
  labelKey: string;
  free: PlanValue;
  pro: PlanValue;
  ultra: PlanValue;
}[] = [
  {
    labelKey: "planComparison.quickComparison.rows.movies",
    free: "100+",
    pro: "300+",
    ultra: "500+",
  },
  {
    labelKey: "planComparison.quickComparison.rows.quality",
    free: "720p",
    pro: "1080p",
    ultra: "4K HDR",
  },
  {
    labelKey: "planComparison.quickComparison.rows.screens",
    free: "1",
    pro: "2",
    ultra: "4",
  },
  {
    labelKey: "planComparison.quickComparison.rows.adFree",
    free: "x",
    pro: "check",
    ultra: "check",
  },
  {
    labelKey: "planComparison.quickComparison.rows.downloads",
    free: "x",
    pro: "10",
    ultra: "infinity",
  },
  {
    labelKey: "planComparison.quickComparison.rows.profiles",
    free: "1",
    pro: "3",
    ultra: "6",
  },
  {
    labelKey: "planComparison.quickComparison.rows.exclusives",
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
  const { t } = useTranslation();

  return (
    <View className="mt-10">
      <Text className="text-[#6A6880] text-[14px] font-extrabold tracking-[2px] mb-5">
        {t("planComparison.quickComparison.title")}
      </Text>

      <View className="flex-row">
        <View className="flex-[1.3]" />

        <View className="flex-1 items-center py-3">
          <Text className="text-[#8B88A8] text-[16px] font-bold">
            {t("planComparison.free.title")}
          </Text>
        </View>

        <View className="flex-1 items-center py-3 bg-[#151026]">
          <Text className="text-[#C084FC] text-[16px] font-bold">
            {t("planComparison.pro.title")}
          </Text>
        </View>

        <View className="flex-1 items-center py-3">
          <Text className="text-[#8B88A8] text-[16px] font-bold">
            {t("planComparison.ultra.title")}
          </Text>
        </View>
      </View>

      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;

        return (
          <View
            key={row.labelKey}
            className={`flex-row min-h-[58px] ${
              !isLast ? "border-b border-[#25243A]" : ""
            }`}
          >
            <View className="flex-[1.3] justify-center">
              <Text className="text-[#9B97B8] text-[17px] font-semibold">
                {t(row.labelKey)}
              </Text>
            </View>

            <View className="flex-1 items-center justify-center">
              <CellValue value={row.free} type="free" />
            </View>

            <View className="flex-1 items-center justify-center bg-[#151026]">
              <CellValue value={row.pro} type="pro" />
            </View>

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