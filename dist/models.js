"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Thing = function () {
    function Thing(options) {
        _classCallCheck(this, Thing);

        this._options = options;
        this._options.id = this.makeid(5);
    }

    _createClass(Thing, [{
        key: "makeid",
        value: function makeid(num) {
            // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < num; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }return text;
        }
    }, {
        key: "options",
        get: function get() {
            return this._options;
        }
    }]);

    return Thing;
}();

var Workshop = function (_Thing) {
    _inherits(Workshop, _Thing);

    function Workshop(options) {
        _classCallCheck(this, Workshop);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Workshop).call(this, options));
    }

    _createClass(Workshop, [{
        key: "do",
        value: function _do(method, value) {
            var _this2 = this;

            var action = {
                "savepicks": function savepicks() {
                    value.forEach(function (val) {
                        _this2._options[Object.keys(val)[0]] = val[Object.keys(val)[0]];
                    });
                }
            }[method];

            action();
        }
    }, {
        key: "findFreeSpace",
        value: function findFreeSpace(participant, available) {
            var _this3 = this;

            var found = false;

            available.forEach(function (part) {
                if (found) return;

                if (_this3._options[part] !== undefined && _this3._options[part].length < _this3._options.max) {
                    _this3._options[part].push(participant);
                    found = part;
                }
            });
            return found;
        }
    }, {
        key: "hasMinimum",
        value: function hasMinimum(part) {
            return this._options[part].length >= this._options.min;
        }
    }, {
        key: "removePart",
        value: function removePart(part) {
            delete this._options[part];
        }
    }, {
        key: "removePicks",
        value: function removePicks() {
            var _this4 = this;

            this.parts.forEach(function (current) {
                _this4._options[current].length = 0;
            });
        }
    }, {
        key: "parts",
        get: function get() {
            var _this5 = this;

            return Object.keys(this._options).filter(function (key) {
                return ["name", "min", "max", "id"].indexOf(key) === -1 && Array.isArray(_this5._options[key]);
            });
        }
    }]);

    return Workshop;
}(Thing);

var Participant = function (_Thing2) {
    _inherits(Participant, _Thing2);

    function Participant(options) {
        _classCallCheck(this, Participant);

        var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(Participant).call(this, options));

        if (options.parts === undefined) options.parts = options.available;

        _this6._options.available = options.parts.map(function (part) {
            return part;
        });

        _this6._options.available.forEach(function (x) {
            if (_this6._options["forced " + x] === undefined) _this6._options["forced " + x] = "";
        });

        delete _this6._options.parts;
        return _this6;
    }

    _createClass(Participant, [{
        key: "do",
        value: function _do(method, value) {
            var _this7 = this;

            var action = {
                "savepicks": function savepicks() {
                    console.log(value);
                    _this7._options.picks = value[0];
                    for (var i = 1; i < value.length; i++) {
                        console.log(Object.keys(value[i])[0]);
                        _this7._options[Object.keys(value[i])[0]] = value[i][Object.keys(value[i])[0]];
                    }
                }
            }[method];

            action();
        }
    }, {
        key: "createTempPicks",
        value: function createTempPicks() {
            var _this8 = this;

            this._options.tempPicks = this._options.picks.slice();

            if (this._options.allocated !== undefined) {
                this._options.tempPicks = this._options.tempPicks.filter(function (pick) {
                    return _this8._options.allocated.indexOf(pick) === -1;
                });
            }
        }
    }, {
        key: "reset",
        value: function reset() {
            this._options.allocated.length = 0;
            this._options.available = ["Dagdeel 1", "Dagdeel 2"];
        }
    }, {
        key: "picks",
        get: function get() {
            return this._options.picks;
        }
    }, {
        key: "tempPicks",
        get: function get() {
            return this._options.tempPicks;
        }
    }]);

    return Participant;
}(Thing);