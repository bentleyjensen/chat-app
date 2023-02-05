import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";

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
        }

        this.referenceChatMessages = firebase.firestore().collection("messages");
    }

    componentDidMount (props) {
        // Set up firebase for user tracking and message watching
        this.referenceChatMessages = firebase.firestore().collection("messages");
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(this.authStateUpdated.bind(this));

        let { name } = this.props.route.params;
        name = name || 'Anon'; // Backup, if the user doesn't enter a name

        this.props.navigation.setOptions({ title: `${name}'s Chat` });
    }

    componentWillUnmount () {
        // Stop listening to messages and auth
        this.authUnsubscribe();
        this.chatUnsubscribe();
    }

    authStateUpdated(user) {
        if (!user) {
            firebase.auth().signInAnonymously();
        }
        this.setState({
            uid: user.uid,
            messages: [],
        });

        this.chatUnsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate.bind(this));
    }

    onCollectionUpdate (snapshot) {
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

    // When sending, update state and firebase
    onSend(messages = []) {
        this.setState(previousState => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });

        // Send to firebase
        this.referenceChatMessages.add(messages[0]);
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

    render() {
        return <View
            style={{flex: 1}}
        >
            <GiftedChat
                renderBubble={this.renderBubble.bind(this)}
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
