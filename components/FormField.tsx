import { icons } from "@/constants";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

interface FormFieldProps {
  title: string;
  value?: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
}
const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="px-4 h-16 bg-black-100 rounded-2xl w-full border-2 border-black-200 items-center flex-row focus:border-secondary">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
