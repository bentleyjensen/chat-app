import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';


export default class CustomActions extends Component {
    constructor (props) {
        super(props);
    }

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return;
                    case 1:
                        console.log('user wants to take a photo');
                        return;
                    case 2:
                        console.log('user wants to get their location');
                    default:
                }
            },
        );
    };
    // onActionPress = () => {
    //     const options = ['Choose From Library', 'Take New Photo', 'Send Current Location', 'Cancel'];

    //     // Cancel is always last
    //     const cancelButtonIndex = options.length - 1;

    //     console.log(Object.keys(this.context));
    //     console.log(this.context.actionSheet);
    //     console.log(typeof this.context.actionSheet);
    //     console.log(this.context.actionSheet == undefined);

    //     this.context.actionSheet().showActionSheetWithOptions({
    //         options,
    //         cancelButtonIndex,
    //     }, async (buttonIndex) => {
    //         switch (buttonIndex) {
    //             case 0:
    //                 console.log("Option: Choose from library");
    //                 break;
    //             case 1:
    //                 console.log("Option: Take new photo");
    //                 break;
    //             case 2:
    //                 console.log("Option: Send Current Location");
    //                 break;
    //             default:
    //                 console.log("User cancelled the transaction");
    //                 break;
    //         }
    //     })
    // }

    render() {
        return <TouchableOpacity
            style={[ styles.container ]}
            onPress={ this.onActionPress }
        >
            <View style={[ styles.wrapper, this.props.wrapperStyle ]} >
                <Text style={[ styles.iconText, this.props.iconTextStyle ]}>
                    +
                </Text>
            </View>
        </TouchableOpacity>
    }
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
