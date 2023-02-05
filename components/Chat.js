import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

const firebase = require('firebase');
import 'firebase/firestore';

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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: 0,
            messages: [],
            isConnected: true,
        }

        // this.referenceChatMessages = firebase.firestore().collection("messages");
    }

    componentDidMount (props) {
        NetInfo.fetch().then(connection => {
            console.log('Connection status: ', connection.isConnected);
            this.setState({
                isConnected: connection.isConnected,
            }, () => {
                // Get messages and uid from local storage
                this.getMessages();
                this.getLocalUser();

                if (this.state.isConnected) {
                    console.log('Initing firebase');
                    // Set up firebase for user tracking and message watching
                    this.referenceChatMessages = firebase.firestore().collection("messages");
                    this.authUnsubscribe = firebase.auth().onAuthStateChanged(this.authStateUpdated.bind(this));
                }
            })
        });

        let { name } = this.props.route.params;
        name = name || 'Anon'; // Backup, if the user doesn't enter a name

        this.props.navigation.setOptions({ title: `${name}'s Chat` });
    }

    componentWillUnmount () {
        // Stop listening to messages and auth
        if (this.authUnsubscribe)
            this.authUnsubscribe();

        if (this.chatUnsubscribe)
            this.chatUnsubscribe();
    }

    authStateUpdated(user) {
        console.log('Firebase auth update');
        if (!user) {
            firebase.auth().signInAnonymously();
        }
        this.setState({
            uid: user.uid,
            messages: [],
        });

        AsyncStorage.setItem('uid', user.uid);

        this.chatUnsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate.bind(this));
    }

    onCollectionUpdate (snapshot) {
        console.log('Firebase collection updated');
        const messages = [];

        // Trim the snapshot to only the needed data
        snapshot.forEach((document) => {
            const data = document.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
            });
        });

        // Update state with the trimmed list
        this.setState({
            messages: messages,
        })
    }

    // When sending: update state, local storage, and firebase
    onSend(messages = []) {
        console.log('Sending Message');
        // Save state
        this.setState(previousState => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        }, async () => {
            // Save Locally
            this.saveMessages();
            // Send to firebase
            if (this.state.isConnected)
                this.referenceChatMessages.add(messages[0]);
        });
    }

    // Read messages stored locally
    async getMessages() {
        console.log('Retrieving local messages');
        let messages;
        let uid;

        try {
            messages = await AsyncStorage.getItem('messages') || '[]';
            uid = await AsyncStorage.getItem('uid') || 0;
            messages = JSON.parse(messages);

            console.log('Message count: ', messages.length);
            console.log('uid: ', uid);
            this.setState({
                messages,
                uid,
            });
        } catch (error) {
            console.log("Error when retrieving messages from AsyncStorage:");
            console.log(error.message);
            console.log(error);
        }
    }

    async getLocalUser() {

    }

    // Save messages locally
    async saveMessages() {
        console.log('Saving messages in AsyncStorage');
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log("Error when saving messages to AsyncStorage:");
            console.log(error.message);
        }
    }

    // Delete locally stored messages
    async deleteMessages() {
        console.log('Deleting messages in AsyncStorage');
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log("Error when deleting messages from AsyncStorage:");
            console.log(error.message);
        }
    }

    // Custom bubbles
    renderBubble(props) {
        // color selected by the user on the Start page
        const { color } = this.props.route.params;
        return (<Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: color,
                },
                left: {
                    backgroundColor: color,
                },
            }}
        />)
    }

    // Disable input when not connected
    renderInputToolbar(props) {
        console.log("render input toolbar: ", Object.keys(this));
        if (this.state.isConnected)
            return <InputToolbar {...props} />
        else
            return <></>
    }

    render() {
        return <View
            style={{flex: 1}}
        >
            <GiftedChat
                renderBubble={this.renderBubble.bind(this)}
                renderInputToolbar={this.renderInputToolbar.bind(this)}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: this.state.uid,
                }}
            />
            {/* fixes an issue in older android versions where the keyboard covers the input */}
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
        </View>
    }
}
