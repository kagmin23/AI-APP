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

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Placeholder for login action
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert('Error', 'Please fill in all fields');
    }
    Alert.alert('Success', 'Login button pressed'); // Thay bằng logic API sau
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }} // Thay bằng logo thực tế
        style={styles.logo}
      />
      {/* Title and subtitle */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

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
        title="Login"
        onPress={handleLogin}
        disabled={!email.trim() || !password.trim()}
      />
      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate('Register')}
        variant="secondary"
      />
    </View>
  );
};

export default LoginScreen;