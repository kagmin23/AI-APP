import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styles from './styles';

interface InputProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({ placeholder, secureTextEntry, ...props }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      {...props}
    />
  );
};

export default Input;