import React from "react";
import {
    StackNavigator,
    TabNavigator,
} from "react-navigation";


// initial
import CreateAccountScreen from "./Pages/CreateAccountScreen";
import SignInScreen from "./Pages/SignInScreen";
import LandingScreen from "./Pages/LandingScreen";

// body

    // home stack
    import HomePageScreen from "./Pages/HomePageScreen";
    import CreatePostPageScreen from "./Pages/CreatePostPageScreen";
    import ViewPostDetailsPageScreen from "./Pages/ViewPostDetailsPageScreen";
    import CreateCommentPageScreen from "./Pages/CreateCommentPageScreen";


import DiscoverPageScreen from "./Pages/DiscoverPageScreen";
import MessagesPageScreen from "./Pages/MessagesPageScreen";
import ProfilePageScreen from "./Pages/ProfilePageScreen";


const fade = sceneProps => {
    const { layout, position, scene } = sceneProps;
    const { index } = scene;
    const width = layout.initWidth;

    return {
      opacity: position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [ 0, 1, 0],
      }),
    };
  }

const fadeWithTransform = sceneProps => {
    const { layout, position, scene } = sceneProps;
    const { index } = scene;
    const width = layout.initWidth;

    return {
      opacity: position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [ 0, 1, 0],
      }),
      transform: [{
        translateX: position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, -width],
        }),
      }]
    };
  }


let PostStack = TabNavigator({
    ViewPostDetailsPage: {
        screen: ViewPostDetailsPageScreen,
    },
    CreateCommentPage: {
        screen: CreateCommentPageScreen,
    }
}, {
    tabBarVisible: false,
    transitionConfig: () => ({
        screenInterpolator: (props) => {
            return fade(props)
        }
    })
});

let HomeStack = StackNavigator({
    HomePage: {
        screen: HomePageScreen,
    },
    CreatePostPage: {
        screen: CreatePostPageScreen,
    },
    ViewPost: {
        screen: PostStack,
    }
}, {
    mode: "modal",
});

let MessagesStack = StackNavigator({
    MessagesPage: {
        screen: MessagesPageScreen,
    }
});

let DiscoverStack = StackNavigator({
    DiscoverPage: {
        screen: DiscoverPageScreen,
    }
});

let ProfileStack = StackNavigator({
    ProfilePage: {
        screen: ProfilePageScreen,
    }
});

let MainTabNavigation = TabNavigator({
    Home: {
        screen: HomeStack,
    },
    Discover: {
        screen: DiscoverStack,
    },
    Messages: {
        screen: MessagesStack,
    },
    Profile: {
        screen: ProfileStack,
    }
}, {
    transitionConfig: () => ({
        screenInterpolator: (props) => {
            return fade(props)
        }
    })
});

let SignInStack = StackNavigator({
    Landing: {
        screen: LandingScreen,
        navigationOptions: {
            header: null,
        },
    },
    SignIn: {
        screen: SignInScreen,
        
    },
    CreateAccount: {
        screen: CreateAccountScreen,
    },
}, {
    transitionConfig: () => ({
        screenInterpolator: (props) => {
            return fadeWithTransform(props)
        }
    })
});

let MainTab = TabNavigator({
    SignIn: {
        screen: SignInStack,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
    Main: {
        screen: MainTabNavigation,
        navigationOptions: {
            header: null,
            tabBarVisible: false,
        }
    }
}, {
    transitionConfig: () => ({
        screenInterpolator: (props) => {
            return fade(props)
        }
    })
});

export default MainTab;