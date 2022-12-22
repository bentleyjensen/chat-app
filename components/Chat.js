import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Chat extends Component {
    componentDidMount (props) {
        let { name } = this.props.route.params;
        name = name || 'Anon'; // Backup, if the user doesn't enter a name

        this.props.navigation.setOptions({ title: `${name}'s Chat` });

    }
    render () {
        const { color } = this.props.route.params;
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color,
        }}>
            <Text style={{color: 'white'}} >This is the Chat screen!</Text>
            <Text style={{color: 'black'}} >This is the Chat screen!</Text>
        </View>
    }
}
