import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { StatusBar } from "expo-status-bar";
import useAppwrite from "@/lib/useAppwrite";
import { searchPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query: searchQuery } = useLocalSearchParams();
  const formattedQuery = Array.isArray(searchQuery)
    ? searchQuery.join(" ")
    : String(searchQuery);

  const { data: posts, refetch } = useAppwrite(() =>
    searchPosts(formattedQuery)
  );

  useEffect(() => {
    refetch();
  }, [formattedQuery]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.$id}
        renderItem={({ item }: { item: any }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            Creator={item.Creator.username}
            avatar={item.Creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="my-6 px-4 ">
              <Text className="text-sm text-gray-100 font-pmedium">
                Search Result
              </Text>
              <Text className="text-2xl  font-psemibold text-white">
                {formattedQuery}
              </Text>
              <View className="mt-8 mb-8">
                <SearchInput initialQuery={formattedQuery} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Video Found"
            subtitle="No Video Found fot this search query"
          />
        )}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Search;
