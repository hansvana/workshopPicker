"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Thing = function () {
    function Thing(options) {
        _classCallCheck(this, Thing);

        this._options = options;
    }

    _createClass(Thing, [{
        key: "option",
        get: function get() {
            return this._options;
        }
    }]);

    return Thing;
}();

var Workshop = function (_Thing) {
    _inherits(Workshop, _Thing);

    function Workshop() {
        _classCallCheck(this, Workshop);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Workshop).apply(this, arguments));
    }

    return Workshop;
}(Thing);

var Participant = function (_Thing2) {
    _inherits(Participant, _Thing2);

    function Participant() {
        _classCallCheck(this, Participant);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Participant).apply(this, arguments));
    }

    return Participant;
}(Thing);