import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, TextInput, ImageBackground, TouchableOpacity, Image} from 'react-native';

export default class Start extends Component {
    constructor (props) {
        super(props);
        this.state = {
            name: '',
            color: '#090C08',
        }
    }

    handleName (name) {
        this.setState({name})
    }

    handleNav () {
        const data = {
            name: this.state.name,
            color: this.state.color
        }
        this.props.navigation.navigate('Chat', data);
    }

    handleColor (newColor) {
        this.setState({ color: newColor });
    }

    render () {
        return <ImageBackground 
            source={require('../assets/bg_image.png')}
            resizeMode='cover'
            style={Styles.background}
        >
            <View style={Styles.flexContainer}>
                <View style={Styles.flexItem} >
                    <Text style={Styles.title}>Chat App</Text>
                </View>
                <View style={[Styles.flexItem, Styles.uiContainer]}>
                    <View style={Styles.uiBox}>
                        <View style={[Styles.uiBoxItem, { flexDirection: 'row', borderColor: '#757083', borderWidth: 1, padding: 5 }]}>
                            <Image style={{height: 20, width: 20}} source={require('../assets/icon.svg')} />
                            <TextInput
                                style={[Styles.textInput, Styles.defaultFont]}
                                placeholder='Your Name'
                                value={this.state.name}
                                onChangeText={(text) => this.handleName(text)}
                            />
                        </View>
                        <View style={Styles.uiBoxItem}>
                            <Text style={[Styles.defaultFont, { paddingStart: 8 }]} >Choose Your Background Color:</Text>
                            <View style={Styles.bgBoxContainer}>
                                <TouchableOpacity
                                    style={[Styles.bgBox, { backgroundColor: '#090C08'}]}
                                    onPress={() => { this.handleColor('#090C08') }}
                                />
                                <TouchableOpacity
                                    style={[Styles.bgBox, { backgroundColor: '#474056'}]}
                                    onPress={() => { this.handleColor('#474056') }}
                                />
                                <TouchableOpacity
                                    style={[Styles.bgBox, { backgroundColor: '#8A95A5'}]}
                                    onPress={() => { this.handleColor('#8A95A5') }}
                                />
                                <TouchableOpacity
                                    style={[Styles.bgBox, { backgroundColor: '#B9C6AE'}]}
                                    onPress={() => { this.handleColor('#B9C6AE') }}
                                />
                            </View>
                        </View>
                        <View style={Styles.uiBoxItem}>
                            <TouchableOpacity 
                                onPress={() => { this.handleNav() }}
                                style={Styles.button}
                            >
                                <Text style={[Styles.title, { fontSize: 16 }]} >Start Chatting</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    }
}

const Styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    flexItem: {
        width: '88%',
        height: '44%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        width: '100%'
    },
    title: {
        color: '#FFFFFF',
        fontSize: 45,
        fontWeight: '600',
    },
    uiContainer: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '6%',
    },
    uiBox: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    uiBoxItem: {
        width: '100%',
        // margin: 20,
    },
    defaultFont: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
    },
    textInput: {
        width: '100%',
        opacity: 0.5,
        paddingStart: 8,
    },
    bgBoxContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 8,
        marginBottom: 20,
    },
    bgBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    button: {
        height: 35,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#757083',
    },
});
