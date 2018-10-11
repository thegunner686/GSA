import React from "react";
import {
    AppRegistry,
    Image,
    ImageBackground,
    View,
    KeyboardAvoidingView,
    Text,
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


// actions
import {
    AutomaticSignIn 
} from "../Actions/AccountActions";

// components
import Loader from "../Components/Loader";

export default class LandingScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            thinking: false,
        };

        this.automaticSignInError = this.automaticSignInError.bind(this);
        this.automaticSignInSuccess = this.automaticSignInSuccess.bind(this);
    }

    componentDidMount() {
        this.setState({
            thinking: true,
        });
        Promise.all([
            AsyncStorage.getItem("username"),
            AsyncStorage.getItem("password")
        ]).then((responses) => {
            // [username, password]
            let username = responses[0],
                password = responses[1];
            if(username && password) {
                AutomaticSignIn(username, password);
            } else {
                this.setState({
                    thinking: false,
                });
            }
        }).catch((error) => {
            console.log(error);
        });

        AccountStore.on("AutomaticSignInSuccess", this.automaticSignInSuccess);
        AccountStore.on("AutomaticSignInError", this.automaticSignInError);
    }

    componentWillUnmount() {
        AccountStore.removeListener("AutomaticSignInSuccess", this.automaticSignInSuccess);
        AccountStore.removeListener("AutomaticSignInError", this.automaticSignInError);
    }

    automaticSignInSuccess() {
        this.setState({
            thinking: false,
        });
        this.props.navigation.navigate("Main");
    }

    automaticSignInError() {
        this.setState({
            thinking: false,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground
                    style={styles.backgroundImage}
                    source={require("../Assets/Aesthetics/img3.jpg")}
                >
                    <KeyboardAvoidingView 
                    behavior="position"
                    contentContainerStyle={styles.imageCover}
                    style={styles.imageCover}>
                        <View style={styles.titleContainer}>
                            <View style={styles.buffer}></View>
                            <Image 
                                source={require("../Assets/Logos/GSA_white_thick.png")}
                                style={styles.logo}
                            />
                            <View style={styles.buffer}></View>
                        </View>
                            <View style={styles.box}>
                                
                                <TouchableOpacity
                                    disabled={this.state.thinking}
                                    style={styles.signInButton}
                                    onPress={() => this.props.navigation.navigate("SignIn")}
                                >
                                    <Text style={styles.signInButtonText}> SIGN IN </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={this.state.thinking}
                                    style={styles.createAccountButton}
                                    onPress={() => this.props.navigation.navigate("CreateAccount")}
                                >
                                    <Text style={styles.createAccountButtonText}> CREATE ACCOUNT </Text>
                                </TouchableOpacity>
                            </View> 
                    </KeyboardAvoidingView>
                    {this.state.thinking ? <Loader/> : null }
                </ImageBackground>
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
        justifyContent: "center",
    },
    backgroundImage: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: Dimensions.get("window").width,
    },
    imageCover: {
        flex: 1,
        width: Dimensions.get("window").width,
        backgroundColor: "rgba(0, 230, 190, 0.2)",
    },
    logo: {
        width: Dimensions.get("window").width / 2,
        height: Dimensions.get("window").width / 2,
    },
    titleContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        textAlign: "left",
        fontSize: Dimensions.get("window").width / 9,
        fontWeight: "900",
        color: "white",
        fontFamily: font,
        textShadowColor: "rgba(0, 0, 0, 0.4)",
        textShadowOffset: {
            width: 1,
            height: 1,
        }
    },
    bolded: {
        color: "#ff2929",
    },
    box: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        width: Dimensions.get("window").width,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        position: "absolute",
        bottom: 0,
        
    },
    signInButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: Dimensions.get("window").height / 15,
        width: Dimensions.get("window").width,
        backgroundColor: "rgba(0, 230, 190, 1)",
    },
    signInButtonText: {
        textAlign: "center",
        color: "white",
        fontFamily: font,
        fontSize: 18,
        fontWeight: "400",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: {
            width: 0.5,
            height: 0.5,
        }
    },
    createAccountButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: Dimensions.get("window").height / 15,
        width: Dimensions.get("window").width,
        backgroundColor: "white",
    },
    createAccountButtonText: {
        textAlign: "center",
        color: "rgba(0, 230, 190, 1)",
        fontFamily: font,
        fontSize: 18,
        fontWeight: "400",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: {
            width: 0.5,
            height: 0.5,
        }
    },
    buffer: {
        flex: 1,
    }
})

AppRegistry.registerComponent("LandingScreen", () => LandingScreen);