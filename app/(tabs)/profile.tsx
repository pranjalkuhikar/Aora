import { View, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import { StatusBar } from "expo-status-bar";
import useAppwrite from "@/lib/useAppwrite";
import { getUserPosts, signOut } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";
import { router } from "expo-router";

interface UserProps {
  username?: string;
  avatar: string;
  $id?: string;
}

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const typedUser = user as UserProps;

  const { data: posts } = useAppwrite(() => getUserPosts(typedUser.$id));
  const logout = async () => {
    await signOut();
    setUser("");
    setIsLogged(false);
    router.replace("/sign-in");
  };
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
            <View className="w-ful items-center justify-center mt-6 mb-12 px-4">
              <TouchableOpacity
                className="w-full items-end mb-10"
                onPress={logout}
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
              <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                <Image
                  source={{ uri: (user as UserProps)?.avatar ?? "" }}
                  resizeMode="cover"
                  className="w-[90%] h-[90%] rounded-lg"
                />
              </View>
              <InfoBox
                title={typedUser.username || ""}
                containerStyles="mt-5"
                titleStyles="text-lg"
              />
              <View className="mt-5 flex-row">
                <InfoBox
                  title={String(posts.length) || ""}
                  subtitle="Posts"
                  containerStyles="mr-10"
                  titleStyles="text-xl"
                />
                <InfoBox
                  title="1.2k"
                  subtitle="Followers"
                  titleStyles="text-xl"
                />
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

export default Profile;
