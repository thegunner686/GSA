export default class LocalStore {
    constructor() {
        this._model = {};
    }

    take(key, data) {
        console.log("calling: " + key);
        if(data) this._model[key](data);
        else this._model[key]();
    }

    give(key, fn) {
        console.log("setting: " + key);
        this._model[key] = fn;
    }
}