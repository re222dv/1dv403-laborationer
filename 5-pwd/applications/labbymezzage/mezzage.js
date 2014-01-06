'use strict';

var RWWM = RWWM || {};
RWWM.applications = RWWM.applications || {};
RWWM.applications.labbymezzage = {};

RWWM.applications.labbymezzage.Message = function(writer, message, date) {

    this.getWriter = function() {
        return writer;
    };

    this.getText = function() {
        return message;
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
        'File': {'Close': this.close}
    });

    this.container.classList.add('mezzage');

    this.messages = [];

    this.messageField = document.createElement('div');
    this.counter = document.createElement('span');
    var write = document.createElement('div');
    this.textarea = document.createElement('textarea');
    var button = document.createElement('button');

    this.messageField.className = 'messages';

    this.counter.className = 'counter';
    this.updateCounter();

    write.className = 'write';
    this.textarea.onkeydown = function(event) {
        if (event.which == 13 || event.keyCode == 13) {
            if (!event.shiftKey) {
                that.postMessage();
                event.preventDefault();
            }
        }
    };

    button.innerHTML = 'Send';
    button.onclick = this.postMessage;

    this.view.appendChild(this.messageField);
    this.view.appendChild(this.counter);
    write.appendChild(this.textarea);
    write.appendChild(button);
    this.view.appendChild(write);
};

RWWM.applications.labbymezzage.LabbyMessage.prototype = Object.create(RWWM.Window.prototype);
RWWM.applications.labbymezzage.LabbyMessage.prototype.constructor = RWWM.applications.labbymezzage.LabbyMessage;

RWWM.applications.labbymezzage.LabbyMessage.prototype.updateCounter = function() {
    this.counter.innerHTML = 'Number of messages: ' + this.messages.length;
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.showMessage = function(message) {
    var element = document.createElement('div');
    element.className = 'message';

    var date = document.createElement('p');
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

    var text = document.createElement('p');
    text.className = 'text';
    $(text).text(message.getHtmlText());
    element.appendChild(text);

    this.messageField.appendChild(element);

    this.updateCounter();
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.redrawMessages = function() {
    this.messageField.innerHTML = '';

    for (var i = 0; i < this.messages.length; i++) {
        this.showMessage(this.messages[i]);
    }

    this.updateCounter();
};

RWWM.applications.labbymezzage.LabbyMessage.prototype.postMessage = function() {
    var message = new RWWM.applications.labbymezzage.Message('', this.textarea.value, new Date());
    this.messages.push(message);

    this.showMessage(message);
    this.textarea.value = '';
};

RWWM.launcher.add('Labby Mezzage', 'applications/labbymezzage/icon.png', RWWM.applications.labbymezzage.LabbyMessage);