"use strict";

var RWWM = RWWM || {};
RWWM.applications = RWWM.applications || {};
RWWM.applications.reader = {};

RWWM.applications.reader.Reader = function() {
    var that = this;
    RWWM.Window.call(this, 400, 500, "Reader", "applications/reader/icon.png");

    this.container.classList.add("reader");

    var timeout = window.setTimeout(function() {
        that.setStatusLoading();
    }, 100);

    $(this.view).load("http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=" +
        encodeURIComponent("http://www.dn.se/m/rss/senaste-nytt"), function() {

        var now = new Date();
        that.setStatus('Last updated ' + ('00' + now.getHours()).slice(-2) + ':' + ('00' + now.getMinutes()).slice(-2));
    });

};

RWWM.applications.reader.Reader.prototype = Object.create(RWWM.Window.prototype);
RWWM.applications.reader.Reader.prototype.constructor = RWWM.applications.reader.Reader;

RWWM.launcher.add("Reader", "applications/reader/icon.png", RWWM.applications.reader.Reader);