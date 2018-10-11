import React from "react";

import {
    View,
    Text,
    AppRegistry,
    StyleSheet
} from "react-native";

export default class ProfilePageScreen extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View>
                <Text> profile </Text>
            </View>
        )
    }
}

AppRegistry.registerComponent("ProfilePageScreen", () => ProfilePageScreen);