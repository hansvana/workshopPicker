class View {
    constructor() {
    this._lists = {
        'participants': 'participantlist',
        'workshops': 'workshoplist'
    };

    this._events = {
        "pa_add": {"element": "pa_add_btn",
                    "event": "click",
                    "action": function() {
                        return document.getElementById("pa_name").value;
                    }},
        "ws_add": {"element": "ws_add_btn",
                    "event": "click",
                    "action": function() {

                        var checkboxes = [].slice.call(document.getElementsByName("parts")).map(el => {
                            return {"partName" : el.parentNode.getElementsByTagName('span')[0].innerHTML,
                                    "checked": el.checked};
                        });

                        return {
                            "name": document.getElementById("ws_name").value,
                            "min": document.getElementById("ws_min").value,
                            "max": document.getElementById("ws_max").value,
                            "parts": checkboxes
                        }
                    }}
        };

        document.getElementById("popupclose").addEventListener("click", () => {
            document.getElementById("popup").classList.add("hidden");
        });
    };            
    
    subscribe(which, callback){

        let e = this._events[which];
        document.getElementById(e.element).addEventListener(e.event, () => {
            callback(e.action());
        });

    }

    updateList(which, list, props){
        if (list.length === 0)
            return;

        let el = document
            .getElementById(this._lists[which])
            .getElementsByTagName("tbody")[0];

        el.innerHTML = "";

        if (props === undefined) {
            props = Object.keys(list[0].option);
            console.log(props);
        }

        list.forEach( item => {
            let tr = document.createElement("tr");

            if (item.option.id !== undefined) {
                let id = item.option.id;
                tr.id = id;
                tr.addEventListener("click", ()=> {
                    alert(which + " " + id)
                });
            }

            props.forEach((prop) => {
                if (prop === "id")
                    return;

                let td = document.createElement("td");

                let html = item.option[prop];
                if (html === true)
                    html = '<span class="glyphicon glyphicon-ok"></span>';
                if (html === false)
                    html = '';

                td.innerHTML = html;
                tr.appendChild(td);
            });
            el.appendChild(tr);
        });
    }

    showAlert(status) {
        let alert = document.getElementById("alert");
        alert.classList.remove("hidden");
        if (status === "success"){
            let newAlert = alert.cloneNode(true);
            newAlert.innerHTML = '<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>Veranderingen opgeslagen';
            alert.parentNode.replaceChild(newAlert,alert);
        }
    }
    
    
}