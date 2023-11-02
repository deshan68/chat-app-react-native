import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../config";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  loginUser = async (email, passsword) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error);
    }
  };
  // async function ScreenTracke() {
  //   const unsub = navigation.addListener("focus", () => {
  //     console.log("Now login screen");
  //   });
  // }
  // ScreenTracke();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <TextInput
        placeholder="Enter Email"
        onChangeText={(email) => setEmail(email)}
        autoCapitalize="none"
        autoCorret={false}
        style={{
          backgroundColor: "white",
          height: 50,
          width: "90%",
          borderRadius: 20,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
        }}
      ></TextInput>
      <TextInput
        placeholder="Enter Passsword"
        onChangeText={(password) => setPassword(password)}
        autoCapitalize="none"
        autoCorret={false}
        secureTextEntry={true}
        style={{
          backgroundColor: "white",
          height: 50,
          width: "90%",
          borderRadius: 20,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
        }}
      ></TextInput>
      <TouchableOpacity
        onPress={() => loginUser(email, password)}
        style={{
          backgroundColor: "blue",
          height: 50,
          width: "90%",
          borderRadius: 20,
          borderColor: "gray",
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 23, color: "white" }}>
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUpScreen")}
        style={{
          paddingTop: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontWeight: "100", fontSize: 15, color: "black" }}>
          If You Dont Have Account Yet?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
