// Green Arrow Button Component

import React from "react";
import { StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import colors from "../constants/colors";

interface ArrowButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  onPress,
  size = 24, 
  color = colors.darkGreen, 
}) => {
  return (
    <IconButton
      icon="arrow-right"
      onPress={onPress}
      size={size}
      style={styles.button}
      iconColor={colors.white}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.lightGreen,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ArrowButton;
