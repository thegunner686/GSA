import dispatcher from "../Dispatcher";

export function SignIn(username, password) {
    dispatcher.dispatch({
        type: "SignIn",
        username,
        password,
    });
}

export function AutomaticSignIn(username, password) {
    dispatcher.dispatch({
        type: "AutomaticSignIn",
        username,
        password,
    });
}

export function CreateAccount(username, password, meta) {
    dispatcher.dispatch({
        type: "CreateAccount",
        username,
        password,
        meta
    });
}

export function CreateForumPost(content, meta) {
    dispatcher.dispatch({
        type: "CreateForumPost",
        content,
        meta,
    });
}

export function PostComment(comment, post) {
    dispatcher.dispatch({
        type: "PostComment",
        comment,
        post,
    });
}