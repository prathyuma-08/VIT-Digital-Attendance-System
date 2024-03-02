import React, { useState } from "react";
import { SafeAreaView,StyleSheet } from "react-native";
import Camera from "./src/Camera";

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <Camera/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      padding: 50,
      backgroundColor: '#CDC2AE'
    }
  }
)