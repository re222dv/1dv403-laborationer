"use strict"

function Memory(id, rows, cols) {
    var self = this;
    this.rows = rows;
    this.cols = cols;

    this.board = [];
    this.flipped = 0;
    this.score = 0;

    this.node = document.getElementById(id);

    this.init();
}

Memory.prototype.init = function() {
    var memory = this;
    this.board = RandomGenerator.getPictureArray(this.rows, this.cols);
    this.node.className = 'memory';

    var h1 = document.createElement('h1');
    var text = document.createTextNode('MEMORY');
    h1.appendChild(text);
    this.node.appendChild(h1);

    var table = document.createElement('table');

    for (var row = 0; row < this.rows; row++) {
        var tr = document.createElement('tr');

        for (var col = 0; col < this.cols; col++) {

            var td = document.createElement('td');
            var a = document.createElement('a');
            var img = document.createElement('img');
            var img2 = document.createElement('img');

            a.setAttribute('href', '#');
            a.setAttribute('data-pic', ''+this.board[row*this.cols + col]);
            img.setAttribute('src', 'pics/0.png'); // Back
            img2.setAttribute('src', 'pics/' + this.board[row*this.cols + col] + '.png'); //Front

            a.onclick = function() {
                // Only allow two flipped bricks at a time and don't flip already flipped bricks
                if (memory.flipped <= 1 && this.className != 'flip' && this.className != 'flipPerm') {
                    this.className = 'flip';
                    memory.flipped++;

                    if (memory.flipped >= 2) {

                        // Get the value of the flipped bricks
                        var pics = [].map.call(memory.node.querySelectorAll('.flip'), function(brick) {
                            return brick.getAttribute('data-pic');
                        });

                        if (pics[0] == pics[1]) {
                            memory.score++;
                            [].forEach.call(memory.node.querySelectorAll('.flip'), function(brick) {
                                brick.className = 'flipPerm';
                            });
                            memory.flipped = 0;

                            if (memory.score >= memory.board.length/2) {
                                alert('Win!');
                            }
                        } else {
                            setTimeout(function() {
                                [].forEach.call(memory.node.querySelectorAll('.flip'), function(brick) {
                                    brick.className = '';
                                });

                                memory.flipped = 0;
                            }, 1500);
                        }
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
    new Memory('memory', 4, 2);
};