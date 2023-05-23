// React
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';
import { LogBox, Alert } from 'react-native';
import { useEffect, useState } from 'react';

// Firestore
import { initializeApp } from "firebase/app";
import { disableNetwork, enableNetwork, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Custom Components
import Start from "./components/Start";
import Chat from './components/Chat';

// Create the navigator
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  const connectionStatus = useNetInfo();
  // Since you can only RE-connect if you've LOST connection, we need to track it
  const [hasLostConnection, setHasLostConnection] = useState(false);

  
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBCE6Olsln9bzvH78KUnbWurWqQDatZBGM",
    authDomain: "chat-app-2a62d.firebaseapp.com",
    projectId: "chat-app-2a62d",
    storageBucket: "chat-app-2a62d.appspot.com",
    messagingSenderId: "402036391919",
    appId: "1:402036391919:web:3b0ec1ce950290f35dc01a",
    measurementId: "G-6RRENK1QYC"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  const storage = getStorage(app);
  
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      setHasLostConnection(true)
      disableNetwork(db);
    } else if(connectionStatus.isConnected === true) {
      enableNetwork(db);
      if (hasLostConnection) Alert.alert('Reconnected!');
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start' >
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat'>
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
