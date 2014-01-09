'use strict';

var RWWM = RWWM || {};
RWWM.applications = RWWM.applications || {};
RWWM.applications.labbymezzage = {};

RWWM.applications.labbymezzage.Message = function(writer, message, date) {

    this.getWriter = function() {
        return writer || 'Anonymous';
    };

    this.getText = function() {
        return message || 'Empty message';
    };

    this.getDate = function() {
        return date;
    };
};

RWWM.applications.labbymezzage.Message.prototype.getHtmlText = function() {
    return this.getText();
};

RWWM.applications.labbymezzage.Message.prototype.getDateText = function() {
    // Idea and example from http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site

    var seconds = Math.floor((new Date() - this.getDate()) / 1000);
    var text = 'About {0} ago';

    var interval = Math.floor(seconds / 31536000); // Seconds per year
    if (interval === 1) {
        return text.replace('{0}', interval + ' year');
    } else if (interval > 1) {
        return text.replace('{0}', interval + ' years');
    }

    interval = Math.floor(seconds / 2592000);// Seconds per month
    if (interval === 1) {
        return text.replace('{0}', interval + ' month');
    } else if (interval > 1) {
        return text.replace('{0}', interval + ' months');
    }

    interval = Math.floor(seconds / 86400);// Seconds per day
    if (interval === 1) {
        return text.replace('{0}', interval + ' day');
    } else if (interval > 1) {
        return text.replace('{0}', interval + ' days');
    }

    interval = Math.floor(seconds / 3600);// Seconds per hour
    if (interval === 1) {
        return text.replace('{0}', interval + ' hour');
    } else if (interval > 1) {
        return text.replace('{0}', interval + ' hours');
    }

    interval = Math.floor(seconds / 60);// Seconds per minute
    if (interval === 1) {
        return text.replace('{0}', interval + ' minute');
    } else if (interval > 1) {
        return text.replace('{0}', interval + ' minutes');
    }

    return text.replace('{0}', Math.floor(seconds) + ' seconds');
};

RWWM.applications.labbymezzage.LabbyMessage = function() {
    var that = this;

    var interval = window.localStorage.getItem('interval') || '10 seconds';
    this.numMessages = window.localStorage.getItem('numMessages') || '10';

    RWWM.Window.call(this, 'Labby Mezzage', 400, 500, 'Labby Mezzage', 'applications/labbymezzage/icon.png', {
        'File': {'Close': this.close},
        'Edit': {
            'Update': this.update,
            'Interval': [{'selected': interval, 'onchange': this.setInterval}, '10 seconds', '20 seconds', '30 seconds', '1 minute'],
            'Number of Messages': [{'selected': this.numMessages, 'onchange': this.setNumMessages}, '10', '30', '50', '100'],
            'Alias': this.setupAlias
        }
    });

    this.container.classList.add('mezzage');

    this.messages = [];
    this.alias = window.localStorage.getItem('alias') || 'Anonymous';

    this.messageField = document.createElement('div');
    var write = document.createElement('div');
    this.textarea = document.createElement('textarea');
    var button = document.createElement('button');

    this.messageField.className = 'messages';

    write.className = 'write';
    this.textarea.onkeydown = function(event) {
        if (event.which == 13 || event.keyCode == 13) {
            if (!event.shiftKey) {
                that.postMessage.call(that);
                event.preventDefault();
            }
        }
    };

    button.innerHTML = 'Send';
    button.onclick = function() {that.postMessage.call(that)};

    this.view.appendChild(this.messageField);
    write.appendChild(this.textarea);
    write.appendChild(button);
    this.view.appendChild(write);

    this.setInterval(interval);
    this.update();
};

RWWM.applications.labbymezzage.LabbyMessage.prototype = Object.create(RWWM.Window.prototype);
RWWM.applications.labbymezzage.LabbyMessage.prototype.constructor = RWWM.applications.labbymezzage.LabbyMessage;

