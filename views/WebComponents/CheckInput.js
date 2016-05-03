class CheckInput extends HTMLElement {
    // Fires when an instance of the element is created.
    createdCallback() {

    };

    // Fires when an instance was inserted into the document.
    attachedCallback() {
        if (this._value !== false)
            this.innerHTML = "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span>";

        this.addEventListener("click", () => {

            if (this._value !== false) {
                this._value = false;
                this.innerHTML = "";
            } else {
                this._value = [];
                this.innerHTML = "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span>";
            }
            console.log(this._value);
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