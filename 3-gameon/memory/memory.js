"use strict"

function Memory(id, rows, cols) {
    var self = this;
    this.rows = rows;
    this.cols = cols;

    this.board = [];
    this.flipped = 0;

    this.node = document.getElementById(id);

    this.init();
}

Memory.prototype.init = function() {
    var memory = this;
    this.board = RandomGenerator.getPictureArray(this.rows, this.cols);
    this.node.className = 'memory';

    var table = document.createElement('table');

    for (var row = 0; row < this.rows; row++) {
        var tr = document.createElement('tr');

        for (var col = 0; col < this.cols; col++) {
            var td = document.createElement('td');
            var a = document.createElement('a');
            var img = document.createElement('img');
            var img2 = document.createElement('img');

            a.setAttribute('href', '#');
            img.setAttribute('src', 'pics/0.png');
            img2.setAttribute('src', 'pics/' + this.board[row*4 + col] + '.png');

            a.onclick = function() {
                if (memory.flipped <= 1) {
                    this.className = 'flip';
                    memory.flipped++;

                    if (memory.flipped >= 2) {

                        setTimeout(function() {
                            [].forEach.call(memory.node.querySelectorAll('.flip'), function(brick) {
                                brick.className = '';
                            });

                            memory.flipped = 0;
                        }, 1500);
                    }
                }
            };

            a.appendChild(img);
            a.appendChild(img2);
            td.appendChild(a);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    this.node.appendChild(table);
};

window.onload = function() {
    new Memory('memory', 4, 4);
};