import { MapScreenNavigationProp, RootStackParamList } from '@/navigations/types';
import { RouteProp } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import styles from './styles';

type Props = {
  navigation: MapScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'Map'>;
};

const MapScreen: React.FC<Props> = ({ navigation }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need location permissions.');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Your Location</Text>
      <Button title="Get Location" onPress={getLocation} color="#007AFF" />
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
          />
        </MapView>
      ) : (
        <Text style={styles.noLocation}>No location available</Text>
      )}
    </View>
  );
};

export default MapScreen;