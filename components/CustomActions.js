import { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';


export default class CustomActions extends Component {
    constructor (props) {
        super(props);
    }

    onActionPress = () => {
        const options = ['Choose From Library', 'Take New Photo', 'Send Current Location', 'Cancel'];

        // Doesn't need updated if options are
        const cancelButtonIndex = options.length - 1;

        this.context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex,
        }, async (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                    console.log("Option: Choose from library");
                    break;
                case 1:
                    console.log("Option: Take new photo");
                    break;
                case 2:
                    console.log("Option: Send Current Location");
                    break;
                default:
                    console.log("User cancelled the transaction");
                    break;
            }
        })
    }

    render() {
        return <TouchableOpacity
            style={[ styles.container ]}
            onPress={ this.onActionPress.bind(this) }
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
