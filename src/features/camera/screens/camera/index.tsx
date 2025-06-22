import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Button, Image, Text, View } from 'react-native';
import styles from './styles';

const CameraScreen = () => {
  const [photo, setPhoto] = useState('');

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera permissions.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Camera</Text>
      <Button title="Take Photo" onPress={takePhoto} color="#007AFF" />
      {photo ? <Image source={{ uri: photo }} style={styles.image} /> : (
        <Text style={styles.noPhoto}>No photo taken</Text>
      )}
    </View>
  );
};


export default CameraScreen;