import React from "react";

import {
    View,
    Text,
    AppRegistry,
    TouchableOpacity,
    Image,
    StyleSheet,
    TextInput,
    Dimensions,
} from "react-native";


// components
import Loader from "../Components/Loader";

// styles
import {
    ExitPageHeaderRightView,
    ExitPageHeaderRightImage,
    NavigationHeaderTitle,
} from "../UniversalStyles";
import font from "../Font";

// classes
import LocalStore from "../Classes/LocalStore";

// stores
import AccountStore from "../Stores/AccountStore";

// actions
import {
    CreateForumPost
} from "../Actions/AccountActions";

import { NavigationActions } from "react-navigation";

let localstore = new LocalStore();

class BackExitButton extends React.Component {
    constructor() {
        super();
        this.state = {
            thinking: false,
        };

        this.action = this.action.bind(this);
    }

    action() {
        this.setState({
            thinking: true,
        });
        localstore.take("GoBack");
    }

    render() {
        return (
            <TouchableOpacity
                style={ExitPageHeaderRightView}
                onPress={this.action}
            >
                <Image 
                    source={require("../Assets/Icons/delete_black.png")}
                    disabled={this.state.thinking}
                    onPress={this.action}
                    style={ExitPageHeaderRightImage}
                />
            </TouchableOpacity>
        )
    }
}

class DoneButton extends React.Component {
    constructor() {
        super();

        this.untoggledStyleView = ExitPageHeaderRightView;
        let copyView = Object.assign({}, ExitPageHeaderRightView);
        //    copyView["backgroundColor"] = "#292929";
        this.toggledStyleView = copyView;
        
        this.untoggledStyleText = NavigationHeaderTitle;
        let copyText = Object.assign({}, NavigationHeaderTitle);
        //    copyText["color"] = "white";
            copyText["fontWeight"] = "700";
        this.toggledStyleText = copyText;

        this.state = {
            viewStyle: this.untoggledStyleView,
            textStyle: this.untoggledStyleText,
            clickable: false,
        };

        this.action = this.action.bind(this);

        this.toggledOn = this.toggledOn.bind(this);
        this.toggledOff = this.toggledOff.bind(this);
    }

    componentWillMount() {
        localstore.give("toggleOn", this.toggledOn);
        localstore.give("toggleOff", this.toggledOff);
    }

    toggledOn() {
        this.setState({
            viewStyle: this.toggledStyleView,
            textStyle: this.toggledStyleText,
            clickable: true,
        });
    }

    toggledOff() {
        this.setState({
            viewStyle: this.untoggledStyleView,
            textStyle: this.untoggledStyleText,
            clickable: false,
        });
    }

    action() {
        localstore.take("Done");
    }

    render() {
        return (
            <TouchableOpacity
             disabled={!this.state.clickable}
             style={this.state.viewStyle}
             onPress={this.action}
             >
                <Text style={this.state.textStyle}>DONE</Text>
            </TouchableOpacity>
        )
    }
}

export default class CreatePostPageScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            numCharacters: 0,
            postText: "",
            thinking: false,
        };

        this.updatePostText = this.updatePostText.bind(this);
        this.createForumPost = this.createForumPost.bind(this);
        this.forumPostCreatedSuccess = this.forumPostCreatedSuccess.bind(this);
        this.maxCharacters = 140;
        this.exit = this.exit.bind(this);
    }

    componentWillMount() {
        localstore.give("GoBack", this.exit);
        localstore.give("Done", this.createForumPost);
    }

    componentDidMount() {
        AccountStore.on("ForumPostCreatedSuccess", this.forumPostCreatedSuccess);
    }

    componentWillUnmount() {
        AccountStore.removeListener("ForumPostCreatedSuccess", this.forumPostCreatedSuccess);
    }

    forumPostCreatedSuccess() {
        this.setState({
            thinking: false,
        });
        this.props.navigation.goBack();
    }

    exit() {
        this.props.navigation.goBack();
    }

    static navigationOptions = {
        tabBarVisible: false,
        headerTitle: <Text style={NavigationHeaderTitle}> CREATE POST </Text>,
        headerLeft: <BackExitButton />,
        headerRight: <DoneButton />,
        headerStyle: {
            backgroundColor: "white",
        },
        mode: "modal",
    }

    updatePostText(val, index) {
        if(val.length > this.maxCharacters) {
            return;
        }
        this.setState({
                postText: val,
                numCharacters: val.length
        });
        if(val.length > 0) {
            localstore.take("toggleOn");
        } else {
            localstore.take("toggleOff");
        }
    }

    createForumPost() {
        this.setState({
            thinking: true,
        });
        CreateForumPost(this.state.postText, {
            anonymous: false,
        });
    }

    render() {
        let { postText, numCharacters } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.postContainer}>
                    <TextInput
                        value={postText}
                        onChangeText={this.updatePostText}
                        style={styles.textBox}
                        multiline={true}
                    />
                    <Text style={styles.numCharacters}> {this.maxCharacters - numCharacters} </Text>
                </View>
                {this.state.thinking ? <Loader/> : null }
            </View>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white",
        
    },

    numCharacters: {
        width: Dimensions.get("window").width / 10 * 9,
        marginBottom: Dimensions.get("window").width / 20,
        textAlign: "right",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: font,
        fontSize: 12,
        fontWeight: "300",
        color: "#292929",
    },

    textBox: {
        width: Dimensions.get("window").width / 10 * 9,
        height: Dimensions.get("window").height / 5,
        margin: Dimensions.get("window").width / 20,
        padding: 5,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
        fontFamily: font,
        fontSize: 15,
        color: "#292929",
        fontWeight: "200",
    },

    postButton: {
        width: Dimensions.get("window").width / 10 * 4,
        height: Dimensions.get("window").height / 15,
        backgroundColor: "rgb(0, 230, 190)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    postButtonText: {
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: font,
        fontSize: 18,
        fontWeight: "400",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: {
            width: 0.5,
            height: 0.5,
        }
    }
})

AppRegistry.registerComponent("CreatePostPageScreen", () => CreatePostPageScreen);