import React,{useState,useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { MaterialCommunityIcons, SimpleLineIcons,FontAwesome5 } from '@expo/vector-icons';
import {Dimensions} from 'react-native';
import { useLinkTo } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useUserContext } from "./Context";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const clat = 12.8396615
const clong = 80.1551967

export default function Home() {

    const linkTo = useLinkTo();
    const [valid,setValid] = useState(null);
    const {time} = useUserContext();

        const getPermissions = async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log("Please grant location permissions");
            return;
          }         
          let currentLocation = await Location.getCurrentPositionAsync({});
          const curr_time = new Date().toLocaleTimeString();
          const curr_lat = currentLocation["coords"].latitude;
          const curr_long = currentLocation["coords"].longitude;
          console.log("Time",curr_time)
          console.log("Latitude",time.maxtime.toLocaleTimeString());
          console.log("Longtitude",curr_long);

         if((new Date().getTime() <= time.maxtime.getTime()) && (new Date().getTime() >= time.mintime.getTime()) && Math.abs(curr_lat-clat) <= 0.0005 && Math.abs(curr_long-clong)<= 0.0005 ){
            setValid(true);
          }
          else{ 
            setValid(false);
          }

          console.log(valid);
        };

    const { user, logOut } = useUserContext();
    

    return (<View style={styles.container}>
        <View style={styles.topNameWrapper}>
            <Text style={styles.text}>You are now logged in as , {user.name}</Text>
            <MaterialCommunityIcons name="hand-wave" size={24} color="#ffd459" />
        </View>
        <TouchableOpacity style={styles.logout} onPress={getPermissions}>
            <FontAwesome5 name="search-location" size={24} color="white" />
            <Text style={styles.logoutText}>Verify Location</Text>
        </TouchableOpacity>
        {valid ? <View>
                <Text style={styles.qrtext}>Verification Successful! Continue to Face-recognition</Text>
                <TouchableOpacity style={styles.logout} onPress={()=>{linkTo("/camera")}}>
                    <Text style={styles.logoutText}>Go to Camera</Text></TouchableOpacity></View>: (
        <Text style={styles.qrtext}>Try verifying in proper location</Text>
      )}
        <TouchableOpacity style={styles.logout} onPress={logOut}>
            <SimpleLineIcons name="logout" size={24} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 20,
        backgroundColor: '#fbfbfe'
    },
    topNameWrapper:{
       flexDirection: 'row',
       alignItems: 'center',
       marginTop: 50
    },
    text: {
        fontFamily: 'OpenSans-Bold', fontSize: 30
    },
    qr:{
        width: windowWidth-40,
        height: windowHeight/2,
    },
    qrtext:{
        fontFamily: 'OpenSans-SemiBold',
        alignSelf: 'center',
        marginVertical: 20,
        fontSize: 25
    },
    logout:{
        flexDirection: 'row',
        alignContent: 'center',
        padding: 20,
        backgroundColor: '#AC8181',
        margin: 20,
        alignSelf: 'center',
        borderRadius: 50
    },
    logoutText:{
        fontFamily: 'OpenSans-Medium',
        marginLeft: 10,
        fontSize: 20,
        color: 'white'  
    }
})