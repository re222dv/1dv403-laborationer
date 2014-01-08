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
    var hours = ("0" + this.getDate().getHours()).slice(-2);
    var minutes = ("0" + this.getDate().getMinutes()).slice(-2);
    var seconds = ("0" + this.getDate().getSeconds()).slice(-2);
    return hours + ':' + minutes + ':' + seconds;
};

RWWM.applications.labbymezzage.LabbyMessage = function() {
    var that = this;
    RWWM.Window.call(this, 400, 500, 'Labby Message', 'applications/labbymezzage/icon.png', {
        'File': {'Close': this.close},
        'Edit': {
            'Update': this.update,
            'Interval': [{'selected': '10 seconds', 'onchange': this.setInterval}, '10 seconds', '20 seconds', '30 seconds', '1 minute'],
            'Number of Messages': [{'selected': '10', 'onchange': this.setNumMessages}, '10', '30', '50', '100'],
            'Alias': this.setupAlias
        }
    });

    this.container.classList.add('mezzage');

    this.messages = [];
    this.alias = 'Rasmus';

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

    this.setInterval('10 seconds');
    this.setNumMessages('10');
    this.update();
};

RWWM.applications.labbymezzage.LabbyMessage.prototype = Object.create(RWWM.Window.prototype);
RWWM.applications.labbymezzage.LabbyMessage.prototype.constructor = RWWM.applications.labbymezzage.LabbyMessage;

RWWM.applications.labbymezzage.LabbyMessage.prototype.getAlias = function() {
    return this.alias;
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.setupAlias = function() {
    this.alias = prompt('Alias', this.alias);
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.setInterval = function(interval) {
    var that = this;

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
        var months = [ "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September",
            "Oktober", "November", "December" ];
        var day = message.getDate().getDate();
        var month = months[message.getDate().getMonth()];
        var year = message.getDate().getFullYear();
        alert('Inlägget skapades den ' + day + ' ' + month + ' ' + year + ' klockan ' + message.getDateText());
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
    var message = new RWWM.applications.labbymezzage.Message(this.getAlias(), this.textarea.value, new Date());
    this.messages.push(message);

    this.showMessage(message);
    this.textarea.value = '';
};

RWWM.launcher.add('Labby Mezzage', 'applications/labbymezzage/icon.png', RWWM.applications.labbymezzage.LabbyMessage);