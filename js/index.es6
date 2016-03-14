class Engine {
    constructor(){
        this.workshops = [];
        this.participants = [];

        ß.get('#ws_add').onclick = () => {
            let ws = new Workshop({
                "name": ß.get('#ws_name').value,
                "min": ß.get('#ws_min').value,
                "max": ß.get('#ws_max').value
            });

            this.workshops.push(ws);

            let node = ß.create("tr");
            node.innerHTML = '<td>'+ws.get("name")+'</td>'+
                '<td>'+ws.get("min")+'</td>'+
                '<td>'+ws.get("max")+'</td>'+
                '<td></td>';

            ß.get('tbody', ß.get('#workshoplist')).appendChild(node);
        };

    }
}

class Helpers {
    get(query, parent = document)
    {
        return parent.querySelector(query);
    }
    create(name) {
        return document.createElement(name);
    }
}
let ß = new Helpers();


window.addEventListener("load", () => {new Engine()});