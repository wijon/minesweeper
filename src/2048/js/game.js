"use strict";

Vue.component('cell-item', {
    props: ['cell'],
    template: `
    <div v-bind:style="cell.getStyle()">
        {{ cell.getDisplayValue() }}
    </div>`
});

var vm = new Vue({
    el: '#game',
    data: {
        message: "Test",
        cells: []
    },
    mounted: function () {
        for (let x = 0; x < 4; x++) {
            this.cells.push([]);
            for (let y = 0; y < 4; y++) {
                this.cells[x].push(new Cell(`${y}${x}`));
            }
        }
    }
});