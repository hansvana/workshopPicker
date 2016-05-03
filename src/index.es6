class Engine {
    constructor(view){
        this._view = view;
        this._view.subscribe('pa_add', data => this.add("participants",this._participants,Participant,data));
        this._view.subscribe('ws_add', data => this.addWorkshop(data));
        this._view.subscribe('modal', data => this.findData(data, result => {this.showModal(result)}));
        this._view.subscribe('remove', data => this.findData(data, result => {this.remove(result)}));
        this._view.subscribe('save', data => this.findData(data, result => {this.save(result)}));
        this._view.subscribe('ws_filter', data => this.filterWorkshops(data));
        this._view.subscribe('process', () => {this.process()});

        this._workshops = [];
        this._participants = [];

        this._hasProcessed = false;

        this.load('participants', this._participants, Participant);
        this.load('workshops', this._workshops, Workshop);
    }

    process() {
        this._hasProcessed = true;

        this._participants.forEach(participant => {
            participant.createTempPicks();
            this.findBestMatch(participant);
        });
        //this._workshops.forEach(workshop => {
        //    this.checkMin(workshop);
        //});
        this._view.updateTable(this._workshops);
    }

    findBestMatch(participant){
        if(participant.tempPicks.length >= 1 && participant.options.available.length > 0)
            this.findData(
                {"which": "workshops",
                "name": participant.tempPicks[0]},workshop => {
                    let found = workshop.item.findFreeSpace(participant,participant.options.available);
                    if (found !== false) {
                        participant.options.available = participant.options.available.filter(x => {
                            return x !== found;
                        });
                        if (participant.options.allocated === undefined)
                            participant.options.allocated = [];

                        participant.options.allocated.push(workshop.item.options.name);
                    }
                    participant.options.tempPicks.splice(0,1);
                });

        if (participant.options.available.length < 1) {
            //console.log("all matches found for:" + participant.options.name);
            return;
        } else if(participant.tempPicks.length < 1) {
            this._view.noMatch(participant.options.name,participant.options.available,participant.options.picks);
            console.log("could not find match for: " + participant.options.name);
        } else {
            this.findBestMatch(participant);
        }
    }

    filterWorkshops(lessThan){
        lessThan = parseInt(lessThan);

        this._workshops.forEach(workshop => {
           workshop.parts.forEach(part => {
               console.log(workshop,part);
               if (workshop.options[part].length < lessThan)
                   workshop.options[part] = false;
           });
        });

        this.update("workshops", this._workshops);
    }

    // checkMin(workshop){
    //     workshop.parts.forEach(part => {
    //         if (!workshop.hasMinimum(part)){
    //             // console.log(workshop.options.name + " " + part +
    //             //     " is below minimum of " +
    //             //     workshop.options.min +
    //             //         " with " + workshop.options[part].length
    //             // );
    //
    //             let participantsToRelocate = workshop.options[part];
    //             workshop.removePart(part);
    //
    //             participantsToRelocate.forEach(participant => {
    //
    //                 //console.log("relocating:", participant, "for", part);
    //                 this.findData({
    //                     "which": "participants",
    //                     "name": participant
    //                 }, data => {
    //                     data.item.options.allocated = data.item.options.allocated.filter(pick => {
    //                         return pick !== workshop.options.name
    //                     });
    //                     data.item.options.available.push(part);
    //                     data.item.createTempPicks();
    //                     this.findBestMatch(data.item);
    //                 })
    //             });
    //         }
    //     });
    // }

    load(which, arr, obj) {
        this.request(which, 'GET')
            .then( data => {
                data.items.map((p) => {
                    let params = {};
                    Object.keys(p._options).forEach(key => {
                        params[key] = p._options[key];
                    });
                    params.id = (params.id !== undefined ? params.id : this.makeid(5));
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

    update(which, arr) {
        if (this._hasProcessed) {
            this._workshops.forEach(current => {
                current.removePicks();
            });
            this._participants.forEach(current => {
                current.reset();
            });
        }

        this.request(which,
            'POST',
            {"items": arr})
            .then( data => {
                this._view.showAlert(data.status);

                if (this._hasProcessed) this.process();

                this._view.updateList(
                    which,
                    arr
                );
            });
    }
    
    add(which,arr,obj,options) {       
        arr.push(new obj(options));
        
        arr.sort((a,b)=>{
            return (a.options.name > b.options.name ? 1 : -1);
        });
        this.update(which, arr);
    }
    
    addWorkshop(options) {
        let params = {
            "name": options.name,
            "min": options.min,
            "max": options.max,
            "id": this.makeid(5)
        };
        
        options.parts.forEach(part => {
            if (part.checked) {
                params[part.partName] = [];
            } else {
                params[part.partName] = false;
            }
        });
        
        this._workshops.unshift(new Workshop(params));
        this.update("workshops",this._workshops);
    }

    findData(data, callback){
        let arr = {
            "participants": this._participants,
            "workshops": this._workshops
        }[data.which];

        let itm = null, index = null;

        if (data.id !== undefined) {
            index = arr.findIndex(x => {
                return x.options.id === data.id;
            });
            itm = arr[index];
        } else if (data.name !== undefined) {
            index = arr.findIndex(x => {
                return x.options.name === data.name;
            });
            itm = arr[index];
        }

        callback({
            "item": itm,
            "parentArray": arr,
            "index": index,
            "data": data
        });
    }

    showModal(data) {
        console.log(data);
        this._view.showModal({
            "item": data.item.options,
            "which": data.data.which,
            "participants": this._participants,
            "workshops": this._workshops
        });
    }

    remove(data) {
        data.parentArray.splice(data.index,1);
        this.update(data.data.which,data.parentArray);
    }

    save(data) {
        data.item.do(data.data.method,data.data.value);
        this.update(data.data.which,data.parentArray);
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
}

window.addEventListener("load", () => {
    new Engine(
        new View()
    )
});