'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = function () {
    function View() {
        _classCallCheck(this, View);

        this._lists = {
            'participants': 'participantlist',
            'workshops': 'workshoplist'
        };

        this._events = {
            "pa_add": { "element": "pa_add_btn",
                "event": "click",
                "action": function action() {
                    return document.getElementById("pa_name").value;
                } },
            "ws_add": { "element": "ws_add_btn",
                "event": "click",
                "action": function action() {

                    var checkboxes = [].slice.call(document.getElementsByName("parts")).map(function (el) {
                        return { "partName": el.parentNode.getElementsByTagName('span')[0].innerHTML,
                            "checked": el.checked };
                    });

                    return {
                        "name": document.getElementById("ws_name").value,
                        "min": document.getElementById("ws_min").value,
                        "max": document.getElementById("ws_max").value,
                        "parts": checkboxes
                    };
                } }
        };

        document.getElementById("popupclose").addEventListener("click", function () {
            document.getElementById("popup").classList.add("hidden");
        });
    }

    _createClass(View, [{
        key: 'subscribe',
        value: function subscribe(which, callback) {

            var e = this._events[which];
            document.getElementById(e.element).addEventListener(e.event, function () {
                callback(e.action());
            });
        }
    }, {
        key: 'updateList',
        value: function updateList(which, list, props) {
            if (list.length === 0) return;

            var el = document.getElementById(this._lists[which]).getElementsByTagName("tbody")[0];

            el.innerHTML = "";

            if (props === undefined) {
                props = Object.keys(list[0].option);
                console.log(props);
            }

            list.forEach(function (item) {
                var tr = document.createElement("tr");

                if (item.option.id !== undefined) {
                    (function () {
                        var id = item.option.id;
                        tr.id = id;
                        tr.addEventListener("click", function () {
                            alert(which + " " + id);
                        });
                    })();
                }

                props.forEach(function (prop) {
                    if (prop === "id") return;

                    var td = document.createElement("td");

                    var html = item.option[prop];
                    if (html === true) html = '<span class="glyphicon glyphicon-ok"></span>';
                    if (html === false) html = '';

                    td.innerHTML = html;
                    tr.appendChild(td);
                });
                el.appendChild(tr);
            });
        }
    }, {
        key: 'showAlert',
        value: function showAlert(status) {
            var alert = document.getElementById("alert");
            alert.classList.remove("hidden");
            if (status === "success") {
                var newAlert = alert.cloneNode(true);
                newAlert.innerHTML = '<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>Veranderingen opgeslagen';
                alert.parentNode.replaceChild(newAlert, alert);
            }
        }
    }]);

    return View;
}();