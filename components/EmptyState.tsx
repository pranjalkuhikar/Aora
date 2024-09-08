import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

type emptyStateProps = {
  title: string;
  subtitle: string;
};

const EmptyState = ({ title, subtitle }: emptyStateProps) => {
  return (
    <View className="items-center justify-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[215px]"
      />
      <Text className="text-sm text-gray-100 font-pmedium">{title}</Text>
      <Text className="text-xl  font-psemibold text-center mt-2 text-white">
        {subtitle}
      </Text>
      <CustomButton
        title="Create Video"
        handlePress={() => router.push("/create")}
        containerStyles={"w-full my-5"}
      />
    </View>
  );
};

export default EmptyState;
