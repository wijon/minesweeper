"use strict";

class Cell {
    constructor(id) {
        this.id = id;
        this.value = 2;
    }

    getDisplayValue(){
        return this.value > 0 ? this.value : "";
    }

    getStyle() {
        return {
            backgroundColor: "rgb(255, 150, 0)"
        };
    }
}