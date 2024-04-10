import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { CameraType } from "expo-camera";
import { Entypo, AntDesign} from '@expo/vector-icons';
import axios from 'axios';

export default function Camera({navigation}) {

  const [img, setImg] = useState(null);
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [result, setResult] = useState(null);
  const [posted, setPosted] = useState(false);

  const takeImageHandler = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }
    const res = await ImagePicker.launchCameraAsync(
      {
        cameraType: CameraType.front = "front",
      }
    );

    if (!res.canceled) {
      console.log(res);
      setImg(res.assets[0].uri);
      const currentDate = new Date();
      const dte = currentDate.toLocaleDateString(); // Format date only
      const time = currentDate.toLocaleTimeString();
      setDate(dte)
      setTime(time)
      setPosted("")
      setResult("")
    }
  };
  async function postAttendance(){
    setPosted(true)
      axios.post('http://172.20.10.2:5000/save_to_excel', {
        register_number: result,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    } 

  async function getPrediction(){
    try {
      const data = new FormData();
      data.append('image',
        {
          uri: img,
          name: 'image.jpg',
          type: 'image/jpg'
        });

    const img_res = await axios.post('http://172.20.10.2:5000/detect_faces', data, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }})
    setResult(img_res.data.regno)
    }catch (error) {
      console.log(error);
    }
  }

  async function fetchData() {
    try {
      const data = new FormData();
      data.append('image',
        {
          uri: img,
          name: 'image.jpg',
          type: 'image/jpg'
        });

      const res = await axios.post('http://172.20.10.2:5000/liveliness',data,{
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        }
      })
      console.log(res.data.isreal);
      if(res.data.isreal=='true'){
        getPrediction()
      }
      else{
        setResult("Image is fake. Try again")
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        {img === null ? (
          <View style={styles.beforePic}>
            <View>
              <Text style={styles.text}> A - Block Hostel Attendance </Text>
              </View>
            <TouchableOpacity style={styles.centerbutton} onPress={takeImageHandler}>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Image style={styles.logo} source={{ uri: img }} />
            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
              <View style={styles.time}>
                <Entypo name="calendar" size={30} color="black" />
                <Text style={{ marginLeft: 5 }}>{date}</Text>
              </View>
              <View style={styles.time}>
                <Entypo name="clock" size={30} color="black" />
                <Text style={{ marginLeft: 5 }}>{time}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
            <View style={styles.time}>
              <AntDesign name="profile" size={24} color="black" />
              <Text style={{ marginLeft: 5 }}>{result}</Text>
            </View>
            <View>
            <Button title="Get Name" onPress={fetchData}/>
            </View>
            </View>
            <View style={styles.afterPic}>
              <TouchableOpacity style={styles.centerbutton} onPress={takeImageHandler}>
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.centerbutton} onPress={postAttendance}>
                <Text style={styles.buttonText}>Post</Text>
              </TouchableOpacity>
            </View>
            {posted && <Text style={styles.posted}>Posted in backend!!</Text>}
          </>
        )}
      </View>
    </View>)
}

const styles = StyleSheet.create(
  {
    container: {
      backgroundColor: '#E5E1DA',
      padding: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flex:1
    },
    centerbutton: {
      backgroundColor: '#B06161',
      padding: 10,
      borderRadius: 20,
      margin: 10
    },
    buttonText: {
      textAlign: "center",
      fontSize: 30,
      color: '#F0DBAF'
    },
    logo: {
      width: 250,
      height: 400,
    },
    text: {
      fontFamily: 'OpenSans-Bold', fontSize: 30, alignSelf: 'center'
  },
    time: {
      padding: 5,
      fontSize: 20,
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    beforePic: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    afterPic: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      padding: 5
    },
    posted: {
      fontSize: 20,
      padding: 5,
      color: 'green',
      alignSelf: 'center'
    }
  }
)