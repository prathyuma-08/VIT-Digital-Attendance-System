import React from "react";
import 'react-native-gesture-handler';
import { SafeAreaView,StyleSheet } from "react-native";
import * as Linking from 'expo-linking';
import {NavigationContainer} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Auth from "./src/Auth";
import { UserContextProvider } from "./src/Context";

const config ={
  screens:{
    Camera: 'camera',
}};

const prefix = Linking.createURL('myapp://');

export default function App() {

  const [fontsLoaded] = useFonts({
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-Medium': require('./assets/fonts/OpenSans-Medium.ttf'),
});

  if (fontsLoaded) {
    return (
      <UserContextProvider>
      <NavigationContainer 
    linking={{prefixes:[prefix],config}}>
    <SafeAreaView style={styles.container}>
    <Auth/>
    </SafeAreaView>
    </NavigationContainer>
    </UserContextProvider>
    )
  }
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: '#fbfbfe'
    }
  }
)