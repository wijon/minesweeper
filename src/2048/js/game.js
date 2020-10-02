"use strict";

Vue.component('cell-item', {
    props: ['cell'],
    template: `
    <div class="text-center">
        {{ cell.getDisplayValue() }}
    </div>`
});

function findIndicesForValue(cells, value) {
    let result = [];
    for (let x = 0; x < cells[0].length; x++) {
        for (let y = 0; y < cells.length; y++) {
            if (cells[y][x].value === value)
                result.push({ x: x, y: y });
        }
    }

    return result;
}

function addRndValue(cells) {
    let zeros = findIndicesForValue(cells, 0);

    if (zeros.length === 0)
        return false;

    let p = zeros[Math.floor(Math.random() * zeros.length)];
    cells[p.y][p.x].value = 2;

    return true;
}

function checkWinCondition(cells) {
    return findIndicesForValue(cells, 2048).length > 0;
}

function transformUpDown(cells, direction) {
    const iterator = direction === "up" ? 1 : -1;

    let changeHappened = false;
    for (let x = 0; x < cells[0].length; x++) {
        let y = iterator > 0 ? 0 : cells.length - 1;
        let currentPos = { x: x, y: y };	// The position of the value against which gets currently compared
        let current = cells[y][x].value;	// The value against which gets currently compared

        while ((iterator > 0 && y < cells.length) || (iterator < 0 && y >= 0)) {
            // Is the value at the iterated position 0 or is it the current value?
            if (cells[y][x].value === 0 || (currentPos.x === x && currentPos.y === y)) {
                // Go to the next value
                y += iterator;
            }
            // Is the current value 0 and the iterated value != 0?
            else if (current === 0) {
                // Assign the found value to the position of the 'current' value and go to the next item
                cells[currentPos.y][currentPos.x].value = current = cells[y][x].value;
                cells[y][x].value = 0;
                y += iterator;

                changeHappened = true;
            }
            // Is the current value != the iterated value and neither of them are 0?
            else if (current !== cells[y][x].value) {
                // Check if the iterated value is already direct neighbor of 'current'
                if (x !== currentPos.x || y !== currentPos.y + iterator) {
                    // Not direct neighbor, move iterated value as direct neighbor
                    cells[currentPos.y + iterator][currentPos.x].value = cells[y][x].value;
                    cells[y][x].value = 0;

                    changeHappened = true;
                }

                // Move 'current' to iterated value which is set as neighbor
                current = cells[currentPos.y + iterator][currentPos.x].value;
                currentPos = { x: currentPos.x, y: currentPos.y + iterator };
                y = currentPos.y;	// Start over with neighbor
            }
            // Is the current value the same as the iterated value?
            else if (current === cells[y][x].value) {
                // Add both values and store the result as at the position of the 'current' value
                cells[currentPos.y][currentPos.x].value += cells[y][x].value;

                // _score += cells[currentPos.y, currentPos.x].value;

                cells[y][x].value = 0;
                // Set the 'current' value to the next neighbour of the old 'current' value
                currentPos = { x: currentPos.x, y: currentPos.y + iterator };
                y = currentPos.y;
                current = cells[y][x].value;

                changeHappened = true;
            }
        }
    }

    return changeHappened;
}

function transformLeftRight(cells, direction) {
    const iterator = direction === "left" ? 1 : -1;

    let changeHappened = false;
    for (let y = 0; y < cells.length; y++) {
        let x = iterator > 0 ? 0 : cells[0].length - 1;
        let currentPos = { x: x, y: y };
        let current = cells[y][x].value;

        while ((iterator > 0 && x < cells[0].length) || (iterator < 0 && x >= 0)) {
            if (cells[y][x].value === 0 || (currentPos.x === x && currentPos.y === y)) {
                x += iterator;
            }
            else if (current === 0) {
                cells[currentPos.y][currentPos.x].value = current = cells[y][x].value;
                cells[y][x].value = 0;
                x += iterator;

                changeHappened = true;
            }
            else if (current !== cells[y][x].value) {
                if (x !== currentPos.x + iterator || y !== currentPos.y) {
                    cells[currentPos.y][currentPos.x + iterator].value = cells[y][x].value;
                    cells[y][x].value = 0;

                    changeHappened = true;
                }

                current = cells[currentPos.y][currentPos.x + iterator].value;
                currentPos = { x: currentPos.x + iterator, y: currentPos.y };
                x = currentPos.x;
            }
            else if (current === cells[y][x].value) {
                cells[currentPos.y][currentPos.x].value += cells[y][x].value;

                // _score += cells[currentPos.y][currentPos.x];

                cells[y][x].value = 0;
                currentPos = { x: currentPos.x + iterator, y: y };
                x = currentPos.x;
                current = cells[y][x].value;

                changeHappened = true;
            }
        }
    }

    return changeHappened;
}

var vm = new Vue({
    el: '#game',
    data: {
        message: "Test",
        cells: [],
        victory: false
    },
    created() {
        window.addEventListener('keydown', (e) => {
            this.keyHandler(e.key);
        });
    },
    mounted: function () {
        this.startGame();
    },
    methods: {
        startGame() {
            this.cells = [];
            for (let x = 0; x < 4; x++) {
                this.cells.push([]);
                for (let y = 0; y < 4; y++) {
                    this.cells[x].push(new Cell(`${y}${x}`));
                }
            }

            addRndValue(this.cells);
            addRndValue(this.cells);

            this.end = this.victory = false;
        },
        keyHandler(key) {

            let changeHappened = false;
            switch (key) {
                case "ArrowDown":
                    changeHappened = transformUpDown(this.cells, "down");
                    break;
                case "ArrowUp":
                    changeHappened = transformUpDown(this.cells, "up");
                    break;
                case "ArrowLeft":
                    changeHappened = transformLeftRight(this.cells, "left");
                    break;
                case "ArrowRight":
                    changeHappened = transformLeftRight(this.cells, "right");
                    break;
            }

            if (!changeHappened)
                return;	// No item moved, continue

            if (checkWinCondition(this.cells)) {
                // Winner
                this.victory = true
            }

            addRndValue(this.cells);
        }
    }
});