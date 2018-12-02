"use strict";

Vue.component('field-element', {
    props: ['field'],
    template: `
    <div class="field" v-bind:class="getFieldBgColor()" @mouseup.right="$emit('flag', field)" @mouseup.left="$emit('explore', field)"@contextmenu.prevent>
        <div v-if="!field.isExplored">
            <i class="fa fa-flag" v-if="field.hasFlag"></i>
        </div>
        <div v-else>
            <i class="fa fa-asterisk" v-if="field.hasMine"></i>
            <span v-else-if="!field.hasFlag && field.nearByMineCounter > 0">{{field.nearByMineCounter}}</span>
        </div>
    </div>`,
    methods: {
        getFieldBgColor() {
            return {
                'bg-light': this.field.isExplored && !this.field.hasMine,
                'bg-secondary': !this.field.isExplored,
                'bg-danger': this.field.isExplored && this.field.hasMine && this.field.isGameOverClick
            };
        }
    }
});

Vue.component('timer', {
    props: ['passed-seconds'],
    template: `
    <div>
        {{hours | two_digits}}:{{minutes | two_digits}}:{{seconds | two_digits}}
    </div>`,
    computed: {
        seconds() {
            return this.passedSeconds % 60;
        },
        minutes() {
            return Math.trunc(this.passedSeconds / 60) % 60;
        },
        hours() {
            return Math.trunc(this.passedSeconds / 60 / 60) % 24;
        }
    }
});

Vue.filter('two_digits', function (value) {
    if (value.toString().length <= 1) {
        return "0" + value.toString();
    }
    return value.toString();
});

function createGame() {
    return Game.create(14, 18, 40);
}

var app = new Vue({
    el: '#game',
    data: {
        game: createGame()
    },
    methods: {
        flag(field) {
            this.game.flagField(field);
        },
        explore(field) {
            this.game.exploreField(field);
        },
        newGame(event) {
            this.game = createGame();
            // Remove focus from button
            event.target.blur();
        }
    },
    computed: {
        remainingMineCount: function () {
            return this.game.getRemainingMineCount();
        }
    }
});