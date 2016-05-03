'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = function () {
    function View() {
        var _this = this;

        _classCallCheck(this, View);

        this._lists = {
            'participants': 'participantlist',
            'workshops': 'workshoplist'
        };

        this._events = {
            "pa_add": { "element": document.getElementById("pa_add_btn"),
                "event": "click",
                "action": function action() {
                    return {
                        "name": document.getElementById("pa_name").value,
                        "parts": _this.getCheckboxes()
                    };
                } },
            "ws_add": { "element": document.getElementById("ws_add_btn"),
                "event": "click",
                "action": function action() {

                    return {
                        "name": document.getElementById("ws_name").value,
                        "min": document.getElementById("ws_min").value,
                        "max": document.getElementById("ws_max").value,
                        "parts": _this.getCheckboxes()
                    };
                } },
            "ws_filter": { "element": document.getElementById("ws_filter_btn"),
                "event": "click",
                "action": function action() {
                    return document.getElementById("ws_filter_nr").value;
                } },
            "modal": { "element": document,
                "event": "modal",
                "action": function action(e) {
                    console.log(e.detail);
                    return e.detail;
                } },
            "remove": { "element": document,
                "event": "remove",
                "action": function action(e) {
                    return e.detail;
                } },
            "save": { "element": document,
                "event": "save",
                "action": function action(e) {
                    return e.detail;
                } },
            "process": { "element": document.getElementById("ws_process_btn"),
                "event": "click",
                "action": function action(e) {} }
        };

        document.getElementById("popupclose").addEventListener("click", function () {
            document.getElementById("popup").classList.add("hidden");
        });

        var panelHeaders = document.getElementsByClassName("panel-heading");

        var _loop = function _loop(i) {
            panelHeaders[i].addEventListener("click", function () {
                var panel = document.getElementById(panelHeaders[i].dataset.toggle);
                if (panel.classList.contains("closed")) {
                    panel.classList.remove("closed");
                } else {
                    panel.classList.add("closed");
                }
            });
        };

        for (var i = 0; i < panelHeaders.length; i++) {
            _loop(i);
        }
    }

    _createClass(View, [{
        key: 'subscribe',
        value: function subscribe(which, callback) {
            var el = this._events[which];
            el.element.addEventListener(el.event, function (e) {
                callback(el.action(e));
            });
        }
    }, {
        key: 'updateList',
        value: function updateList(which, list) {
            if (list.length === 0) return;

            var el = document.getElementById(this._lists[which]).getElementsByTagName("tbody")[0];

            el.innerHTML = "";

            list.forEach(function (item) {

                var props = Object.keys(item.options);

                var tr = document.createElement("tr");

                if (item.options.id !== undefined) {
                    (function () {
                        var id = item.options.id;
                        tr.id = id;
                        tr.addEventListener("click", function () {
                            document.dispatchEvent(new CustomEvent("modal", {
                                "detail": { "which": which, "id": id }
                            }));
                        });
                    })();
                }

                props.forEach(function (prop) {
                    if (prop === "id") return;

                    var td = document.createElement("td");

                    var html = item.options[prop];
                    if (html === true || Array.isArray(html)) html = '<span class="glyphicon glyphicon-ok"></span>';
                    if (html === false || html === undefined) html = '';

                    td.innerHTML = html;
                    tr.appendChild(td);
                });
                el.appendChild(tr);
            });
        }
    }, {
        key: 'updateTable',
        value: function updateTable(list) {
            var _this2 = this;

            var tbody = document.getElementById("pickedTable").getElementsByTagName("tbody")[0];

            tbody.innerHTML = "";

            document.getElementById("noMatchTable").getElementsByTagName("tbody")[0].innerHTML = "";

            list.forEach(function (item) {
                item.parts.forEach(function (part) {
                    var tr = document.createElement("tr");

                    var td1 = document.createElement("td");
                    _this2.makeInfo("workshops", [item], td1, part);
                    tr.appendChild(td1);

                    var td2 = document.createElement("td");
                    td2.innerHTML = item.options[part].length;
                    tr.appendChild(td2);

                    var td3 = document.createElement("td");
                    _this2.makeInfo("participants", item.options[part], td3);
                    tr.appendChild(td3);

                    if (item.options[part].length < item.options.min) tr.classList.add("danger");

                    tbody.appendChild(tr);
                });
            });

            document.getElementById("ws_filter_btn").disabled = false;
        }
    }, {
        key: 'makeInfo',
        value: function makeInfo(which, array, element) {
            var appendText = arguments.length <= 3 || arguments[3] === undefined ? "" : arguments[3];


            if (array.length == 0) return;

            array.forEach(function (current, index) {
                var span = document.createElement("span");
                span.addEventListener("click", function () {
                    console.log("click", current);
                    document.dispatchEvent(new CustomEvent("modal", {
                        "detail": { "which": which, "id": current._options.id }
                    }));
                });
                span.innerHTML = current._options.name + " " + appendText;

                element.appendChild(span);

                if (index !== array.length - 1) element.appendChild(document.createTextNode(", "));
            });
        }
    }, {
        key: 'noMatch',
        value: function noMatch(name, part, picks) {
            var tbody = document.getElementById("noMatchTable").getElementsByTagName("tbody")[0];

            var tr = document.createElement("tr");
            tr.innerHTML = "<td>" + name + "</td><td>" + part + "</td><td>" + picks.toString().replace(/\,/g, ", ") + "</td>";
            tbody.appendChild(tr);
        }
    }, {
        key: 'showAlert',
        value: function showAlert(status) {
            var alert = document.getElementById("alert");
            alert.classList.remove("hidden");
            var newAlert = alert.cloneNode(true);
            newAlert.innerHTML = {
                'success': '<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Veranderingen opgeslagen'
            }[status];
            alert.parentNode.replaceChild(newAlert, alert);
        }
    }, {
        key: 'showModal',
        value: function showModal(contents) {
            var popup = document.getElementById("popup");
            var popupContents = document.getElementById("popupcontents");
            var popupTitle = document.getElementById("popuptitle");

            popup.classList.remove("hidden");
            popupTitle.innerHTML = contents.item.name;
            popupContents.innerHTML = "";
            this.loadTemplate(contents).then(function (data) {
                return popupContents.appendChild(data);
            }).catch(function (err) {
                return console.error(err);
            });

            document.getElementById("popupbuttonremove").onclick = function () {
                popup.classList.add("hidden");
                document.dispatchEvent(new CustomEvent("remove", {
                    "detail": { "which": contents.which, "id": contents.item.id }
                }));
            };
        }
    }, {
        key: 'loadTemplate',
        value: function loadTemplate(contents) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var req = new XMLHttpRequest();
                req.open('GET', 'views/modal_' + contents.which + '.html', true);
                req.send();

                req.onload = function () {
                    if (req.status >= 200 && req.status < 300) {
                        resolve(_this3.parseTemplate(req.response, contents));
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
        key: 'parseTemplate',
        value: function parseTemplate(html, contents) {
            var customElements = [['array-list', ArrayList], ['save-button', SaveButton], ['text-input', TextInput], ['check-input', CheckInput]];

            customElements.forEach(function (x) {
                if (document.createElement(x[0]).constructor === HTMLElement) {
                    var list = document.registerElement(x[0], x[1]);
                }
            });

            var span = document.createElement("span");
            span.innerHTML = html;

            var els = span.getElementsByTagName('array-list');
            for (var i = 0; i < els.length; i++) {
                els[i].item = contents.item;
                els[i].array = contents[els[i].attr];
            }
            els = span.getElementsByTagName('save-button');
            for (var _i = 0; _i < els.length; _i++) {
                els[_i].id = contents.item.id;
            }
            els = span.getElementsByTagName('text-input');
            for (var _i2 = 0; _i2 < els.length; _i2++) {
                els[_i2].val = contents.item[els[_i2].for];
            }
            els = span.getElementsByTagName('check-input');
            for (var _i3 = 0; _i3 < els.length; _i3++) {
                els[_i3].val = contents.item[els[_i3].for];
            }

            return span;
        }
    }, {
        key: 'getCheckboxes',
        value: function getCheckboxes() {
            return [].slice.call(document.getElementsByName("parts")).map(function (el) {
                return {
                    "partName": el.parentNode.getElementsByTagName('span')[0].innerHTML,
                    "checked": el.checked
                };
            });
        }
    }]);

    return View;
}();