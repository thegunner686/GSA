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
    AsyncStorage
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
    CreateAccount
} from "../Actions/AccountActions";

// components
import Loader from "../Components/Loader";


export default class CreateAccountScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            confirmPassword: "",
            thinking: false,
        };

        this.createAccount = this.createAccount.bind(this);
        this.update = this.update.bind(this);
        this.createAccountSuccess = this.createAccountSuccess.bind(this);
        this.createAccountError = this.createAccountError.bind(this);
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: "white",
        },
        headerTintColor: "rgba(0, 230, 190, 1)",
        headerTitle: <Text style={NavigationHeaderTitle}> CREATE ACCOUNT</Text>,
    }

    componentDidMount() {
        AccountStore.on("CreateAccountSuccess", this.createAccountSuccess);
        AccountStore.on("CreaetAccountError", this.createAccountError);
    }

    componentWillUnmount() {
        AccountStore.removeListener("CreateAccountSuccess", this.createAccountSuccess);
        AccountStore.removeListener("CreateAccountError", this.createAccountError);
    }

    createAccountSuccess() {
        AsyncStorage.setItem("username", this.state.username).catch((error) => {
            console.log(error);
        })
        AsyncStorage.setItem("password", this.state.password).catch((error) => {
            console.log(error);
        });
        this.setState({
            thinking: false,
        });
        console.log("success");
        this.props.navigation.navigate("Main");
    }

    createAccountError() {
        this.setState({
            thinking: false,
        });
        let error = AccountStore.getCreateAccountError();
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

    createAccount() {
        let { username, password, confirmPassword } = this.state;
        if(password == confirmPassword) {
            CreateAccount(username, password, {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
            });
            this.setState({
                thinking: true,
            });
        } else {
            Alert.alert(
                "Attention",
                "Passwords do not match.",
                [
                    {
                        text: "Okay"
                    }
                ]
            );
        }
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
                                    placeholder="First Name"
                                    disabled={this.state.thinking}
                                    value={this.state.firstname}
                                    onChangeText={(val) => this.update("firstName", val)}
                                    style={styles.input}
                                />
                                <TextInput
                                    placeholder="Last Name"
                                    disabled={this.state.thinking}
                                    value={this.state.lastname}
                                    onChangeText={(val) => this.update("lastName", val)}
                                    style={styles.input}
                                />
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
                                <TextInput
                                    placeholder="Confirm Password"
                                    secureTextEntry={true}
                                    disabled={this.state.thinking}
                                    value={this.state.confirmPassword}
                                    onChangeText={(val) => this.update("confirmPassword", val)}
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
                                        onPress={this.createAccount}
                                    >
                                        <Text style={styles.doneButtonText}> REGISTER </Text>
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
});

AppRegistry.registerComponent("CreateAccountScreen", () => CreateAccountScreen);