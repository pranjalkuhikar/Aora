import { icons } from "@/constants";
import { router, usePathname } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

const SearchInput = ({ initialQuery }: { initialQuery?: string }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="px-4 h-16 bg-black-100 rounded-2xl w-full border-2 space-x-4 border-black-200 items-center flex-row focus:border-secondary">
      <TextInput
        className="flex-1 text-white font-pregular text-base mt-0.5"
        value={query}
        placeholder="Search a Video Topic"
        placeholderTextColor={"#CDCDE0"}
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search results across database"
            );
          }
          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-6 h-6" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
