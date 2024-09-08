import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
interface VideoProps {
  title: string;
  Creator: string;
  avatar: string;
  thumbnail: string;
  video: string;
}

const VideoCard = ({
  title,
  Creator,
  avatar,
  thumbnail,
  video,
}: VideoProps) => {
  const [play, setPlay] = useState(false);

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex items-center justify-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex items-center justify-center p-0.5">
            <Image
              source={{ uri: avatar }}
              resizeMode="cover"
              className="w-full h-full rounded-lg"
            />
          </View>
          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {Creator}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image
            source={icons.menu}
            className="w-5 h-5 "
            resizeMode="contain"
          />
        </View>
      </View>
      {play ? (
        <Video
          source={{
            uri: video,
          }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if ((status as any).didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex items-center justify-center"
        >
          <Image
            source={{ uri: thumbnail }}
            resizeMode="cover"
            className="w-full h-full rounded-xl mt-3"
          />
          <Image
            source={icons.play}
            resizeMode="contain"
            className="w-12 h-12 absolute"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
