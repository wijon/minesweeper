Vue.component('field-square', {
    props: ['square'],
    template: `<div class="bg-secondary field-square" @mouseup.right="$emit('flag')" @mouseup.left="$emit('explore')" @contextmenu.prevent>{{square}}</div>`
})

var points = {};
points[[1,1]] = "1,1";
points[[1,2]] = "1,2";
points[[1,3]] = "1,3";

points[[2,1]] = "2,1";
points[[2,2]] = "2,2";
points[[2,3]] = "2,3";

var app = new Vue({
    el: '#game',
    data: {
        message: 'Hello Vue',
        columns: [
            1,2
        ],
        rows: [
            1,2,3
        ],
        points
    },
    methods: {
        flag() {
            console.log("flag");
        },
        explore() {
            console.log("explore")
        }
    }
})