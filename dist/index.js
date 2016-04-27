'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Engine = function () {
    function Engine(view) {
        var _this = this;

        _classCallCheck(this, Engine);

        this._view = view;
        this._view.subscribe('pa_add', function (data) {
            return _this.addParticipant(data);
        });
        this._view.subscribe('ws_add', function (data) {
            return _this.addWorkshop(data);
        });
        this._view.subscribe('modal', function (data) {
            return _this.findData(data);
        });

        this._workshops = [];
        this._participants = [];

        this.get('participants', this._participants, Participant);
        this.get('workshops', this._workshops, Workshop);
    }

    _createClass(Engine, [{
        key: 'get',
        value: function get(which, arr, obj) {
            var _this2 = this;

            this.request(which, 'GET').then(function (data) {
                data.items.map(function (p) {
                    var params = {};
                    Object.keys(p._options).forEach(function (key) {
                        params[key] = p._options[key];
                    });
                    params.id = params.id !== undefined ? params.id : _this2.makeid(5);
                    return new obj(params);
                }).forEach(function (a) {
                    arr.push(a);
                });

                _this2._view.updateList(which, arr);
            });
        }
    }, {
        key: 'set',
        value: function set(which, arr) {
            var _this3 = this;

            this.request(which, 'POST', { "items": arr }).then(function (data) {
                _this3._view.showAlert(data.status);
                _this3._view.updateList(which, arr);
            });
        }
    }, {
        key: 'addParticipant',
        value: function addParticipant(name) {
            this._participants.unshift(new Participant({
                "name": name,
                "id": this.makeid(5)
            }));
            this.set('participants', this._participants);
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
                params[part.partName] = part.checked;
            });

            this._workshops.unshift(new Workshop(params));
            this.set("workshops", this._workshops);
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
    }, {
        key: 'makeid',
        value: function makeid(num) {
            // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < num; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }return text;
        }
    }]);

    return Engine;
}();

window.addEventListener("load", function () {
    new Engine(new View());
});