import React from "react";
import {
    AppRegistry,
    Image,
    ImageBackground,
    View,
    KeyboardAvoidingView,
    Text,
    Alert,
    StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Platform,
    AsyncStorage,
} from "react-native";

import font from "../Font";

// stores
import AccountStore from "../Stores/AccountStore";

// styles
import {
    NavigationHeaderTitle
} from "../UniversalStyles";

// actions
import {
    SignIn 
} from "../Actions/AccountActions";

// components
import Loader from "../Components/Loader";


export default class SignInScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            username: "",
            password: "",
            thinking: false,
        };

        this.signIn = this.signIn.bind(this);
        this.update = this.update.bind(this);
        this.signInSuccess = this.signInSuccess.bind(this);
        this.signInError = this.signInError.bind(this);
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: "white",
        },
        headerTintColor: "rgba(0, 230, 190, 1)",
        headerTitle: <Text style={NavigationHeaderTitle}> SIGN IN </Text>,
    }

    componentDidMount() {
        AccountStore.on("SignInSuccess", this.signInSuccess);
        AccountStore.on("SignInError", this.signInError);
    }

    componentWillUnmount() {
        AccountStore.removeListener("SignInSuccess", this.signInSuccess);
        AccountStore.removeListener("SignInError", this.signInError);
    }

    signInSuccess() {
        AsyncStorage.setItem("username", this.state.username).catch((error) => {
            console.log(error);
        })
        AsyncStorage.setItem("password", this.state.password).catch((error) => {
            console.log(error);
        });
        this.setState({
            thinking: false,
        });
        this.props.navigation.navigate("Main");
    }

    signInError() {
        this.setState({
            thinking: false,
        });
        let error = AccountStore.getSignInError();
        console.log(error);
        Alert.alert(
            "Attention",
            error.message,
            [
                {
                    text: "Okay"
                }
            ]
        );
    }

    signIn() {
        let { username, password } = this.state;
        SignIn(username, password);
        this.setState({
            thinking: true,
        });
    }

    update(key, val) {
        let st = this.state;
        st[key] = val;
        this.setState({
            ...st
        });
    }

    render() {
        return (
            <View style={styles.container}>
                            <View style={styles.box}>
                                <TextInput
                                    placeholder="Email"
                                    disabled={this.state.thinking}
                                    value={this.state.username}
                                    onChangeText={(val) => this.update("username", val)}
                                    style={styles.input}
                                />
                                <TextInput
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    disabled={this.state.thinking}
                                    value={this.state.password}
                                    onChangeText={(val) => this.update("password", val)}
                                    style={styles.input}
                                />

                                <View style={styles.buffer}></View>
                                <View style={styles.buffer}></View>
                                <KeyboardAvoidingView
                                    style={styles.buttonView}
                                    contentContainerStyle={styles.buttonView}
                                    behavior="position"
                                >
                                    <TouchableOpacity
                                        disabled={this.state.thinking}
                                        style={styles.doneButton}
                                        onPress={this.signIn}
                                    >
                                        <Text style={styles.doneButtonText}> DONE </Text>
                                    </TouchableOpacity>
                                </KeyboardAvoidingView>
                                <View style={styles.buffer}></View>

                            </View> 
                    {this.state.thinking ? <Loader/> : null }
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    box: {
        flex: 7,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        width: Dimensions.get("window").width,
        backgroundColor: "rgba(255, 255, 255, 1)",
        paddingTop: 10,
    },
    input: {
        height: Dimensions.get("window").height / 20,
        width: Dimensions.get("window").width / 10 * 7,
        fontFamily: font,
        fontSize: 16,
        padding: 2,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderBottomWidth: 1,
        margin: 5,
    },
    orText: {
        color: "white",
        margin: 5,
    },
    buttonView: {
        flex: 1,
        display: "flex",
    },
    doneButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: Dimensions.get("window").height / 15,
        width: Dimensions.get("window").width / 10 * 7,
        backgroundColor: "rgba(0, 230, 190, 1)",
        borderColor: "rgba(0, 0, 0, 0.2)",
    },
    doneButtonText: {
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: font,
        fontSize: 18,
        fontWeight: "500",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
    },
    buffer: {
        flex: 1,
    }
})

AppRegistry.registerComponent("SignInScreen", () => SignInScreen);