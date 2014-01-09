'use strict';

var RWWM = RWWM || {};
RWWM.applications = RWWM.applications || {};
RWWM.applications.reader = {};

RWWM.applications.reader.Reader = function() {
    RWWM.Window.call(this, 'Reader', 400, 500, 'Reader', 'applications/reader/icon.png', {
        'File': {'Close': this.close},
        'Edit': {
            'Update': this.update,
            'Interval': [{'selected': '10 min', 'onchange': this.setInterval}, '5 min', '10 min', '30 min', '1 hour'],
            'Source': [{'selected': 'OMG Ubuntu!', 'onchange': this.setSource}, 'OMG Ubuntu!', 'Phoronix', 'Dagens Nyheter']
        }
    });

    this.container.classList.add('reader');

    this.setSource('OMG Ubuntu!');
    this.setInterval('10 min');
};

RWWM.applications.reader.Reader.prototype = Object.create(RWWM.Window.prototype);
RWWM.applications.reader.Reader.prototype.constructor = RWWM.applications.reader.Reader;

RWWM.applications.reader.Reader.prototype.update = function() {
    var that = this;

    var timeout = window.setTimeout(function() {
        that.setStatusLoading();
    }, 100);

    $(this.view).load('http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=' +
        encodeURIComponent(this.url), function() {

        var now = new Date();
        window.clearTimeout(timeout);
        that.setStatus('Last updated ' + ('00' + now.getHours()).slice(-2) + ':' + ('00' + now.getMinutes()).slice(-2));
    });
};

RWWM.applications.reader.Reader.prototype.setInterval = function(interval) {
    var that = this;

    if (this.interval) {
        window.clearInterval(this.interval);
    }

    switch (interval) {
        case '5 min':
            interval = 300000;
            break;
        case '10 min':
            interval = 600000;
            break;
        case '30 min':
            interval = 1600000;
            break;
        case '1 hour':
            interval = 3200000;
            break;
    }

    this.interval = window.setInterval(function() {
        that.update.call(that);
    }, interval);
};

RWWM.applications.reader.Reader.prototype.setSource = function(source) {
    switch (source) {
        case 'OMG Ubuntu!':
            this.url = 'http://omgubuntu.co.uk/feed';
            break;
        case 'Phoronix':
            this.url = 'http://www.phoronix.com/rss.php';
            break;
        case 'Dagens Nyheter':
            this.url = 'http://www.dn.se/m/rss/senaste-nytt';
            break;
    }

    this.setTitle('Reader - ' + source);
    this.update();
};

RWWM.applications.reader.Reader.prototype.onclose = function() {
    if (this.interval) {
        window.clearInterval(this.interval);
    }
};

RWWM.launcher.add('Reader', 'applications/reader/icon.png', RWWM.applications.reader.Reader);