RWWM.applications.labbymezzage.LabbyMessage.prototype.getAlias = function() {
    return this.alias;
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.setupAlias = function() {
    this.alias = prompt('Alias', this.alias);
    window.localStorage.setItem('alias', this.alias);
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.setInterval = function(interval) {
    var that = this;

    window.localStorage.setItem('interval', interval);

    if (this.interval) {
        window.clearInterval(this.interval);
    }

    switch (interval) {
        case '10 seconds':
            interval = 10000;
            break;
        case '20 seconds':
            interval = 20000;
            break;
        case '30 seconds':
            interval = 30000;
            break;
        case '1 minute':
            interval = 60000;
            break;
    }

    this.interval = window.setInterval(function() {
        that.update.call(that);
    }, interval);
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.setNumMessages = function(numMessages) {
    window.localStorage.setItem('numMessages', numMessages);
    this.numMessages = numMessages;
    this.update();
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.update = function() {
    var that = this;

    var timeout = window.setTimeout(function() {
        that.setStatusLoading();
    }, 100);

    $.get('http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php', {history: this.numMessages}, function(xml) {
        that.messages = [];

        $(xml).find('messages').each(function() {
            $(this).find('message').each(function() {
                var writer = $(this).find('author').text();
                var text = $(this).find('text').text();
                var date = new Date(+$(this).find('time').text());

                that.messages.push(new RWWM.applications.labbymezzage.Message(writer, text, date));
            });
        });

        that.redrawMessages();
        window.clearTimeout(timeout);
        var now = new Date();
        that.setStatus('Last updated ' + ('00' + now.getHours()).slice(-2) + ':' +
                                         ('00' + now.getMinutes()).slice(-2) + ':' +
                                         ('00' + now.getSeconds()).slice(-2));

        $(that.messageField).animate({scrollTop: parseInt(that.messageField.scrollHeight)}, 300);
    }, 'xml');
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.showMessage = function(message) {
    var element = document.createElement('div');
    element.className = 'message';

    var writer = document.createElement('span');
    writer.className = 'writer';
    $(writer).text(message.getWriter());
    element.appendChild(writer);

    var text = document.createElement('p');
    text.className = 'text';
    $(text).text(message.getHtmlText());
    element.appendChild(text);

    var date = document.createElement('span');
    date.className = 'date';
    date.innerHTML = message.getDateText();
    date.onclick = function() {
        var day = message.getDate().getDate();
        var month = message.getDate().getMonth() + 1;
        var year = message.getDate().getFullYear();
        alert('Posted the ' + day + '/' + month + '-' + year + ' at ' +
            ('00' + message.getDate().getHours()).slice(-2) + ':' +
            ('00' + message.getDate().getMinutes()).slice(-2) + ':' +
            ('00' + message.getDate().getSeconds()).slice(-2));
    };
    element.appendChild(date);

    this.messageField.appendChild(element);
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.redrawMessages = function() {
    this.messageField.innerHTML = '';

    for (var i = 0; i < this.messages.length; i++) {
        this.showMessage(this.messages[i]);
    }
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.postMessage = function() {
    var that = this;

    var text = that.textarea.value;
    that.textarea.value = '';

    var timeout = window.setTimeout(function() {
        that.setStatusLoading();

        var message = new RWWM.applications.labbymezzage.Message(that.getAlias(), text, new Date());
        that.messages.push(message);
        that.showMessage(message);

        $(that.messageField).animate({scrollTop: parseInt(that.messageField.scrollHeight)}, 300);
    }, 100);

    $.post('http://homepage.lnu.se/staff/tstjo/labbyserver/setMessage.php',
           {username: this.getAlias(), text: text}, function() {
        window.clearTimeout(timeout);
        that.update();
    });
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.onclose = function() {
    if (this.interval) {
        window.clearInterval(this.interval);
    }
};

RWWM.launcher.add('Labby Mezzage', 'applications/labbymezzage/icon.png', RWWM.applications.labbymezzage.LabbyMessage);