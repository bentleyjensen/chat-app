import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useState } from 'react';
import { getDownloadURL, getMetadata, ref, uploadBytes } from '@firebase/storage';

const CustomActions = ({wrapperStyle, iconTextStyle, onSend, storage, uid}) => {
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);

    const actionSheet = useActionSheet();

    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImageFromLibrary();
                        return;
                    case 1:
                        takeNewPhoto();
                        return;
                    case 2:
                        getLocation();
                    default:
                }
            },
        );
    };

    const pickImageFromLibrary = async () => {
        // Get permission to access their media
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

        // If the have accepted, launch the media library
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();

            // If they actually selected an image, update state
            if (!result?.canceled) {
                uploadAndSendImage(result.assets[0].uri);
            }
        } else {
          Alert.alert('Media Access permissions denied');
        }
    };

    const takeNewPhoto = async () => {
        // Get permission to access their media
        let permissions = await ImagePicker.requestCameraPermissionsAsync();

        // If the have accepted, launch the media library
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();

            // If they actually selected an image, update state
            if (!result?.canceled) {
                uploadAndSendImage(result.assets[0].uri);
            }
        } else {
          Alert.alert('Camera Access permissions denied');
        }
    };

    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");
    }

    // Convert the image to a type firestore can handle
    const uriToBlob = async (uri) => {
      const asset = await fetch(uri);
      const blob = await asset.blob();
      return blob;
    }

    // Create a unique string for the image to save to
    const getUploadRef = (uri) => {
      // get image name out from full uri
      const uriArray = uri.split('/');
      const imageName = uriArray[uriArray.length - 1];

      return ref(storage, `${uid}-image-${Date.now()}-${imageName}`);
    }

    const uploadAndSendImage = async (uri) => {
      const uploadRef = getUploadRef(uri);
      const blob = await uriToBlob(uri);

      uploadBytes(uploadRef, blob).then(async (snapshot) => {
        // The download url is in the snapshot after it uploads successfully
        const downloadUrl = await getDownloadURL(snapshot.ref);
        onSend({ image: downloadUrl });
      });
    }


    return <TouchableOpacity
        style={[styles.container]}
        onPress={onActionPress}
    >
        <View style={[styles.wrapper, wrapperStyle]} >
            <Text style={[styles.iconText, iconTextStyle]}>
                +
            </Text>
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
}

export default CustomActions;
