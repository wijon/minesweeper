"use strict";

class Field {
    constructor(x, y) {
        this.position = { x: x, y: y }
        this.hasMine = false;
        this.hasFlag = false;
        this.isExplored = false;
        this.nearByMineCounter = 0;
        this.isGameOverClick = false;
    }
}

class Board {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.fields = []
    }

    static create(height, width, mineCount) {
        if (height < 1 || width < 1) {
            throw "The board must be at least 1x1";
        }

        let board = new Board(height, width);
        board.addFields();
        board.placeMines(mineCount);

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

        // Calculate nearby mines for every field
        // Use arrow function to preserve 'this' in called method 
        this.fields.forEach((field) => this.calcNearBy(field));
    }

    calcNearBy(field) {
        if (field.hasMine) {
            // No need to calculate near by count for fields with mines
            return;
        }

        field.nearByMineCounter = this.getNeighbours(field).filter(f => f.hasMine).length;
    }

    getNeighbours(field) {
        const position = field.position;
        let neighbours = [];

        for (let i = position.x - 1; i <= position.x + 1 && i <= this.width; i++) {
            for (let j = position.y - 1; j <= position.y + 1 && j <= this.height; j++) {
                // Handle border crossing
                var neighbourX = i < 1 ? 1 : i;
                var neighbourY = j < 1 ? 1 : j;

                const neighbourField = this.fields.find(f => f.position.x === neighbourX && f.position.y === neighbourY);

                if ((neighbourX == position.x && neighbourY == position.y) || neighbours.includes(neighbourField)) {
                    // Ignore the initial point and already listed points
                    continue;
                }

                neighbours.push(neighbourField);
            }
        }

        return neighbours;
    }

    explore(field) {
        if (!field) {
            // Field is not defined
            return false;
        }

        if (field.hasMine) {
            // Field has mine, Game Over
            field.isExplored = true;
            return false;
        }

        this.starExploration(field.position, true);

        return true;
    }

    starExploration(position) {
        let currentField = this.fields.find(f => f.position.x === position.x && f.position.y === position.y);

        if (!currentField) {
            return;
        }

        if (currentField.isExplored) {
            // Already explored, nothing to do
            return;
        }

        if (currentField.hasFlag) {
            // If the field is flagged, do nothing
            return;
        }

        currentField.isExplored = true;

        if (currentField.hasMine) {
            // If field has mine, do nothing
            return;
        }

        if (currentField.nearByMineCounter > 0) {
            // If the field has mines nearby, return
            return;
        }

        this.starExploration({ x: currentField.position.x - 1, y: currentField.position.y + 1 });
        this.starExploration({ x: currentField.position.x - 1, y: currentField.position.y + 0 });
        this.starExploration({ x: currentField.position.x - 1, y: currentField.position.y - 1 });
        this.starExploration({ x: currentField.position.x + 0, y: currentField.position.y - 1 });
        this.starExploration({ x: currentField.position.x + 1, y: currentField.position.y - 1 });
        this.starExploration({ x: currentField.position.x + 1, y: currentField.position.y + 0 });
        this.starExploration({ x: currentField.position.x + 1, y: currentField.position.y + 1 });
        this.starExploration({ x: currentField.position.x + 0, y: currentField.position.y + 1 });
    }

    getFieldByPosition(position) {
        return this.fields.find(f => f.position.x === position.x && f.position.y === position.y);
    }

    getNumberOfFlags() {
        return this.fields.filter(f => f.hasFlag).length;
    }

    exploreAll() {
        this.fields.forEach(f => f.isExplored = true);
    }
}

class Game {
    constructor() {
        this.isGameOver = false;
        this.passedSeconds = 0;

        this.timerInterval = setInterval(() => {
            this.passedSeconds++;
        }, 1000);
    }

    static create(boardHeight, boardWidth, mineCount) {
        let game = new Game();
        game.board = Board.create(boardHeight, boardWidth, mineCount);
        game.mineCount = mineCount;

        return game;
    }

    exploreField(field) {
        if (!this.isGameOver) {
            let isGameOver = !this.board.explore(field);

            if (isGameOver) {
                field.isGameOverClick = true;
                this.executeGameOver();
            } else {
                this.checkWinCondition();
            }
        }

        return this.isGameOver;
    }

    flagField(field) {
        if (!this.isGameOver && !field.isExplored) {
            if (this.getRemainingMineCount() > 0) {
                field.hasFlag = !field.hasFlag;
            } else if (field.hasFlag) {
                field.hasFlag = false;
            }
        }
    }

    getRemainingMineCount() {
        return this.mineCount - this.board.getNumberOfFlags();
    }

    executeGameOver() {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        this.board.exploreAll();
    }

    checkWinCondition() {
        if (!this.board.fields.some(f => !f.hasMine && !f.isExplored)) {
            // Game Won
            console.log("winner");
            clearInterval(this.timerInterval);
        }
    }
}