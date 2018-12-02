"use strict";

class Field {
    constructor(x, y) {
        this.position = { x: x, y: y }
        this.hasMine = false;
        this.hasFlag = false;
        this.isExplored = false;
        this.nearByMineCounter = 0;
    }
}

class Board {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.fields = []
    }

    static create(height, width) {
        if (height < 1 || width < 1) {
            throw "The board must be at least 1x1";
        }

        let board = new Board(height, width);
        board.addFields();
        board.placeMines(2);

        return board;
    }

    addFields() {
        let fields = [];

        for (let i = 1; i <= this.width; i++) {
            for (let j = 1; j <= this.height; j++) {
                fields.push(new Field(i, j));
            }
        }

        this.fields = fields;
    }

    placeMines(mineCount) {
        if (typeof this.fields === 'undefined' || this.fields.length < 1) {
            throw "Board does not have any fields defined."
        }

        if (mineCount >= this.fields.length) {
            throw "At least one non mine field is required";
        }

        // Take random fields as mine fields
        let mineFields = this.fields.slice(0).sort(function (a, b) {
            if (Math.random() >= 0.5) {
                return -1;
            } else {
                return 1;
            }
        }).slice(0, mineCount);

        // Set the has mineFlag
        mineFields.forEach(function (field) { field.hasMine = true });

        // Use arrow function to preserve 'this' in called method 
        this.fields.forEach((field) => this.calcNearBy(field));
    }

    calcNearBy(field) {
        if (field.hasMine) {
            // No need to calculate near by count for fields with mines
            return;
        }

        field.nearByMineCounter = this.getNeighbours(field);
    }

    getNeighbours(field) {
        
    }
}