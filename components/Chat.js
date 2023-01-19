import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        }
    }

    componentDidMount (props) {
        let { name } = this.props.route.params;
        name = name || 'Anon'; // Backup, if the user doesn't enter a name

        this.props.navigation.setOptions({ title: `${name}'s Chat` });

        // Temporary static messages
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: `${name} has entered the chat room`,
                    createdAt: new Date(),
                    system: true,
                },
                {
                    _id: 2,
                    text: 'Hello developer',
                    createdAt: new Date("2023-01-18T03:10:24.023Z"),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 3,
                    text: 'I am an older message from user 2',
                    createdAt: new Date("2023-01-18T03:05:24.023Z"),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 4,
                    text: 'I am an older message from user 1',
                    createdAt: new Date("2023-01-18T03:04:24.023Z"),
                    user: {
                        _id: 1,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
            ]
        });

    }

    // Update state when a message is sent
    onSend(messages = []) {
        this.setState(previousState => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
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
                    _id: 1,
                }}
            />
            {/* fixes an issue in older android versions where the keyboard covers the input */}
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
        </View>
    }
}
