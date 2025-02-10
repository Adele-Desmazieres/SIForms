// Custom button component 

import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface CustomButtonProps {
    onPress: () => void;
    title: string;
    mode?: "text" | "outlined" | "contained" | "elevated";
    color?: string;
    textColor?: string;
    labelStyle?: object;
    style?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    title,
    mode = 'elevated',
    color,
    textColor,
    labelStyle,
    style,
}) => {
    return (
        <Button
          mode={mode}
          onPress={onPress}
          style={[styles.button, style, color && { backgroundColor: color }]}
          contentStyle={styles.content}
          labelStyle={[{ color: textColor }, labelStyle]}
        >
          {title}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
      borderRadius: 30,
      alignSelf: "center",
    },
    content: {
      paddingVertical: 7,
      paddingHorizontal: 20,

    },
  });
  
  export default CustomButton;