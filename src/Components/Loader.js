import React from "react";
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    Image
} from "react-native";

export default class Loader extends React.Component {
    render() {
        return (
            <Image 
            source={require("../Assets/loading.gif")} 
            style={styles.loader}/>
        );
    }
}

let size = Dimensions.get("window").width / 5

let styles = StyleSheet.create({
    loader: {
        position: "absolute",
        left: Dimensions.get("window").width / 2 - size / 2,
        top: Dimensions.get("window").height / 3 - size / 2,
        width: size,
        height: size
    }
})

