import { Button, Input } from '@/components/common';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import styles from './styles';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Chat: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // Placeholder for register action
  const handleRegister = () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert('Error', 'Please fill in all fields');
    }
    Alert.alert('Success', 'Register button pressed'); // Thay bằng logic API sau
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }} // Thay bằng logo thực tế
        style={styles.logo}
      />
      {/* Title and subtitle */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      {/* Form */}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Buttons */}
      <Button
        title="Register"
        onPress={handleRegister}
        disabled={!email.trim() || !password.trim()}
      />
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
        variant="secondary"
      />
    </View>
  );
};

export default RegisterScreen;