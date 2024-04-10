import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { FontAwesome5, AntDesign, MaterialIcons} from '@expo/vector-icons';
import { useUserContext } from "./Context";
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Login() {

  const { user, logIn, setRole } = useUserContext();
  const [regno, setRegno] = useState("");
  const [pass,setPass] = useState("");
  const [valid,setValid] = useState(true);

  var bodyFormData = new FormData();
  bodyFormData.append('username', regno);
  bodyFormData.append('pass', pass); 

  async function loginCheck(){
    axios({
      method: "post",
      url: "http://172.20.10.2:5000/login",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
       if(response.data.login=='success'){
          logIn(regno,user.role)
          setPass(null)
          setRegno(null)
       }
          
       if(response.data.login=='Invalid') {
          console.log("Invalid Credentials")
          setValid(false)
          setPass(null)
          setRegno(null)
       }          
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
    } 

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/VIT.png')}/>
      {user.role === null ? (
        <>
        <View style={styles.textWrapper}>
        <Text style={styles.text}>Whom do you want to login as ?</Text>
        </View>
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.roleWrapper} onPress={() => setRole('Teacher')}>
              {/* <FontAwesome5 name="chalkboard-teacher" size={80} color="#ffffff" /> */}
              <MaterialIcons name="admin-panel-settings" size={80} color="#ffffff" />
              <Text style={styles.roleText}>Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.roleWrapper} onPress={() => setRole('Student')}>
              <FontAwesome5 name="book-reader" size={80} color="#ffffff" />
              <Text style={styles.roleText}>Student</Text>
            </TouchableOpacity>   
        </View>
        </>
      ) : (
      <>
      <View>
        <Text style={styles.headtext}>{user.role} Login</Text>
      </View>
      <View style={styles.details}>
        {
          user.role == 'Teacher' ? (
            <>
              <Text style={styles.text}>Faculty ID</Text>
              <TextInput
                style={styles.inputtext}
                placeholder="Enter ID..."
                value={regno}
                onChangeText = {text => setRegno(text)} /></>
          ) : (
            <>
              <Text style={styles.text}>Registration Number</Text>
              <TextInput
                style={styles.inputtext}
                placeholder="Enter Reg.No ..." 
                value={regno}
                onChangeText = {text => setRegno(text)}/>
            </>
          )

        }
        <Text style={styles.text}>Password</Text>
        <TextInput
          placeholder="Enter password..."
          secureTextEntry={true} 
          style={styles.inputtext}
          value={pass}
          onChangeText={text=>setPass(text)}
          />
        </View>
        {valid?<></>:<View>
          <Text style={styles.redtext}>**Enter valid Credentials**</Text></View>
        }
        <TouchableOpacity style={styles.signin} onPress={loginCheck}>
          <Text style={styles.buttonText}>Submit button</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signin} onPress={() => setRole(null)}>
          <View style={{flexDirection: 'row'}}>  
          <AntDesign name="back" size={24} color="white" />
          <Text style={styles.buttonText}>    Back to Sign In</Text>
          </View>
        </TouchableOpacity>
      </>)}
    </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    justifyContent: 'center'
  },
  roleText: {
    color: '#fbfbfa',
    fontSize: 30,
    fontFamily: 'OpenSans-SemiBold'
  },
  roleWrapper: {
    margin: 30,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#253D5B',
    borderRadius: 100
},
text:{
  fontFamily: 'OpenSans-Regular',
  fontSize: 25,
  padding: 10,
  color: '#253D5B'
},
textWrapper:{
  alignSelf: "center"
},
buttonText:{
  fontFamily: 'OpenSans-SemiBold',
  fontSize: 20,
  color: 'white'
},
signin:{
  padding: 20,
  backgroundColor: '#AC8181',
  margin: 20,
  alignSelf: 'center',
  borderRadius: 50
},
details:{
  padding: 20
},
inputtext:{
  borderWidth: 2,
  padding: 10,
  fontFamily: 'OpenSans-Regular',
  fontSize: 20
},
headtext:{
  fontFamily: 'OpenSans-Bold',
  fontSize: 30,
  alignSelf: 'center',
  padding: 10,
  color: '#253D5B'
},
image:{
  width: windowWidth - 60,
  height: windowHeight/6,
  resizeMode: 'contain'
},
redtext:{
  color: 'red',
  fontFamily: 'OpenSans-Regular',
  fontSize: 20,
  alignSelf: 'center'
}
})