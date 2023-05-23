import React, { useEffect, useState } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, MessageText } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import MapView from "react-native-maps";

import CustomActions from './CustomActions';

const Chat = ({ navigation, route, db, isConnected, storage }) => {
  const {name, uid, bgColor, color} = route.params;
  const [messages, setMessages] = useState([]);

  let unsubMessages;

  useEffect(() => {
    titleName = name || 'Anon'; // Backup, if the user doesn't enter a name
    navigation.setOptions({ title: `${titleName}'s Chat` });
  });

  // Load messages the appropriate source whenever connection status changes
  useEffect(() => {
    // Get messages from Firebase or AsyncStorage
    fetchMessages();

    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  // Add a new message to firebase
  const sendMessageToFirebase = (newMessages) => {
    const newMessage = newMessages[0];
    const message = {
      text: newMessage.text || null,
      image: newMessage.image || null,
      location: newMessage.location || null,
      ...newMessage,
    }
    console.log(newMessages[0]);
    console.log(Object.keys(newMessages[0]));
    const newMessageRef = addDoc(collection(db, 'messages'), message);
  }

  // When sending: update local storage and firebase
  // Firebase subscription will update state
  const onSend = (messages = []) => {
    sendMessageToFirebase(messages);
    setLocalMessages(messages);
  }

  // Retrieve messages stored in AsyncStorage
  const loadLocalMessages = async () => {
    try {
      const messages = await AsyncStorage.getItem('localMessages') || '[]';
      setMessages(JSON.parse(messages));
    } catch (error) {
      console.log(error);
      setMessages([]);
    }
  }

  // Cache messages into AsyncStorage
  const setLocalMessages = async (messages) => {
    try {
      await AsyncStorage.setItem('localMessages', JSON.stringify(messages));
    } catch (error) {
      console.log(error);
    }
  }

  // Retrieve the user stored in AsyncStorage
  const getLocalUser = async () => {
    console.log('Getting User from AsyncStorage');

  }

  const loadRemoteMessages = () => {
    const firebaseQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    unsubMessages = onSnapshot(firebaseQuery, (documentsSnapshot) => {
      let newMessages = [];

      // Process the messages so GiftedChat understands
      documentsSnapshot.forEach(document => {
        newMessages.push({
          _id: document.id,
          ...document.data(),
          createdAt: new Date(document.data().createdAt.toMillis())
        })
      });

      // Set State
      setMessages(newMessages);
 
      // Update Cache
      setLocalMessages(newMessages);
    });
  }

  const fetchMessages = () => {
    if (isConnected) {
      // Prevent multiple subscriptions
      if (unsubMessages) {
        unsubMessages();
        unsubMessages = null;
      }

      loadRemoteMessages();
    } else {
      loadLocalMessages();
    }
  }

  // Custom bubbles
  const renderBubble = (props) => {
    return (<Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: bgColor,
        },
        left: {
          backgroundColor: bgColor,
        },
      }}
      // Update text color so it's readable in dark bubbles
      renderMessageText={(props) => {
        return (
          <MessageText
            {...props}
            textStyle={{
              left: { color: color},
              right: { color: color},
            }}
          />
        )
      }}
    />)
  }

  // Disable input when not connected
  const renderInputToolbar = (props) => {
    if (isConnected)
      return <InputToolbar {...props} />
    else
      return <></>
  }

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} uid={uid} {...props} />
  }

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    } else {
      return null;
    }
  } 

  return <View style={{ flex: 1 }} >
    <GiftedChat
      renderBubble={renderBubble}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderCustomActions}
      renderCustomView={renderCustomView}
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: route.params.uid,
        name: route.params.name,
      }}
    />
    {/* fixes an issue in older android versions where the keyboard covers the input */}
    {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
  </View>
}

export default Chat;
