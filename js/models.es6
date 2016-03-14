class Thing {
    constructor(_options){
        this.options = _options;
    }
    get(key) {
        return this.options[key];
    }
}

class Workshop extends Thing {

}
