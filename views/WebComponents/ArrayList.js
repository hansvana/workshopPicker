class ArrayList extends HTMLElement {

    // Fires when an instance of the element is created.
    createdCallback() {
        this._picks = [];
    };

    // Fires when an instance was inserted into the document.
    attachedCallback() {
        if (this.item.picks !== undefined)
            this._picks = this.item.picks;

        let ul = document.createElement("ul");
        ul.className = "table-list";

        this._arr.forEach(x => {
            let li = document.createElement("li");
            li.className = "table-list-item";


            if (this.item.picks !== undefined && this.item.picks.some(y => {
                    return y === x.options.name
                })){
                li.classList.add("pick");
            }

            li.innerHTML = "<div>"+x.options.name+"</div>";
            ul.appendChild(li);

            li.addEventListener("click", () => {
                if (!li.classList.contains("pick")) {
                    if (this._picks.length < 3) {
                        li.classList.add("pick");
                        this._picks.push(x.options.name);
                    }
                } else {
                    let i = this._picks.findIndex(x => {
                        return x == li.innerText.trim();
                    });
                    this._picks.splice(i,1);
                    li.classList.remove("pick");
                }
            });
        });

        this.appendChild(ul);
    };

    // Fires when an instance was removed from the document.
    detachedCallback() {};

    // Fires when an attribute was added, removed, or updated.
    attributeChangedCallback(attr, oldVal, newVal) {
        console.log("\n\nAttr changed\n\n", attr);
    };

    set array(arr) {
        this._arr = arr;
    }

    get attr() {
        return this.attributes[0].value;
    }

    get saveValues() {
        return this._picks;
    }
}
