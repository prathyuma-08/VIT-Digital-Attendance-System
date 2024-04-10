import React,{useState} from "react";
import {View,Text,TouchableOpacity,StyleSheet,Modal} from 'react-native';
import { useUserContext } from "./Context";
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { TimerPickerModal } from "react-native-timer-picker";

export default function Fac(){

    const { user,time, logOut,minmaxTime} = useUserContext();
    
    const handleSetTimings = () => {
        setModalVisible(true)
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [minshowPicker, setminShowPicker] = useState(false);
    const [maxshowPicker, setmaxShowPicker] = useState(false);
    const [minTime,setminTime] = useState(new Date(new Date().setHours(0,0,0,0)));
    const [maxTime,setmaxTime] = useState(new Date(new Date().setHours(0,0,0,0)));
    
    return(
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome, Employee {user.name}</Text>
            {/* <View style={styles.option}>
            <TouchableOpacity style={styles.qrbutton}>
                <Text style={styles.btntext}> Show QR </Text>
                <Ionicons name="qr-code-sharp" size={24} color="white" />
            </TouchableOpacity>
            </View> */}
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
            <>
            <TouchableOpacity onPress={()=>setminShowPicker(true)}>
                <Text style={styles.timetext}>Pick the Start Timing</Text>
            </TouchableOpacity>
            <TimerPickerModal
            visible={minshowPicker}
            onConfirm={(pickedDuration) => {
                setminTime(new Date(new Date().setHours(pickedDuration.hours,pickedDuration. minutes,pickedDuration.seconds,0)));
                setminShowPicker(false);
            }}
            modalTitle="Set Start Time"
            onCancel={() => setminShowPicker(false)}
            modalProps={{
                overlayOpacity: 0.2,
            }}/></>
            <Text style={styles.text}>{(minTime.toLocaleTimeString())}</Text>
            <>
            <TouchableOpacity onPress={()=>setmaxShowPicker(true)}>
                <Text style={styles.timetext}>Pick the End Timing</Text>
                </TouchableOpacity>
            <TimerPickerModal
            visible={maxshowPicker}
            onConfirm={(pickedDuration) => {
                setmaxTime(new Date(new Date().setHours(pickedDuration.hours,pickedDuration. minutes,pickedDuration.seconds,0)));
                setmaxShowPicker(false);
            }}
            modalTitle="Set End Time"
            onCancel={() => setmaxShowPicker(false)}
            modalProps={{
                overlayOpacity: 0.2,
            }}
        />
        <Text style={styles.text}>{(maxTime.toLocaleTimeString())}</Text>
        <TouchableOpacity onPress={()=>{minmaxTime(minTime,maxTime); setModalVisible(false)}} style={styles.qrbutton}>
            <Text style={styles.btntext}>Set!</Text>
        </TouchableOpacity>

        
            </>
        </View>
            </Modal>
            <View style={styles.option}>
            <TouchableOpacity style={styles.qrbutton} onPress={handleSetTimings}>
                <Text style={styles.btntext}> Set Timings </Text>
                <SimpleLineIcons name="clock" size={24} color="white" />
            </TouchableOpacity>
            </View>

            <View style={styles.option}>
            <TouchableOpacity style={styles.qrbutton}>
                <Text style={styles.btntext}> Download Attendance </Text>
                <Ionicons name="cloud-download-outline" size={24} color="white"/>
            </TouchableOpacity>
            </View>

            {/* <View style={styles.option}>
            <TouchableOpacity style={styles.qrbutton}>
                <Text style={styles.btntext}> Train new </Text>
                <Ionicons name="people" size={24} color="white" />
            </TouchableOpacity>
            </View> */}
            
            <TouchableOpacity style={styles.logout} onPress={logOut}>
            <SimpleLineIcons name="logout" size={24} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 20,
        justifyContent: 'center',
        margin: 40
    },
    welcomeText:{
        fontFamily: 'OpenSans-Bold',
        fontSize: 30
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
    },
    qrbutton: {
        flexDirection: 'row',
        backgroundColor: '#253D5B',
        padding: 20,
        alignItems: 'center',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    btntext:{
        fontFamily: 'OpenSans-Regular',
        fontSize: 24,
        color: 'white'
    },
    imgbg:{
        height: 'auto',
        width: 'auto',
    },
    option:{
        padding: 40,
        paddingHorizontal: 20
    },
        modalView: {
          justifyContent: 'center',
          flex: 1,
          margin: 20,
          backgroundColor: '#fbfbfe',
          borderRadius: 20,
          padding: 35,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        },
    timetext:{
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 25,
        backgroundColor: '#253D5B',
        color: 'white',
        padding: 20,
        margin: 5,
        alignSelf: 'center'
    },
    text:{
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
        padding: 25,
        backgroundColor: '#AC8181',
        color: 'white',
        margin: 2
    }
})