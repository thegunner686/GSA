import React from "react";

import {
    Dimensions,
    Platform
} from "react-native";

import font from "./Font";
export let NavigationHeaderTitle = {
        fontSize: 12,
        textAlign: "center",
        color: "#292929",
        fontFamily: font,
        fontWeight: "200",
};

export let ExitPageHeaderRightView = {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Dimensions.get("window").width / 40,
    marginRight: Dimensions.get("window").width / 40,
};

export let ExitPageHeaderRightImage = {
    width: Dimensions.get("window").width / 16,
    height: Dimensions.get("window").width / 16,
};
