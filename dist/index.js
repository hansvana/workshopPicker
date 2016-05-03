'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Engine = function () {
    function Engine(view) {
        var _this = this;

        _classCallCheck(this, Engine);

        this._view = view;
        this._view.subscribe('pa_add', function (data) {
            return _this.add("participants", _this._participants, Participant, data);
        });
        this._view.subscribe('ws_add', function (data) {
            return _this.addWorkshop(data);
        });
        this._view.subscribe('modal', function (data) {
            return _this.findData(data, function (result) {
                _this.showModal(result);
            });
        });
        this._view.subscribe('remove', function (data) {
            return _this.findData(data, function (result) {
                _this.remove(result);
            });
        });
        this._view.subscribe('save', function (data) {
            return _this.findData(data, function (result) {
                _this.save(result);
            });
        });
        this._view.subscribe('ws_filter', function (data) {
            return _this.filterWorkshops(data);
        });
        this._view.subscribe('process', function () {
            _this.process();
        });

        this._workshops = [];
        this._participants = [];

        this._hasProcessed = false;

        this.load('participants', this._participants, Participant);
        this.load('workshops', this._workshops, Workshop);
    }

    _createClass(Engine, [{
        key: 'process',
        value: function process() {
            var _this2 = this;

            this._hasProcessed = true;

            this._participants.forEach(function (participant) {
                _this2.checkForced(participant);
                participant.createTempPicks();
                _this2.findBestMatch(participant);
            });
            //this._workshops.forEach(workshop => {
            //    this.checkMin(workshop);
            //});
            this._view.updateTable(this._workshops);
        }
    }, {
        key: 'checkForced',
        value: function checkForced(participant) {
            var _this3 = this;

            Object.keys(participant.options).forEach(function (current) {
                if (participant.options[current] == "") return;

                var part = /forced\s(.*)$/.exec(current);

                if (part === null) return;

                _this3.findData({ "which": "workshops",
                    "name": participant.options[current] }, function (workshop) {
                    if (workshop === undefined) return;

                    workshop.item.options[part[1]].push(participant);
                    participant.options.available = participant.options.available.filter(function (x) {
                        return x !== part[1];
                    });
                    if (participant.options.allocated === undefined) participant.options.allocated = [];

                    participant.options.allocated.push(workshop.item.options.name);
                });
            });
        }
    }, {
        key: 'findBestMatch',
        value: function findBestMatch(participant) {
            if (participant.tempPicks.length >= 1 && participant.options.available.length > 0) this.findData({ "which": "workshops",
                "name": participant.tempPicks[0] }, function (workshop) {
                var found = workshop.item.findFreeSpace(participant, participant.options.available);
                if (found !== false) {
                    participant.options.available = participant.options.available.filter(function (x) {
                        return x !== found;
                    });
                    if (participant.options.allocated === undefined) participant.options.allocated = [];

                    participant.options.allocated.push(workshop.item.options.name);
                }
                participant.options.tempPicks.splice(0, 1);
            });

            if (participant.options.available.length < 1) {
                //console.log("all matches found for:" + participant.options.name);
                return;
            } else if (participant.tempPicks.length < 1) {
                this._view.noMatch(participant.options.name, participant.options.available, participant.options.picks);
                console.log("could not find match for: " + participant.options.name);
            } else {
                this.findBestMatch(participant);
            }
        }
    }, {
        key: 'filterWorkshops',
        value: function filterWorkshops(lessThan) {
            lessThan = parseInt(lessThan);

            this._workshops.forEach(function (workshop) {
                workshop.parts.forEach(function (part) {
                    console.log(workshop, part);
                    if (workshop.options[part].length < lessThan && workshop.options[part].length < workshop.options.min) workshop.options[part] = false;
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

    }, {
        key: 'load',
        value: function load(which, arr, obj) {
            var _this4 = this;

            this.request(which, 'GET').then(function (data) {
                data.items.map(function (p) {
                    var params = {};
                    Object.keys(p._options).forEach(function (key) {
                        params[key] = p._options[key];
                    });
                    params.id = params.id !== undefined ? params.id : _this4.makeid(5);
                    return new obj(params);
                }).forEach(function (a) {
                    arr.push(a);
                });

                _this4._view.updateList(which, arr);
            });
        }
    }, {
        key: 'update',
        value: function update(which, arr) {
            var _this5 = this;

            if (this._hasProcessed) {
                this._workshops.forEach(function (current) {
                    current.removePicks();
                });
                this._participants.forEach(function (current) {
                    current.reset();
                });
            }

            this.request(which, 'POST', { "items": arr }).then(function (data) {
                _this5._view.showAlert(data.status);

                if (_this5._hasProcessed) _this5.process();

                _this5._view.updateList(which, arr);
            });
        }
    }, {
        key: 'add',
        value: function add(which, arr, obj, options) {
            arr.push(new obj(options));

            arr.sort(function (a, b) {
                return a.options.name > b.options.name ? 1 : -1;
            });
            this.update(which, arr);
        }
    }, {
        key: 'addWorkshop',
        value: function addWorkshop(options) {
            var params = {
                "name": options.name,
                "min": options.min,
                "max": options.max,
                "id": this.makeid(5)
            };

            options.parts.forEach(function (part) {
                if (part.checked) {
                    params[part.partName] = [];
                } else {
                    params[part.partName] = false;
                }
            });

            this._workshops.unshift(new Workshop(params));
            this.update("workshops", this._workshops);
        }
    }, {
        key: 'findData',
        value: function findData(data, callback) {
            var arr = {
                "participants": this._participants,
                "workshops": this._workshops
            }[data.which];

            var itm = null,
                index = null;

            if (data.id !== undefined) {
                index = arr.findIndex(function (x) {
                    return x.options.id === data.id;
                });
                itm = arr[index];
            } else if (data.name !== undefined) {
                index = arr.findIndex(function (x) {
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
    }, {
        key: 'showModal',
        value: function showModal(data) {
            console.log(data);
            this._view.showModal({
                "item": data.item.options,
                "which": data.data.which,
                "participants": this._participants,
                "workshops": this._workshops
            });
        }
    }, {
        key: 'remove',
        value: function remove(data) {
            data.parentArray.splice(data.index, 1);
            this.update(data.data.which, data.parentArray);
        }
    }, {
        key: 'save',
        value: function save(data) {
            data.item.do(data.data.method, data.data.value);
            this.update(data.data.which, data.parentArray);
        }
    }, {
        key: 'request',
        value: function request(action, method) {
            var data = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];


            return new Promise(function (resolve, reject) {
                var req = new XMLHttpRequest();
                req.open(method, 'http://127.0.0.1:3000/' + action, true);
                req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                req.send(method === 'POST' ? JSON.stringify(data) : "");

                req.onload = function () {
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
    }]);

    return Engine;
}();

window.addEventListener("load", function () {
    new Engine(new View());
});