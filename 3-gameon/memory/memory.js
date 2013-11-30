"use strict"

function Memory(id, rows, cols) {
    var self = this;
    this.rows = rows;
    this.cols = cols;

    this.board = [];

    this.node = document.getElementById(id);

    this.init();
}

Memory.prototype.init = function() {
    this.board = RandomGenerator.getPictureArray(this.rows, this.cols);

    var table = document.createElement('table');

    for (var row = 0; row < this.rows; row++) {
        var tr = document.createElement('tr');

        for (var col = 0; col < this.cols; col++) {
            var td = document.createElement('td');
            var img = document.createElement('img');

            img.setAttribute('src', 'pics/0.png');

            td.appendChild(img);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    this.node.appendChild(table);
};

window.onload = function() {
    new Memory('memory', 4, 4);
};