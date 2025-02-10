// Custom text input component white rounded with a green border and green text color and left icon.

import React from 'react';
import { StyleSheet } from 'react-native';
import {  TextInput} from 'react-native-paper';
import colors from '../constants/colors';

interface CustomTextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  leftIcon?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  leftIcon,
  
}) => {
  return (
    <TextInput
      label={label}
      placeholder={!label ? "Enter" : undefined} 
      value={value}
      onChangeText={onChangeText}
      mode= "outlined"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      style={styles.input}
      theme={{
        roundness: 50,
        colors: {
          primary: colors.darkGreen,
          background: colors.white,
          outline: colors.lightGreen,
          placeholder: colors.lightGreen,
          },

      }}
      left={leftIcon ? <TextInput.Icon icon={leftIcon} color={colors.lightGreen}/> : undefined}
    />
  );
};


const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    paddingLeft: 10,
    backgroundColor: colors.white,
    borderColor: colors.lightGreen,
  },
  
});

export default CustomTextInput;
