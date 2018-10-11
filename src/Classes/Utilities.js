export function elementExistsInArray(elem, arr, key) {
    let found = false;
    arr.map((obj) => {
        if(elem[key] == obj[key]) {
            found = true;
        }
    });
    return found;
}

export function genUniqueId() {
    let k = "k-" + Math.floor(Math.random() * 999999999) + "-" + Math.floor(Math.random() * 999999) + "-" + Math.floor(Math.random() * 999);
    return k;
}