import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { firebase, firebaseConfig } from "../../config";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { TabActions, useNavigation } from "@react-navigation/native";
import Header from "./Header";

const MainChatListScreen = ({ navigation }) => {
  // const navigation = useNavigation();

  const [name, setName] = useState("");
  const [registerList, setRegisterList] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const app = initializeApp(firebaseConfig);
  const [users, setUsers] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [RecieverLastMsg, setRecieverLastMsg] = useState([]);
  const [SenderLastMsg, setSenderLastMsg] = useState([]);
  const [isHasUnmarkedMsg, setIsHasUnmarkedMsg] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const d = new Date();
  let [currentChaters, setCurrentChaters] = useState([]);

  // console.log("selectedId", selectedId);
  const image = {
    uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
  };
  const userRef = firebase
    .firestore()
    .collection("users")
    .where("email", "!=", user.email);
  const db = getFirestore(app);

  // const userRef2 = firebase.firestore().collection("rooms");

  // const q = query(userRef2, orderBy("time", "desc"), limit(1));
  // filter last document in a collection........................................................
  // const LastMsgRef = collection(
  //   db,
  //   "rooms/" + name.firstName + friendName + "/current-chat"
  // );
  // const q = query(
  //   LastMsgRef,
  //   // where("sender", "!=", friendName),
  //   orderBy("time", "desc"),
  //   limit(1)
  // );

  useEffect(() => {
    async function check() {
      userRef.onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          const { firstName, lastName, email, userId, addData } = doc.data();
          users.push({
            userId,
            firstName,
            lastName,
            email,
            addData,
          });
        });
        setUsers(users);
      });
    }

    const SenderLastMsg = [];
    const RecieverLastMsg = [];
    const userNames = [];
    for (let i = 0; i < users.length; ++i) {
      userNames.push(users[i].firstName);
      setUserNames(userNames);
      // filter last document in a collection........................................................
      const LastMsgRef = collection(
        db,
        "rooms/" + name.firstName + users[i].firstName + "/current-chat"
      );
      const q1 = query(
        LastMsgRef,
        where("reciever", "!=", users[i].firstName),
        orderBy("reciever", "desc"),
        limit(1)
      );
      const q2 = query(
        LastMsgRef,
        where("sender", "!=", users[i].firstName),
        orderBy("sender", "desc"),
        limit(1)
      );

      const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.data().message);
          RecieverLastMsg.push(doc.data().message);
          // setLastMsg([]);
        });
        setRecieverLastMsg(RecieverLastMsg);
        console.log("Reciever ", RecieverLastMsg);
      });
      const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.data().message);
          SenderLastMsg.push(doc.data().message);
          // setLastMsg([]);
        });
        setSenderLastMsg(SenderLastMsg);
        console.log("Sender ", SenderLastMsg);
      });
    }
    check();

    // async function ScreenTracke() {
    //   const unsub = navigation.addListener("focus", () => {
    //     console.log("Now Main Chats");
    //   });
    // }
    // ScreenTracke();

    // const q = query(collection(db, "users"));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.data());
    //     // setUsers(doc.data().firstName);
    //     // setUsers([...users, { id: user.uid, name: doc.data().firstName }]);
    //   });
    // });
    // console.log("users", users);

    // const querySnapshot = await db.collection("users").where().get();
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.data());
    // });
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          console.log("user does not exist");
        }
      });
  }, []);

  // for (let i = 0; i < users.length; ++i) {
  //   console.log(users[i].firstName);
  //   currentChaters.push(i);
  // }
  // // console.log(currentChaters);
  // // setCurrentChaters([]);

  function SingleChatRoomHandler(passName) {
    setSelectedId(passName);
    navigation.navigate("SingleChatRoom", {
      friendName: passName,
      myName: name.firstName,
    });
    console.log("is date", d.getUTCDate());
  }
  return (
    <View style={styles.container}>
      <View>
        <Text style={{ marginTop: 10 }}>Hiii.. {name.firstName}</Text>
      </View>
      <FlatList
        style={{ width: "100%" }}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => {
              alert(item.firstName);
            }}
            // onPress={() => {
            //   setSelectedId(item.firstName);
            //   navigation.navigate("SingleChatRoom", { name: selectedId });
            // }}
            onPress={() => SingleChatRoomHandler(item.firstName)}
            style={styles.singleReceiverContainer}
          >
            <View style={styles.photoSection}>
              <ImageBackground
                source={image}
                resizeMode="cover"
                style={styles.image}
              ></ImageBackground>
            </View>
            <View style={styles.informationSection}>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {item.firstName} {item.lastName}
              </Text>
              <Text>{item.email}</Text>
            </View>
            {isHasUnmarkedMsg == true ? (
              <View
                style={{
                  backgroundColor: "#2afc00",
                  height: 15,
                  width: 15,
                  position: "absolute",
                  right: 30,
                  borderRadius: 50,
                }}
              ></View>
            ) : (
              <View></View>
            )}
          </TouchableOpacity>
        )}
        // key={user.uid}
        // keyExtractor={(item, index) => console.log(item.firstName)}
        keyExtractor={(item) => item.firstName}
        alwaysBounceVertical={false}
      ></FlatList>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          firebase.auth().signOut();
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

    // paddingTop: 50,
    // backgroundColor: "powderblue",
  },
  singleReceiverContainer: {
    paddingHorizontal: 10,
    height: 90,
    width: "100%",
    // backgroundColor: "lightgray",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "lightgray",
  },
  photoSection: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginHorizontal: 5,
    overflow: "hidden",
  },
  informationSection: {
    width: "auto",
    height: 90,
    marginLeft: 20,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  button: {
    height: 30,
    margin: 50,
    width: 200,
    backgroundColor: "#026efd",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  image: {
    justifyContent: "center",
    width: 65,
    height: 65,
    borderRadius: 50,
  },
});
