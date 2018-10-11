import React from "react";

import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput
} from "react-native";

// styles
import {
    NavigationHeaderTitle,
    ExitPageHeaderRightImage,
    ExitPageHeaderRightView
} from "../UniversalStyles";
import font from "../Font";

// stores
import LocalStore from "../Classes/LocalStore";

// actions
import {
    PostComment
} from "../Actions/AccountActions";

const localstore = new LocalStore();

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

class BackButton extends React.Component {
    constructor() {
        super();

        this.action = this.action.bind(this);
    }

    action() {
        localstore.take("GoBack");
    }

    render() {
        return (
            <TouchableOpacity
                style={ExitPageHeaderRightView}
                onPress={this.action}
            >
                <Text style={NavigationHeaderTitle}>BACK</Text>
            </TouchableOpacity>
        )
    }
}

export default class CreateCommentPageScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            commentText: "",
            numCharacters: 0,
        };

        this.exit = this.exit.bind(this);
        this.maxCharacters = 140;
        this.updateCommentText = this.updateCommentText.bind(this);
        this.postComment = this.postComment.bind(this);
    }

    static navigationOptions = {
        tabBarVisible: false,
        headerLeft: <BackButton/>,
        headerRight: <DoneButton/>,
        headerStyle: {
            backgroundColor: "white",
        }
    }

    componentWillMount() {
        localstore.give("GoBack", this.exit);
        localstore.give("Done", this.postComment);
    }

    exit() {
        this.props.navigation.goBack();
    }

    postComment() {
        // comment, post
        PostComment(this.state.commentText, this.props.navigation.state.params.post);
        //console.log(this.props.navigation.state.params.post);
    }

    updateCommentText(val) {
        if(val.length > this.maxCharacters) {
            return;
        }
        this.setState({
                commentText: val,
                numCharacters: val.length
        });
        if(val.length > 0) {
            localstore.take("toggleOn");
        } else {
            localstore.take("toggleOff");
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.commentContainer}>
                    <TextInput
                        value={this.state.commentText}
                        onChangeText={this.updateCommentText}
                        style={styles.textBox}
                        multiline={true}
                    />
                    <Text style={styles.numCharacters}> {this.maxCharacters - this.state.numCharacters} </Text>
                </View>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
});

AppRegistry.registerComponent("CreateCommentPageScreen", () => CreateCommentPageScreen);
