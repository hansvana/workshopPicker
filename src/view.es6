class View {
    constructor() {
        
        this._lists = {
            'participants': 'participantlist',
            'workshops': 'workshoplist'
        };

        this._events = {
            "pa_add": {"element": document.getElementById("pa_add_btn"),
                        "event": "click",
                        "action": () => {
                            return {
                                "name": document.getElementById("pa_name").value,
                                "parts": this.getCheckboxes()
                            }
                        }},
            "ws_add": {"element": document.getElementById("ws_add_btn"),
                        "event": "click",
                        "action": () => {

                            return {
                                "name": document.getElementById("ws_name").value,
                                "min": document.getElementById("ws_min").value,
                                "max": document.getElementById("ws_max").value,
                                "parts": this.getCheckboxes()
                            }
                        }},
            "ws_filter": {"element": document.getElementById("ws_filter_btn"),
                        "event": "click",
                        "action": () => {
                            return document.getElementById("ws_filter_nr").value;
                        }},
            "modal": {  "element": document,
                        "event": "modal",
                        "action": e => {
                            console.log(e.detail);
                            return e.detail;
                        }},
            "remove": {  "element": document,
                        "event": "remove",
                        "action": e => {
                            return e.detail;
                        }},
            "save": {   "element": document,
                        "event": "save",
                        "action": e => {
                            return e.detail;
                        }},
            "process":  {"element": document.getElementById("ws_process_btn"),
                        "event": "click",
                        "action": e => {
                        }}
        };

        document.getElementById("popupclose").addEventListener("click", () => {
            document.getElementById("popup").classList.add("hidden");
        });

        let panelHeaders = document.getElementsByClassName("panel-heading");
        for (let i = 0; i < panelHeaders.length; i++){
            panelHeaders[i].addEventListener("click",() => {
                let panel = document.getElementById(panelHeaders[i].dataset.toggle);
                if (panel.classList.contains("closed")){
                    panel.classList.remove("closed");
                } else {
                    panel.classList.add("closed");
                }
            })
        }
    };            
    
    subscribe(which, callback){
        let el = this._events[which];
        el.element.addEventListener(el.event, (e) => {
            callback(el.action(e));
        });
    }

    updateList(which, list){
        if (list.length === 0)
            return;

        let el = document
            .getElementById(this._lists[which])
            .getElementsByTagName("tbody")[0];  

        el.innerHTML = "";

        list.forEach( item => {

            let props = Object.keys(item.options);

            let tr = document.createElement("tr");

            if (item.options.id !== undefined) {
                let id = item.options.id;
                tr.id = id;
                tr.addEventListener("click", ()=> {
                    document.dispatchEvent(
                        new CustomEvent("modal", {
                            "detail" : {"which": which, "id": id}
                        })
                    );
                });
            }

            props.forEach((prop) => {
                if (prop === "id")
                    return;

                let td = document.createElement("td");

                let html = item.options[prop];
                if (html === true || Array.isArray(html))
                    html = '<span class="glyphicon glyphicon-ok"></span>';
                if (html === false || html === undefined)
                    html = '';

                td.innerHTML = html;
                tr.appendChild(td);
            });
            el.appendChild(tr);
        });
    }

    updateTable(list) {

        let tbody = document.getElementById("pickedTable")
                            .getElementsByTagName("tbody")[0];

        tbody.innerHTML = "";

        document.getElementById("noMatchTable").getElementsByTagName("tbody")[0].innerHTML = "";

        list.forEach(item => {
            item.parts.forEach(part => {
                let tr = document.createElement("tr");

                let td1 = document.createElement("td");
                this.makeInfo("workshops",[item],td1,part);
                tr.appendChild(td1);

                let td2 = document.createElement("td");
                td2.innerHTML = item.options[part].length;
                tr.appendChild(td2);

                let td3 = document.createElement("td");
                this.makeInfo("participants",item.options[part],td3);
                tr.appendChild(td3);

                if (item.options[part].length < item.options.min)
                    tr.classList.add("danger");

                tbody.appendChild(tr);
            });
        });

        document.getElementById("ws_filter_btn").disabled = false;
    }

    makeInfo(which,array,element,appendText = "") {

        if (array.length == 0)
            return;

        array.forEach((current, index) => {
            let span = document.createElement("span");
            span.addEventListener("click", ()=> {
                console.log("click", current);
                document.dispatchEvent(
                    new CustomEvent("modal", {
                        "detail" : {"which": which, "id": current._options.id}
                    })
                );
            });
            span.innerHTML = current._options.name + " " + appendText;

            element.appendChild(span);

            if (index !== array.length-1)
                element.appendChild(document.createTextNode(", "));
        });
    }

    noMatch(name, part, picks) {
        let tbody = document.getElementById("noMatchTable")
            .getElementsByTagName("tbody")[0];

        let tr = document.createElement("tr");
        tr.innerHTML = "<td>" + name + "</td><td>" + part + "</td><td>" + picks.toString().replace(/\,/g, ", ") + "</td>";
        tbody.appendChild(tr);
    }

    showAlert(status) {
        let alert = document.getElementById("alert");
        alert.classList.remove("hidden");
        let newAlert = alert.cloneNode(true);
        newAlert.innerHTML = {
            'success': '<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Veranderingen opgeslagen'
        }[status];
        alert.parentNode.replaceChild(newAlert,alert);
    }

    showModal(contents) {
        let popup = document.getElementById("popup");
        let popupContents = document.getElementById("popupcontents");
        let popupTitle = document.getElementById("popuptitle");

        popup.classList.remove("hidden");
        popupTitle.innerHTML = contents.item.name;
        popupContents.innerHTML = "";
        this.loadTemplate(contents)
            .then(data => popupContents.appendChild(data))
            .catch(err => console.error(err));

        document.getElementById("popupbuttonremove").onclick = ()=>{
            popup.classList.add("hidden");
            document.dispatchEvent(
                new CustomEvent("remove", {
                    "detail" : {"which": contents.which, "id": contents.item.id}
                })
            )
        }

    }
    
    loadTemplate(contents) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', 'views/modal_'+contents.which+'.html', true);
            req.send();

            req.onload = () => {
                if (req.status >= 200 && req.status < 300) {
                    resolve(this.parseTemplate(req.response,contents));
                } else {
                    reject(req.statusText);
                }
            };
            req.onerror = function () {
                reject(this.statusText);
            };
        });
    }

    parseTemplate(html, contents) {
        let customElements = [
            ['array-list', ArrayList],
            ['save-button', SaveButton],
            ['text-input', TextInput],
            ['check-input', CheckInput]
        ];

        customElements.forEach(x => {
            if (document.createElement(x[0]).constructor === HTMLElement) {
                let list = document.registerElement(x[0], x[1]);
            }
        });

        let span = document.createElement("span");
        span.innerHTML = html;

        let els = span.getElementsByTagName('array-list');
        for (let i = 0; i < els.length; i++){
            els[i].item = contents.item;
            els[i].array = contents[els[i].attr];
        }
        els = span.getElementsByTagName('save-button');
        for (let i = 0; i < els.length; i++){
            els[i].id = contents.item.id;
        }
        els = span.getElementsByTagName('text-input');
        for (let i = 0; i < els.length; i++){
            els[i].val = contents.item[els[i].for];
        }
        els = span.getElementsByTagName('check-input');
        for (let i = 0; i < els.length; i++){
            els[i].val = contents.item[els[i].for];
        }

        return span;
    }

    getCheckboxes() {
        return [].slice.call(document.getElementsByName("parts")).map(el => {
            return {
                "partName": el.parentNode.getElementsByTagName('span')[0].innerHTML,
                "checked": el.checked
            };
        });
    }
}