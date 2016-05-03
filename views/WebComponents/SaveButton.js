class SaveButton extends HTMLButtonElement {
    // Fires when an instance of the element is created.
    createdCallback() {};

    // Fires when an instance was inserted into the document.
    attachedCallback() {
        this.addEventListener("click", (e) => {
            let values = [];

            let nodeList = document.getElementById("popupcontents").getElementsByTagName('*');
            for (let i = 0; i < nodeList.length; i++){
                if (nodeList[i].saveValues !== undefined)
                    values.push(nodeList[i].saveValues)
            }

            document.dispatchEvent(
                new CustomEvent("save", {
                    "detail" : {
                        "which": this.attributes["target"].value,
                        "method": this.attributes["method"].value,
                        "id": this._id,
                        "value": values
                    }
                })
            );
            document.getElementById("popup").classList.add("hidden");

        })
    };

    // Fires when an instance was removed from the document.
    detachedCallback() {};

    // Fires when an attribute was added, removed, or updated.
    attributeChangedCallback(attr, oldVal, newVal) {};

    set id(id) {
        this._id = id;
    }
}
