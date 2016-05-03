class Thing {
    constructor(options){
        this._options = options;
        this._options.id = this.makeid(5);
    }
    get options() {
        return this._options;
    }
    
    makeid(num)
    {
        // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < num; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}

class Workshop extends Thing {
    constructor(options) {
        super(options);
    }

    do(method,value) {
        let action = {
            "savepicks": () => {
                value.forEach( val => {
                    this._options[Object.keys(val)[0]] = val[Object.keys(val)[0]];
                })
            }
        }[method];

        action();
    }
    
    get parts() {
        return Object.keys(this._options).filter(key => {
            return (
                    ["name","min","max","id"].indexOf(key) === -1 &&
                    Array.isArray(this._options[key])
                    )
        });
    }
    
    findFreeSpace(participant,available) {
        let found = false;
        
        available.forEach(part => {
            if (found)
                return;

            if (this._options[part] !== undefined && this._options[part].length < this._options.max){
                this._options[part].push(participant);
                found = part;
            }
        });
        return found;
    }
    
    hasMinimum(part) {
        return (this._options[part].length >= this._options.min);
    }
    
    removePart(part) {
        delete this._options[part];
    }

    removePicks() {
        this.parts.forEach(current => {
            this._options[current].length = 0;
        });
    }
}

class Participant extends Thing {
    constructor(options) {
        super(options);

        if (options.parts === undefined)
            options.parts = options.available;

        this._options.available =  options.parts.map(part => {
            return part;
        });
        delete this._options.parts;
    }
    
    do(method,value) {
        let action = {
            "savepicks": () => {
                console.log("doing");
                this._options.picks = value[0];
            }
        }[method];

        action();
    }
    
    createTempPicks() {
        this._options.tempPicks = this._options.picks.slice();

        if (this._options.allocated !== undefined){
            this._options.tempPicks = this._options.tempPicks.filter(pick => {
               return this._options.allocated.indexOf(pick) === -1;
            });
        }
    }
    
    reset() {
        this._options.allocated.length = 0;
        this._options.available = ["Dagdeel 1", "Dagdeel 2"];
    }
    
    get picks() {
        return this._options.picks;
    }

    get tempPicks() {
        return this._options.tempPicks;
    }
}
