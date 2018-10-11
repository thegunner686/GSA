import React from "react";
import {
    AppRegistry,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Platform
} from "react-native";

// classes
import LocalStore from "../Classes/LocalStore";

// styles
import {
    NavigationHeaderTitle,
} from "../UniversalStyles";
import font from "../Font";

// stores
import AccountStore from "../Stores/AccountStore";

let localstore = new LocalStore();

class CreatePostButton extends React.Component {
    constructor() {
        super();

        this.state = {
            thinking: false,
        };

        this.action = this.action.bind(this);
    }

    action() {
        this.setState({
            thinkign: true,
        });
        console.log("press");
        localstore.take("NavigateToCreatePost")
    }

    render() {
        return (
            <TouchableOpacity
                style={componentStyles.createPostView}
                onPress={() => this.action()}
            >
                <Image
                    style={componentStyles.createPostImage}
                    disabled={this.state.thinking}
                    source={require("../Assets/Icons/add_black_square.png")}
                />
            </TouchableOpacity>
        );
    }
}

class MenuSortButton extends React.Component {
    constructor() {
        super();

    }

    render() {
        return (
            <TouchableOpacity
                style={componentStyles.menuButtonView}
            >
                <Image
                    style={componentStyles.menuButtonImage}
                    source={require("../Assets/Icons/menu_black_vertical.png")}
                />
            </TouchableOpacity>
        )
    }
}

class ForumPostComponent extends React.Component {
    constructor() {
        super();

        this.action = this.action.bind(this);
    }

    action() {
        localstore.take("NavigateToViewMore", {
            post: this.props.post
        });
    }

    render() {
        let { content, userName } = this.props.post;
        return (
            <TouchableOpacity 
                style={componentStyles.forumPostContainer}
                onPress={this.action}
            >
                <View style={componentStyles.postDataView}>
                    <View style={componentStyles.postContentLabel}>
                        <View style={componentStyles.imageViewContainer}>
                            <View style={componentStyles.imageView}>
                                <Image 
                                    style={componentStyles.profileImage}
                                    source={require("../Assets/Icons/profile_black_filled.png")}
                                />
                            </View>
                        </View>
                        <Text style={componentStyles.postContentLabelText}>
                            {userName}
                        </Text>
                    </View>
                    <View style={componentStyles.postContentView}>
                        <Text style={componentStyles.postContentText}>
                            {content}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default class HomePageScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            posts: [],
        };

        this.navigateToCreatePost = this.navigateToCreatePost.bind(this);
        this.navigateToViewMore = this.navigateToViewMore.bind(this);
        this.navigateToMenu = this.navigateToMenu.bind(this);
        this.forumPostAdded = this.forumPostAdded.bind(this);
        this.forumPostUpdated = this.forumPostUpdated.bind(this);
        this.forumPostRemoved = this.forumPostRemoved.bind(this);
    }

    static navigationOptions = {
        headerTintColor: "rgba(0, 230, 190, 1)",
        headerStyle: {
            backgroundColor: "rgba(0, 230, 190, 0.4)",
        },
        headerTitle: <Text style={NavigationHeaderTitle}> THE FORUM </Text>,
        headerLeft: <MenuSortButton/>,
        headerRight: <CreatePostButton/>
    }

    componentWillMount() {
        localstore.give("NavigateToCreatePost", this.navigateToCreatePost);
        localstore.give("NavigateToMenu", this.navigateToMenu);
        localstore.give("NavigateToViewMore", this.navigateToViewMore);
    }

    componentDidMount() {
        AccountStore.on("ForumPostAdded", this.forumPostAdded);
        AccountStore.on("ForumPostUpdated", this.forumPostUpdated);
        AccountStore.on("ForumPostRemoved", this.forumPostRemoved);
    }

    componentWillUnmount() {
        AccountStore.removeListener("ForumPostAdded", this.forumPostAdded);
        AccountStore.removeListener("ForumPostUpdated", this.forumPostUpdated);
        AccountStore.removeListener("ForumPostRemoved", this.forumPostRemoved);
    }

