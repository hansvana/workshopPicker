class Engine {
    constructor(view){
        this._view = view;
        this._view.subscribe('pa_add', data => this.addParticipant(data));
        this._view.subscribe('ws_add', data => this.addWorkshop(data));
        this._view.subscribe('modal', data => this.findData(data));

        this._workshops = [];
        this._participants = [];

        this.get('participants', this._participants, Participant);
        this.get('workshops', this._workshops, Workshop);
    }

    get(which, arr, obj) {
        this.request(which, 'GET')
            .then( data => {
                data.items.map((p) => {
                    let params = {};
                    Object.keys(p._options).forEach(key => {
                        params[key] = p._options[key];
                    });
                    params.id = (params.id !== undefined ? params.id : this.makeid(5))
                    return new obj(params);
                }).forEach(a => {
                   arr.push(a);
                });

                this._view.updateList(
                    which,
                    arr
                );
            });
    }

    set(which, arr) {
        this.request(which,
            'POST',
            {"items": arr})
            .then( data => {
                this._view.showAlert(data.status);
                this._view.updateList(
                    which,
                    arr
                );
            });
    }

    addParticipant(name) {
        this._participants.unshift(new Participant({
            "name": name,
            "id": this.makeid(5)
        }));
        this.set('participants',this._participants);
    }
    
    addWorkshop(options) {
        let params = {
            "name": options.name,
            "min": options.min,
            "max": options.max,
            "id": this.makeid(5)
        };
        
        options.parts.forEach(part => {
            params[part.partName] = part.checked;
        });
        
        this._workshops.unshift(new Workshop(params));
        this.set("workshops",this._workshops);
    }

    request(action,method,data = "") {

        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open(method, 'http://127.0.0.1:3000/'+action, true);
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            req.send((method === 'POST'? JSON.stringify(data):""));

            req.onload = () => {
                if (req.status >= 200 && req.status < 300) {
                    resolve(JSON.parse(req.response));
                } else {
                    reject(req.statusText);
                }
            };
            req.onerror = function () {
                reject(this.statusText);
            };
        });
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

window.addEventListener("load", () => {
    new Engine(
        new View()
    )
});