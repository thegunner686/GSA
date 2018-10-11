import React from "react";

import {
    View,
    Text,
    AppRegistry,
    StyleSheet
} from "react-native";

export default class MessagesPageScreen extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View>
                <Text> messages </Text>
            </View>
        )
    }
}

AppRegistry.registerComponent("MessagesPageScreen", () => MessagesPageScreen);