    forumPostAdded() {
        let post = AccountStore.getLatestPostUpdate();

        post = <ForumPostComponent key={post.id} post={post}/>;

        let posts_state = this.state.posts;
        posts_state.push(post);

        this.setState({
            posts: posts_state
        });
    }

    forumPostUpdated() {
        let post = AccountStore.getLatestPostUpdate();
        
        let posts_state = this.state.posts;
        
        for(let i = posts_state.length - 1; i >= 0; i--) {
            if(posts_state[i].key == post.id) {
                posts_state[i] = <ForumPostComponent key={post.id} post={post}/>;
                break;
            }
        }

        this.setState({
            posts: posts_state,
        });
    }

    forumPostRemoved() {
        let post = AccountStore.getLatestPostUpdate();

        let posts_state = this.state.posts;

        for(let i = posts_state.length - 1; i >= 0; i--) {
            if(posts_state[i].key == post.id) {
                let removed = posts_state.splice(i, 1);
                //console.log(removed);
                break;
            }
        }

        this.setState({
            posts: posts_state,
        });
    }

    navigateToCreatePost() {
        this.props.navigation.navigate("CreatePostPage");
    }

    navigateToMenu() {

    }

    navigateToViewMore(props) {
        this.props.navigation.navigate("ViewPost", {
            ...props
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1}}>
                    {this.state.posts.sort((p1, p2) => {
                        return parseInt(p2.props.post.time) - parseInt(p1.props.post.time);
                    })}
                </ScrollView>
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
        backgroundColor: "white",
        margin: 0,
        padding: 0,
       // backgroundColor: "#fafafa",
    },
});

let profilePictureSize = Dimensions.get("window").width / 10 * 1;

let componentStyles = StyleSheet.create({
    forumPostContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "white",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height / 10 * 2.3,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderBottomWidth: 1,
        marginTop: 20,
        padding: 10,
        // shadowOffset: {
        //     width: 1,
        //     height: 1,
        // },
        // shadowColor: "#404040",
        // shadowOpacity: 0.8,
        // shadowRadius: 1,
    },
    postContentLabel: {
        flex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "white",
    },
    postContentLabelText: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left",
        marginLeft: 5,
        flexDirection: "row",
        color: "#404040",
        fontWeight: "600",
        fontFamily: font,
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowRadius: 1,
        textShadowOffset: {
            width: 0.2,
            height: 0.2,
        },
    },
    postDataView: {
        flex: 4,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection: "column",
    },
    profileView: {
        flex: 1,
    },
    postContentView: {
        flex: 4,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        paddingTop: 25,
        justifyContent: "center",
    },
    postContentText: {
        flex: 1,
        textAlign: "left",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        fontFamily: font,
        fontWeight: "300",
        color: "#404040",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowRadius: 1,
        textShadowOffset: {
            width: 0.7,
            height: 0.7,
        },
        fontSize: 14,
    },
    viewPostButton: {
        flex: 1,
        width: Dimensions.get("window").width / 10 * 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    viewPostButtonText: {
        fontFamily: font,
        fontSize: 10,
        fontWeight: "200",
    },
    imageViewContainer: {
        //position: "relative",
        //left: Dimensions.get("window").width / 40,
        width: profilePictureSize,
        height: profilePictureSize,
        borderRadius: 200,
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        shadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        shadowColor: "#404040",
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    imageView: {
        width: profilePictureSize,
        height: profilePictureSize,
        borderRadius: 200,
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        overflow: "hidden",
    },
    profileImage: {
        width: profilePictureSize,
        height: profilePictureSize,
        overflow: "hidden",
        borderBottomRightRadius: 200,
        borderBottomLeftRadius: 200,
        borderTopRightRadius: 200,
        borderTopLeftRadius: 200,
    },


    // navigation bar buttons
    createPostView: {
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginRight: Dimensions.get("window").width / 40,
    },
    createPostImage: {
        width: Dimensions.get("window").width / 12,
        height: Dimensions.get("window").width / 12,
    },
    menuButtonView: {
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: Dimensions.get("window").width / 40,
    },
    menuButtonImage: {
        width: Dimensions.get("window").width / 16,
        height: Dimensions.get("window").width / 16,
    }
});

AppRegistry.registerComponent("HomePageScreen", () => HomePageScreen);