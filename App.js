import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebase, firebaseConfig } from "./config";

import MainChatListScreen from "./src/screens/mainChatListScreen";
import AlignItemsLayout from "./src/screens/loginScreen";
import SingleChatRoom from "./src/screens/singleChatRoom";
import LoginScreen from "./src/screens/loginScreen";
import SignUpScreen from "./src/screens/signUpScreen";
import Header from "./src/screens/Header";
import { useEffect, useState } from "react";

const Stack = createStackNavigator();

export default function App({ route, navigation }) {
  const [user, setUser] = useState();
  // const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  console.log(auth.currentUser);
  console.log("user", user);
  // console.log(auth.currentUser.email);
  // console.log(auth.currentUser.emailVerified);
  // console.log(auth.currentUser.uid);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(true);
      } else {
        setUser(false);
      }
    });
  }, []);

  if (!user) {
    console.log("hiii");
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: true }}>
          <Stack.Screen
            name="MainChatListScreen"
            component={MainChatListScreen}
            options={{
              headerTitle: "Chat",
              headerStyle: {
                backgroundColor: "powderblue",
              },
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="SingleChatRoom"
            component={SingleChatRoom}
            options={({ route }) => ({ title: route.params.friendName })}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator screenOptions={{ headerShown: false }}>
  //       <Stack.Screen name="LoginScreen" component={LoginScreen}></Stack.Screen>
  //       <Stack.Screen
  //         name="SignUpScreen"
  //         component={SignUpScreen}
  //       ></Stack.Screen>
  //       <Stack.Screen
  //         name="SingleChatRoom"
  //         component={SingleChatRoom}
  //       ></Stack.Screen>
  //       <Stack.Screen
  //         name="MainChatListScreen"
  //         component={MainChatListScreen}
  //       ></Stack.Screen>
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
