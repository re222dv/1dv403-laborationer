"use strict";

var RWWM = RWWM || {};
RWWM.applications = RWWM.applications || {};
RWWM.applications.memory = {};

RWWM.applications.memory.RandomGenerator = {

    /*
     Denna metod tar antalet rader och columner som inparameter.

     Metoden returnerar en array inneh�llandes utslumpade tal mellan 1 och (rows*cols)/2. Varje tal representeras tv�
     g�nger och motsvarar s�ledes en spelbricka.

     I en 4*4 matris kan Arrayen t.ex. se ut s� h�r:
     [1,2,6,8,6,2,5,3,1,3,7,5,8,4,4,7]

     I en 2*4 matris kan Arrayen t.ex. se ut s� h�r:
     [3,4,4,1,2,1,2,3]
     */

    getPictureArray: function(rows, cols)
    {
        var numberOfImages = rows*cols;
        var maxImageNumber = numberOfImages/2;

        var imgPlace = [];

        //Utplacering av bilder i Array
        for(var i=0; i<numberOfImages; i++)
            imgPlace[i] = 0;

        for(var currentImageNumber=1; currentImageNumber<=maxImageNumber; currentImageNumber++)
        {
            var imageOneOK = false;
            var imageTwoOK = false;

            do
            {
                if(imageOneOK == false)
                {
                    var randomOne = Math.floor( (Math.random() * (rows*cols-0) + 0) );

                    if( imgPlace[randomOne] == 0 )
                    {
                        imgPlace[randomOne] = currentImageNumber;
                        imageOneOK = true;
                    }
                }

                if(imageTwoOK == false)
                {
                    var randomTwo = Math.floor( (Math.random() * (rows*cols-0) + 0) );

                    if( imgPlace[randomTwo] == 0 )
                    {
                        imgPlace[randomTwo] = currentImageNumber;
                        imageTwoOK = true;
                    }
                }
            }
            while(imageOneOK == false || imageTwoOK == false);
        }

        return imgPlace;
    }
};

RWWM.applications.memory.Memory = function() {
    RWWM.Window.call(this, 320, 320, "Memory", "applications/memory/icon.png", {
        'File': {'Close': this.close},
        'Edit': {
            'Restart': this.restart,
            'Size': [{'selected': 4, 'onchange': this.setBoardSize}, '2x2', '2x3', '2x4', '3x4', '4x4']
        }
    });

    this.container.classList.add("memory");

    this.rows = 4;
    this.cols = 4;

    this.board = [];
    this.flipped = 0;
    this.score = 0;
    this.tries = 0;

    this.node = this.view;

    this.init();
};

RWWM.applications.memory.Memory.prototype = Object.create(RWWM.Window.prototype);
RWWM.applications.memory.Memory.prototype.constructor = RWWM.applications.memory.Memory;

RWWM.applications.memory.Memory.prototype.init = function() {
    var memory = this;
    this.board = RWWM.applications.memory.RandomGenerator.getPictureArray(this.rows, this.cols);

    var onclick = function() {
        // Only allow two flipped bricks at a time and don't flip already flipped bricks
        if (memory.flipped <= 1 && this.className != 'flip' && this.className != 'flipPerm') {
            this.className = 'flip';
            memory.flipped++;

            if (memory.flipped >= 2) {
                memory.tries++;

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

                    memory.setStatus(memory.tries + ' tries made');

                    if (memory.score >= memory.board.length/2) {
                        memory.won();
                    }
                } else {
                    memory.setStatus('Paused');
                    setTimeout(function() {
                        [].forEach.call(memory.node.querySelectorAll('.flip'), function(brick) {
                            brick.className = '';
                            memory.setStatus(memory.tries + ' tries made');
                        });

                        memory.flipped = 0;
                    }, 1500);
                }
            }
        }
    };

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
            img.setAttribute('src', 'applications/memory/pics/0.png'); // Back
            img2.setAttribute('src', 'applications/memory/pics/' + this.board[row*this.cols + col] + '.png'); //Front

            a.onclick = onclick;

            a.appendChild(img);
            a.appendChild(img2);
            td.appendChild(a);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    this.node.appendChild(table);
};

RWWM.applications.memory.Memory.prototype.restart = function() {
    this.board = [];
    this.flipped = 0;
    this.score = 0;
    this.tries = 0;

    this.node.innerHTML = '';

    this.init();
    this.setStatus('');
};

RWWM.applications.memory.Memory.prototype.setBoardSize = function(size) {
    switch (size) {
        case '2x2':
            this.rows = 2;
            this.cols = 2;
            this.setSize(160, 160);
            break;
        case '2x3':
            this.rows = 2;
            this.cols = 3;
            this.setSize(240, 160);
            break;
        case '2x4':
            this.rows = 2;
            this.cols = 4;
            this.setSize(320, 160);
            break;
        case '3x4':
            this.rows = 3;
            this.cols = 4;
            this.setSize(320, 240);
            break;
        case '4x4':
            this.rows = 4;
            this.cols = 4;
            this.setSize(320, 320);
            break;
    }
    this.restart();
};

RWWM.applications.memory.Memory.prototype.won = function() {
    var rate = this.tries < this.board.length ? 'good' : 'lazy';

    this.setStatus('You won in ' + this.tries + ' tries, ' + rate);
};

RWWM.launcher.add("Memory", "applications/memory/icon.png", RWWM.applications.memory.Memory);
