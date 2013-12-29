"use strict"

var RWWM = RWWM || {};
RWWM.applications = RWWM.applications || {};
RWWM.applications.pictures = {};

RWWM.applications.pictures.Pictures = function() {
    var that = this;
    RWWM.Window.call(this, 400, 500, "Pictures", "applications/pictures/icon.png");

    var timeout = window.setTimeout(function() {
        that.setStatusLoading();
    }, 100);

    var start = Date.now();
    $.ajax("http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/", {"dataType": "json", "success": function(data) {
        var end = Date.now();
        window.clearTimeout(timeout);
        that.setStatus(data.length + ' pictures loaded in ' + ((end - start) / 1000).toFixed(1) + ' seconds');
    }});

};

RWWM.applications.pictures.Pictures.prototype = Object.create(RWWM.Window.prototype);
RWWM.applications.pictures.Pictures.prototype.constructor = RWWM.applications.pictures.Pictures;

RWWM.launcher.add("Pictures", "applications/pictures/icon.png", RWWM.applications.pictures.Pictures);