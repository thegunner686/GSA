import React from "react";

import {
    AppRegistry,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions
} from "react-native";

// styles
import {
    ExitPageHeaderRightView,
    ExitPageHeaderRightImage,
    NavigationHeaderTitle,
} from "../UniversalStyles";

// classes
import LocalStore from "../Classes/LocalStore";
import { genUniqueId } from "../Classes/Utilities";
import AccountStore from "../Stores/AccountStore";

// actions
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

class CommentComponent extends React.Component {
    constructor() {
        super();
    }

    render() {
        let { content, userName } = this.props.comment;
        return (
            <View>
                {content} by {userName}
            </View>
        );
    }
}

export default class ViewPostDetailsPageScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            comments: [],
        };

        this.goBack = this.goBack.bind(this);
        this.commentAdded = this.commentAdded.bind(this);
        this.commentUpdated = this.commentUpdated.bind(this);
        this.commentRemoved = this.commentRemoved.bind(this);
        this.navigateToCreateComment = this.navigateToCreateComment.bind(this);
    }

    static navigationOptions = ({ navigation }) => { 
        let { params } = navigation.state,
            { post } = params,
            { userName } = post;
        return {
            tabBarVisible: false,
            headerTintColor: "#292929",
            headerLeft: <BackExitButton/>,
            headerTitle: <Text style={NavigationHeaderTitle}>{userName}'s Post</Text>
        }
    }

    componentWillMount() {
        localstore.give("GoBack", this.goBack);
        let { ref } = this.props.navigation.state.params.post;
    }

    componentDidMount() {
        let { ref } = this.props.navigation.state.params.post;
        AccountStore.listenForCommentsOnPostWithRef(ref);
        AccountStore.on("CommentAdded", this.commentAdded);
        AccountStore.on("CommentUpdated", this.commentUpdated);
        AccountStore.on("CommentRemoved", this.commentRemoved);
    }

    componentWillUnmount() {
        let { ref } = this.props.navigation.state.params.post;
        AccountStore.removeListenerForCommentsOnPostWithRef(ref);
        AccountStore.removeListener("CommentAdded", this.commentAdded);
        AccountStore.removeListener("CommentUpdated", this.commentUpdated);
        AccountStore.removeListener("CommentRemoved", this.commentRemoved);
    }

    commentAdded() {
        let comment = AccountStore.getLatestCommentUpdate(),
        state_comments = this.state.comments;

        comment = <CommntComponent key={comment.id} comment={comment}/>;
        
        state_comments.push(comment);

        this.setState({
            comments: state_comments,
        });
    }

    commentUpdated() {
        let comment = AccountStore.getLatestCommentUpdate(),
            state_comments = this.state.comments;

        for(let i = state_comments.length - 1; i >= 0; i--) {
            if(state_comments[i].key == comment.id) {
                state_comments[i] = <CommentComponent key={comment.id} comment={comment} />;
                break;
            }
        }

        this.setState({
            comments: state_comments,
        });
    }

    commentRemoved() {
        let comment = AccountStore.getLatestCommentUpdate(),
            state_comments = this.state.comments;

        for(let i = state_comments.length - 1; i >= 0; i--) {
            if(state_comments[i].key == comment.id) {
                state_comments.splice(i, 1);
                break;
            }
        }

        this.setState({
            comments: state_comments,
        });
    }

    goBack() {
        this.props.navigation.dispatch(NavigationActions.back({
            key: null 
        }));
    }

    navigateToCreateComment() {
        this.props.navigation.navigate("CreateCommentPage", {
            post: this.props.navigation.state.params
        });
    }

    render() {
        let { post } = this.props.navigation.state.params,
            { userName, content, anonymous } = post;
        return (
            <View style={styles.container}>
                <View style={styles.sidebarContainer}>

                </View>
                <View style={styles.mainContentContainer}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.contentText}>
                            {content}
                        </Text>
                    </View>
                    <ScrollView>
                        {this.state.comments}
                    </ScrollView>
                    <TouchableOpacity 
                        style={styles.addResponseButton}
                        onPress={this.navigateToCreateComment}
                    > 
                        <Text
                            style={styles.addResponseButtonText}
                        >
                            ADD RESPONSE 
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// add response button variables
let width = Dimensions.get("window").width,
    height = Dimensions.get("window").height,
    ht = height / 15,
    wd = width / 10 * 9;

let styles = StyleSheet.create({
    addResponseButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: wd,
        height: ht,
        backgroundColor: "rgb(0, 230, 190)",
        borderRadius: 10,
    },
    addResponseButtonText: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        textAlign: "center",
        color: "white",
    }
});

AppRegistry.registerComponent("ViewPostDetailsPageScreen", () => ViewPostDetailsPageScreen);