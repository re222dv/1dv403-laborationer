'use strict';

var RWWM = RWWM || {};
RWWM.applications = RWWM.applications || {};
RWWM.applications.pictures = {};

RWWM.applications.pictures.Picture = function(image) {
    var width = image.width;
    var height = image.height;

    // Workaround what looks like a bug in Chrome
    if (width > height) {
        height -= 1;
    } else {
        width -= 1;
    }

    RWWM.Window.call(this, 'Pictures', width, height, 'Picture', 'applications/pictures/icon.png');

    this.container.classList.add('picture');

    this.imageWidth = image.width;
    this.imageHeight = image.height;
    this.setStatus(image.width + ' x ' + image.height + ' 100%');

    this.view.style.backgroundImage = 'url("' + image.URL + '")';
};

RWWM.applications.pictures.Picture.prototype = Object.create(RWWM.Window.prototype);
RWWM.applications.pictures.Picture.prototype.constructor = RWWM.applications.pictures.Picture;

RWWM.applications.pictures.Picture.prototype.onresize = function() {
    var percent = undefined;

    var width = $(this.view).width();
    var height = $(this.view).height();

    if (width / this.imageWidth < height / this.imageHeight) {
        percent = (width - this.imageWidth) / this.imageWidth;
    } else {
        percent = (height - this.imageHeight) / this.imageWidth;
    }

    this.setStatus(this.imageWidth + ' x ' + this.imageHeight + ' ' + Math.round((1 + percent) * 100) + '%');
};

RWWM.applications.pictures.Pictures = function() {
    var that = this;
    RWWM.Window.call(this, 'Pictures', 365, 500, 'Pictures', 'applications/pictures/icon.png');

    this.container.classList.add('pictures');

    var timeout = window.setTimeout(function() {
        that.setStatusLoading();
    }, 100);

    var start = Date.now();
    $.ajax('http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/', {'dataType': 'json', 'success': function(data) {
        var end = Date.now();
        window.clearTimeout(timeout);
        that.setStatus(data.length + ' pictures loaded in ' + ((end - start) / 1000).toFixed(1) + ' seconds');

        var width = data.reduce(function(prev, image) {
            return Math.max(prev, image.thumbWidth);
        }, 0) + 20;

        var height = data.reduce(function(prev, image) {
            return Math.max(prev, image.thumbHeight);
        }, 0) + 20;

        data.forEach(function(image) {
            var button = document.createElement('button');
            var img = document.createElement('img');

            img.setAttribute('src', image.thumbURL);
            button.appendChild(img);

            button.style.width = width + 'px';
            button.style.height = height + 'px';

            button.onclick = function() {
                new RWWM.applications.pictures.Picture(image);
            };

            that.view.appendChild(button);
        });
    }});

};

RWWM.applications.pictures.Pictures.prototype = Object.create(RWWM.Window.prototype);
RWWM.applications.pictures.Pictures.prototype.constructor = RWWM.applications.pictures.Pictures;

RWWM.launcher.add('Pictures', 'applications/pictures/icon.png', RWWM.applications.pictures.Pictures);