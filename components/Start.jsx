import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState } from "react";

import { getAuth, signInAnonymously } from "firebase/auth";

/**
 * The starting screen of the app. Collects bg color and name from the user.
 * @param {*} props
 * @returns A JSX object for the start screen
 */
const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bgColor, setBgColor] = useState('#090C08');
  const [color, setColor] = useState('#FFFFFF');


  // Sign in to firebase
  const signInUser = () => {
    // TODO: Save user in AsyncStorage
    // Then sign in if we don't have the user already
    signInAnonymously(getAuth())
      .then(result => {
        navigation.navigate('Chat', {
          name: name,
          bgColor: bgColor,
          color: color,
          uid: result.user.uid
        });
      }).catch(error => {
        Alert.alert("Unable to sign in: ", (error.message || error.msg));
      });
  }

  return (
    <ImageBackground
      source={require('../assets/bg_image.png')}
      resizeMode='cover'
      style={Styles.background}
    >
      <View style={Styles.flexContainer}>
        <View style={Styles.flexItem} >
          <Text style={Styles.title}>Welcome to Mumble</Text>
        </View>
        <View style={[Styles.flexItem, Styles.uiContainer]}>
          <View style={Styles.uiBox}>
            <View style={[Styles.uiBoxItem, { flexDirection: 'row', borderColor: '#757083', borderWidth: 1, padding: 5 }]}>
              <Image style={{ height: 20, width: 20 }} source={require('../assets/icon.svg')} />
              <TextInput
                style={[Styles.textInput, Styles.defaultFont]}
                placeholder='Your Name'
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={Styles.uiBoxItem}>
              <Text style={[Styles.defaultFont, { paddingStart: 8 }]} >Choose Your Background Color:</Text>
              <View style={Styles.bgBoxContainer}>
                <TouchableOpacity
                  style={[Styles.bgBox, { backgroundColor: '#090C08' }]}
                  onPress={() => { setBgColor('#090C08'); setColor('#FFFFFF') }}
                />
                <TouchableOpacity
                  style={[Styles.bgBox, { backgroundColor: '#474056' }]}
                  onPress={() => { setBgColor('#474056'); setColor('#FFFFFF') }}
                />
                <TouchableOpacity
                  style={[Styles.bgBox, { backgroundColor: '#8A95A5' }]}
                  onPress={() => { setBgColor('#8A95A5'); setColor('#000000') }}
                />
                <TouchableOpacity
                  style={[Styles.bgBox, { backgroundColor: '#B9C6AE' }]}
                  onPress={() => { setBgColor('#B9C6AE'); setColor('#000000') }}
                />
              </View>
            </View>
            <View style={Styles.uiBoxItem}>
              <TouchableOpacity
                onPress={signInUser}
                style={Styles.button}
              >
                <Text style={[Styles.title, { fontSize: 16 }]}>Start Mumbling</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
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

export default Start;
