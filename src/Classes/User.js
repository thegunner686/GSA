import firebase from "../Firebase";

export default class User {
    constructor(firebase_user, callback) {
        this.firebase_user = firebase_user;
        this.localValues = {};
        this.call_update = callback;

        this.initializeListeners();
    }

    initializeListeners() {
        let { uid } = this.firebase_user;
        firebase.database().ref("Users/" + uid).on("value", (snapshot) => {
            this.updateLocalValues(snapshot.val());
        }, (error) => {
            console.log(error);
        });
    }

    removeListeners() {
        let { uid } = this.firebase_user;
        firebase.database().ref("Users/" + uid).off();
    }

    update(meta) {
        let { uid } = this.firebase_user;
        firebase.database().ref("Users/" + uid).update({
            ...meta
        });
        this.updateLocalValues(meta);
    }

    updateLocalValues(val) {
        if(val == null) {
            this.localValues = {};
            this.call_update();
            return;
        }
        Object.keys(val).map((key) => {
            this.localValues[key] = val[key];
        });        
        this.call_update();
    }
    
    val() {
        return this.localValues;
    }

    user() {
        return this.firebase_user;
    }
}