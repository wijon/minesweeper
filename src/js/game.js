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

function createGame(sizeSettings) {
    if (!sizeSettings) {
        return Game.create(18, 14, 40);
    }

    return Game.create(sizeSettings.width, sizeSettings.height, sizeSettings.mineCount);
}

var app = new Vue({
    el: '#game',
    data: {
        game: undefined,
        sizeSettings: [
            { text: 'Small', value: 'small', width: 8, height: 10, mineCount: 10 },
            { text: 'Medium', value: 'medium', width: 18, height: 14, mineCount: 40 },
            { text: 'Large', value: 'large', width: 24, height: 20, mineCount: 99 }
        ],
        sizeSetting: 'medium',
        customSizeSetting: {width: undefined, height: undefined, mineCount: undefined}
    },
    methods: {
        flag(field) {
            this.game.flagField(field);
        },
        explore(field) {
            this.game.exploreField(field);
        },
        newGame(event) {
            this.game = createGame(this.selectedSizeSetting);
            if (event) {
                // Remove focus from button
                event.target.blur();
            }
        }
    },
    computed: {
        remainingMineCount: function () {
            return this.game.getRemainingMineCount();
        },
        selectedSizeSetting: function () {
            if (this.sizeSetting === 'custom') {
                // Handle custom size settings
                return { text: 'Custom', width: this.customSizeSetting.width, height: this.customSizeSetting.height, mineCount: this.customSizeSetting.mineCount };
            } else {
                return this.sizeSettings.find(s => s.value === this.sizeSetting);
            }
        }
    },
    mounted: function () {
        // Initial game creation
        this.game = createGame(this.selectedSizeSetting);
    }
});