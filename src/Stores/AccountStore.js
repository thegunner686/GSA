import { EventEmitter } from "events";
import dispatcher from "../Dispatcher";
import firebase from "../Firebase";

// classes
import User from "../Classes/User";
import {
    elementExistsInArray,
    genUniqueId
} from "../Classes/Utilities";

class AccountStore extends EventEmitter {
    constructor() {
        super();

        this.signInError = null;
        this.createAccountError = null;
        this.user = null;

        this.forumPosts = [];
        this.commentsForCurrentPost = [];
        this.latestPostUpdate = null;
        this.latestCommentUpdate = null;

        this.userName = null;

        this.signIn = this.signIn.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.userInformationUpdated = this.userInformationUpdated.bind(this);
        this.initializeListeners = this.initializeListeners.bind(this);
        this.postComment = this.postComment.bind(this);
    }

    initializeListeners() {
        firebase.database().ref("ForumPosts").on("child_added", (snapshot) => {
            this.addForumPost(snapshot.val());
        }, (error) => {
            console.log(error);
        });
        firebase.database().ref("ForumPosts").on("child_changed", (snapshot) => {
            this.updateForumPost(snapshot.val());
        }, (error) => {
            console.log(error);
        });
        firebase.database().ref("ForumPosts").on("child_removed", (snapshot) => {
            this.removeForumPost(snapshot.val());
        }, (error) => {
            console.log(error);
        });
    }

    clearListeners() {
        firebase.database().ref("ForumPosts").off();
    }

    addForumPost(obj) {
        if(this.forumPosts.length == 0 ||
            !elementExistsInArray(obj, this.forumPosts, "id")) {
            this.forumPosts.push(obj);
            this.latestPostUpdate = obj;
            this.emit("ForumPostAdded");
        }
    }

    updateForumPost(obj) {
        for(let i = this.forumPosts.length - 1; i >= 0; i--) {
            if(obj.id == this.forumPosts[i].id) {
                this.forumPosts[i] = obj;
                this.latestPostUpdate = obj;
                this.emit("ForumPostUpdated");
                return;
            }
        }
    }

    removeForumPost(obj) {
        for(let i = this.forumPosts.length - 1; i >= 0; i--) {
            if(obj.id == this.forumPosts[i].id) {
                this.latestPostUpdate = this.forumPosts.splice(i, 1)[0];
                console.log(this.latestForumPostUpdate);
                this.emit("ForumPostRemoved");
                return;
            }
        }
    }

    getLatestPostUpdate() {
        return this.latestPostUpdate;
    }

    createForumPost(content, meta) {
        let unique_key = firebase.database().ref("ForumPosts").push().key;

        let id = genUniqueId();

        let userRef = this.user.firebase_user.uid,
            userName = this.userName;
        
        firebase.database().ref("ForumPosts/" + unique_key).set({
            content,
            userRef,
            userName,
            time: Date.now(),
            ref: unique_key,
            id,
            ...meta,
        });

        firebase.database().ref("Users/" + userRef + "/Posts/" + unique_key).set(true);

        this.emit("ForumPostCreatedSuccess");
    }

    listenForCommentsOnPostWithRef(ref) {
        firebase.database().ref("Comments/" + ref).on("child_added", (snapshot) => {
            this.commentForPostAdded(snapshot.val());
        }, (error) => {
            console.log(error);
        });
        firebase.database().ref("Comments/" + ref).on("child_changed", (snapshot) => {
            this.commentForPostUpdated(snapshot.val());
        }, (error) => {
            console.log(error);
        });
        firebase.database().ref("Comments/" + ref).on("child_removed", (snapshot) => {
            this.commentForPostRemoved(snapshot.val());
        }, (error) => {
            console.log(error);
        });
    }

    removeListenerForCommentsOnPostWithRef(ref) {
        this.commentsForCurrentPost = [];
        
    }

    commentForPostAdded(comment) {
        if(this.commentsForCurrentPost.length == 0 ||
            !elementExistsInArray(comment, this.commentsForCurrentPost, "id")) {
            this.commentsForCurrentPost.push(comment);
            this.latestCommentUpdate = comment;
            this.emit("CommentAdded");
        }
    }

    commentForPostUpdated(comment) {
        for(let i = this.forumPosts.length - 1; i >= 0; i--) {
            if(obj.id == this.forumPosts[i].id) {
                this.forumPosts[i] = obj;
                this.latestPostUpdate = obj;
                this.emit("ForumPostUpdated");
                return;
            }
        }
    }

    commentForPostRemoved(comment) {

    }

    postComment(comment, post) {
        console.log(comment);
        return;
        firebase.database().ref("Comments/" + post.ref).push().set({
            comment,
            user: this.user.uid,
        });
    }

    getLatestCommentUpdate() {
        return this.latestCommentUpdate;
    }

    createAccount(username, password, meta) {
        let listener = firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                if(this.user) this.user.removeListeners();
                this.user = new User(user, this.userInformationUpdated);
                this.user.update(meta);
                this.createAccountError = null;
                this.initializeListeners();
                this.emit("CreateAccountSuccess");
                console.log("user created");
                listener();
            }
        });
        firebase.auth().createUserWithEmailAndPassword(username, password).catch((error) => {
            this.createAccountError = error;
            if(this.user) this.user.removeListeners();
            this.user = null;
            this.emit("CreateAccountError");
            listener();
        });
    }

    signIn(username, password) {
        firebase.auth().signInWithEmailAndPassword(username, password).then((user) => {
            this.signInError = null;
            if(this.user) this.user.removeListeners();
            this.user = new User(user, this.userInformationUpdated);
            this.initializeListeners();
            this.emit("SignInSuccess");
        }).catch((error) => {
            if(this.user) this.user.removeListeners();
            this.signInError = error;
            this.user = null;
            this.emit("SignInError");
        });
    }

    automaticSignIn(username, password) {
        firebase.auth().signInWithEmailAndPassword(username, password).then((user) => {
            if(this.user) this.user.removeListeners();
            this.user = new User(user, this.userInformationUpdated);
            this.initializeListeners();
            this.emit("AutomaticSignInSuccess");
        }).catch((error) => {
            console.log(error);
            this.emit("AutomaticSignInError");
        })
    }

    getSignInError() {
        return this.signInError;
    }

    getCreateAccountError() {
        return this.createAccountError;
    }

    userInformationUpdated() {
        this.userName = this.user.localValues.name ? this.user.localValues.name : "AnonymousMonkey" + Math.floor(Math.random() * 999999);
        this.emit("UserInformationUpdated");
    }

    handleActions(action) {
        switch(action.type) {
            case "SignIn":
                setTimeout(() => {
                    this.signIn(action.username, action.password);
                }, 0);
            break;
            case "AutomaticSignIn":
                setTimeout(() => {
                    this.automaticSignIn(action.username, action.password);
                }, 0);
            break;
            case "CreateAccount":
                setTimeout(() => {
                    this.createAccount(action.username, action.password, action.meta);
                }, 0);
            break;
            case "CreateForumPost":
                setTimeout(() => {
                    this.createForumPost(action.content, action.meta);
                }, 0);
            break;
            case "PostComment":
                setTimeout(() => {
                    this.postComment(action.comment, action.post);
                }, 0);
            break;
        }
    }
}

const accountStore = new AccountStore;
dispatcher.register(accountStore.handleActions.bind(accountStore));
export default accountStore;