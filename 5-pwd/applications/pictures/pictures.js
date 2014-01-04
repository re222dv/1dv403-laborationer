"use strict";

var RWWM = RWWM || {};
RWWM.applications = RWWM.applications || {};
RWWM.applications.pictures = {};

RWWM.applications.pictures.Picture = function(image) {
    RWWM.Window.call(this, image.width, image.height, "Picture", "applications/pictures/icon.png");

    this.container.classList.add("picture");

    this.setStatus(image.width + ' x ' + image.height + ' 100%');

    this.view.style.backgroundImage = 'url("' + image.URL + '")';
};

RWWM.applications.pictures.Picture.prototype = Object.create(RWWM.Window.prototype);
RWWM.applications.pictures.Picture.prototype.constructor = RWWM.applications.pictures.Picture;

RWWM.applications.pictures.Pictures = function() {
    var that = this;
    RWWM.Window.call(this, 365, 500, "Pictures", "applications/pictures/icon.png");

    this.container.classList.add("pictures");

    var timeout = window.setTimeout(function() {
        that.setStatusLoading();
    }, 100);

    var start = Date.now();
    $.ajax("http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/", {"dataType": "json", "success": function(data) {
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
            var button = document.createElement("button");
            var img = document.createElement("img");

            img.setAttribute("src", image.thumbURL);
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

RWWM.launcher.add("Pictures", "applications/pictures/icon.png", RWWM.applications.pictures.Pictures);