import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Client, Message } from "react-native-paho-mqtt";

//Set up an in-memory alternative to global localStorage
const myStorage: any = {
  setItem: (key: string, item: string) => {
    myStorage[key] = item;
  },
  getItem: (key: string) => myStorage[key],
  removeItem: (key: string) => {
    delete myStorage[key];
  },
};

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  useEffect(() => {
    // Create a client instance
    const client = new Client({
      uri: "ws://bearkillerpt.xyz:8082/",
      clientId: "GoodTester",
      storage: myStorage,
    });

    // set event handlers
    client.on(
      "connectionLost",
      (responseObject: { errorCode: number; errorMessage: string }) => {
        setConnectionStatus("Disconnected");
        if (responseObject.errorCode !== 0) {
          console.log(responseObject.errorMessage);
        }
      }
    );
    client.on("messageReceived", (message: any) => {
      console.log(message);
    });

    // connect the client
    console.log("connecting...");
    client
      .connect()
      .then(() => {
        setConnectionStatus("Connected");
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        return client.subscribe("$SYS/#");
      })
      .catch((responseObject: { errorCode: number; errorMessage: string }) => {
        setConnectionStatus("Disconnected");
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:" + responseObject.errorMessage);
        }
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Connection status {connectionStatus}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
