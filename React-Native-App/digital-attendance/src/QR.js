import React,{useState,useEffect} from "react";
import {StyleSheet,View,Text, TouchableOpacity, Dimensions } from "react-native";
import {Camera,CameraView} from "expo-camera/next";
import { useLinkTo } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function QR({}){
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned,setScanned] = React.useState();
    const [data,setData] = React.useState(null);
    const linkTo = useLinkTo();

    useEffect(() => {
        const getCameraPermissions = async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === "granted");
        };
    
        getCameraPermissions();
      }, []);

      const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setData(data.replace('http://',''));
      };
    
      if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }
   return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={styles.qrcam}
      />
      {scanned && (
        <TouchableOpacity style={styles.qrcodebtn} onPress={() => {linkTo(data)
        setScanned(false)}}>
          <Text style={styles.clicktext}>Go to Camera</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1  },
  qrcodebtn:{
    backgroundColor: 'white',
  },
  qrcam:{
    width: windowWidth-40,
    height: windowHeight/2 - 30,
  },
  clicktext:{
    alignSelf: 'center',
    height: 30,
    fontSize: 20,
    fontFamily: 'OpenSans-SemiBold'
  }
});