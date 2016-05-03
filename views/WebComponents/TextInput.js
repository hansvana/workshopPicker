class TextInput extends HTMLElement {
    // Fires when an instance of the element is created.
    createdCallback() {
    };

    // Fires when an instance was inserted into the document.
    attachedCallback() {
        this.innerHTML = this._value;

        this.addEventListener("keyup", ()=> {
            this._value = this.innerHTML;
        })
    };

    // Fires when an instance was removed from the document.
    detachedCallback() {};

    // Fires when an attribute was added, removed, or updated.
    attributeChangedCallback(attr, oldVal, newVal) {};

    get for() {
        return this.attributes["for"].value;
    }

    set val(value) {
        this._value = value;
    }

    get saveValues() {
        return {[this.attributes["for"].value]: this._value};
    }
}