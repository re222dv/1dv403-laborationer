"use strict"

function Memory(id) {
    var self = this;
    var board = [];

    this.init();
}

Memory.prototype.init = function() {
};

window.onload = function() {
    new Memory('memory');
};