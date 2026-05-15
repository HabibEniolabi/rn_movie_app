import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

const TabIcon = ({ icon, label, focused }: any) => {
  if(focused) {
     return (
       <ImageBackground
         source={images.highlight}
         className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center  items-center rounded-full overflow-hidden"
       >
         <Image source={icon} tintColor="#151312" className="size-5" />
         <Text className="text-secondary text-base font-semibold ml-2">
           {label}
         </Text>
       </ImageBackground>
     );
  }
  return (
    <View className="size-full items-center justify-center mt-4 rounded-full">
      <Image source={icon} tintColor="#A8B5DB" className="size-5" />
    </View>
  );
};
const Layout = () => {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle:{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0F0D23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.home}
              focused={focused}
              label={t("tabs.home")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t("tabs.search"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.search}
              focused={focused}
              label={t("tabs.search")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t("tabs.saved"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.save}
              focused={focused}
              label={t("tabs.saved")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.person}
              focused={focused}
              label={t("tabs.profile")}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
