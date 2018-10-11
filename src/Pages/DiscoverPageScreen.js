import React from "react";

import {
    View,
    Text,
    AppRegistry,
    StyleSheet
} from "react-native";

export default class DiscoverPageScreen extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View>
                <Text> discover </Text>
            </View>
        )
    }
}

AppRegistry.registerComponent("DiscoverPageScreen", () => DiscoverPageScreen);