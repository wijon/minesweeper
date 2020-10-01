"use strict";

class Cell {
    constructor(id) {
        this.id = id;
        this.value = 0;
    }

    getDisplayValue() {
        return this.value > 0 ? this.value : "";
    }

    getStyle() {
        let g = 0;
        let b = 0;

        switch (this.value) {
            case 0:
                b = 255;
                g = 255;
                break;
            case 2:
                g = 220;
                break;
            case 4:
                g = 200;
                break;
            case 8:
                g = 180;
                break;
            case 16:
                g = 160;
                break;
            case 32:
                g = 140;
                break;
            case 64:
                g = 120;
                break;
            case 128:
                g = 100;
                break;
            case 256:
                g = 80;
                break;
            case 512:
                g = 60;
                break;
            case 1024:
                g = 40;
                break;
            case 2048:
                g = 20;
                break;

        }

        return {
            backgroundColor: `rgb(255, ${g}, ${b})`
        };
    }
}