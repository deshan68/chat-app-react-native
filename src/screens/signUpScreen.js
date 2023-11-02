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
import { firebase } from "../../config";
import { getAuth } from "firebase/auth";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  registerUser = async (email, password, firstName, lastName) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .auth()
          .currentUser.sendEmailVerification({
            url: "https://learnfb-bc663.firebaseapp.com",
            handleCodeInApp: true,
          })
          .then(() => {
            // alert("verification email sent, Plz Verify Youre Email & Login");
          })
          .catch((error) => {
            alert(error.message);
          })
          .then(() => {
            const auth = getAuth();
            const userid = auth.currentUser.uid;
            // console.log(user);
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .set({ firstName, lastName, email, userid });
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  };
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
        placeholder="First Name"
        onChangeText={(firstName) => setFirstName(firstName)}
        autoCorrect={false}
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
        placeholder="Last Name"
        onChangeText={(lastName) => setLastName(lastName)}
        autoCorrect={false}
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
        placeholder="Email"
        onChangeText={(email) => setEmail(email)}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
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
        placeholder="Password"
        onChangeText={(password) => setPassword(password)}
        autoCorrect={false}
        autoCapitalize="none"
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
        onPress={() => registerUser(email, password, firstName, lastName)}
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
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({});
