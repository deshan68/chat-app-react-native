import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";

import Header from "./Header";

import {
  collection,
  getDocs,
  query,
  getFirestore,
  onSnapshot,
  where,
  endAt,
  startAt,
  startAfter,
  endBefore,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebase, app } from "../../config";
import { doc, setDoc, orderBy, limit } from "firebase/firestore";
import { FlatList } from "react-native-gesture-handler";

const SingleChatRoom = ({ route, navigation }) => {
  const db = getFirestore(app);
  const auth = getAuth();
  const [LastMsgs, setLastMsgs] = useState();
  const user = auth.currentUser;

  const { friendName, myName } = route.params;
  // console.log("name", myName + friendName);

  const [addData, setAddData] = useState("");
  const d = new Date();
  const now = new Date().getTime();
  let text = now.toString();
  console.log(
    "🚀 ~ file: singleChatRoom.js:48 ~ SingleChatRoom ~ text",
    typeof text
  );
  let time = d.getTime();
  const [msgs, setMsgs] = useState([]);

  // const userRef2 = firebase.firestore().doc("rooms" + myName + friendName);
  // const userRef2 = query(collection(db, "rooms"));

  const userRef1 = firebase
    .firestore()
    .collection("rooms/" + myName + friendName + "/current-chat");

  //filter last document in a collection........................................................
  const LastMsgRef = collection(
    db,
    "rooms/" + myName + friendName + "/current-chat"
  );
  const q = query(
    LastMsgRef,
    where("sender", "!=", myName),
    orderBy("sender", "desc"),
    limit(1)
  );

  function lastAccess() {
    console.log(d.getTime());
  }

  useEffect(() => {
    async function check2() {
      userRef1.onSnapshot((querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          const { message, time, sender, reciever } = doc.data();
          msgs.push({
            message,
            time,
            sender,
            reciever,
          });
        });
        setMsgs(msgs);
      });
    }
    check2();
    async function check() {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const LastMsg = [];
        querySnapshot.forEach((doc) => {
          // console.log(doc.data().message);
          LastMsg.push(doc.data().message);
        });
        console.log("Current cities in CA: ", LastMsg);
      });
    }
    check();
  }, []);

  async function ScreenTracke() {
    const unsub = navigation.addListener("focus", () => {
      console.log("Now Single Chats");
      lastAccess();
    });
  }
  ScreenTracke();

  const addMessage = () => {
    setDoc(doc(db, "rooms", myName + friendName, "current-chat", text), {
      message: addData,
      time: text,
      sender: myName,
      reciever: friendName,
    })
      .then(() => {
        setAddData("");
        // Keyboard.dismiss();
        // firebase
        //   .firestore()
        //   .collection("users")
        //   .doc(firebase.auth().currentUser.uid)
        //   .update({ addData });
      })
      .catch((error) => {
        alert(error);
      });

    setDoc(doc(db, "rooms", friendName + myName, "current-chat", text), {
      message: addData,
      time: text,
      sender: myName,
      reciever: friendName,
    })
      .then(() => {
        setAddData("");
        // Keyboard.dismiss();
      })
      .catch((error) => {
        alert(error);
      });
  };
  const keyboardVerticalOffset = Platform.OS === "ios" ? 45 : 0;

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={Platform.OS === "ios" ? "position" : ""}
      style={styles.container}
    >
      <View style={styles.body}>
        <FlatList
          inverted
          style={{
            backgroundColor: "white",
            height: "100%",
            marginBottom: 15,
          }}
          data={[...msgs].reverse()}
          renderItem={({ item }) =>
            item.sender == myName ? (
              <View style={styles.allFromMsg}>
                <View style={styles.fromContainers}>
                  <Text style={{ fontSize: 16, fontWeight: "200" }}>
                    {item.message}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.allToMsg}>
                <View style={styles.toContainers}>
                  <Text style={{ fontSize: 16, fontWeight: "200" }}>
                    {item.message}
                  </Text>
                </View>
              </View>
            )
          }
          // key={user.uid}
          keyExtractor={(item) => item.time}
          // keyExtractor={(item) => item.message}
          alwaysBounceVertical={false}
        ></FlatList>
      </View>

      <View style={styles.footer}>
        <TextInput
          placeholder="Enter Message"
          onChangeText={setAddData}
          value={addData}
          multiline={true}
          autoCapitalize="none"
          style={{
            width: "85%",
            backgroundColor: "white",
            height: "auto",
            borderRadius: 10,
            paddingLeft: 15,
            justifyContent: "center",
            borderBottomColor: "black",
            borderWidth: 1,
            fontSize: 20,
            paddingVertical: 5,
          }}
        ></TextInput>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            backgroundColor: "blue",
            width: 38,
            height: 38,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={addMessage}
        >
          <Icon
            style={{ paddingRight: 0, position: "absolute" }}
            name="caret-forward"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SingleChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    // alignItems: "center",
    // justifyContent: "center",
    // width: "100%",
  },

  body: {
    maxHeight: "95%",
    height: "auto",
    width: "100%",
    // backgroundColor: "yellow",
  },
  footer: {
    maxHeight: 80,
    height: "auto",
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "flex-end",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    bottom: 5,
  },
  chatContainer: {},
  allToMsg: {
    paddingRight: 0,
    alignItems: "flex-start",
  },
  allFromMsg: {
    paddingLeft: 0,
    alignItems: "flex-end",
  },
  fromContainers: {
    backgroundColor: "powderblue",
    marginRight: 15,
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  toContainers: {
    backgroundColor: "powderblue",
    marginLeft: 15,
    marginBottom: 5,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
