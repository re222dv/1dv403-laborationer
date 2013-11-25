"use strict"

function Message(message, date) {

    this.getText = function() {
        return message;
    };

    this.setText = function(value) {
        message = value;
    };

    this.getDate = function() {
        return date;
    };

    this.setDate = function(value) {
        date = value;
    };
}

Message.prototype.toString = function() {
    return this.getText() + ' (' + this.getDate() + ')';
};

Message.prototype.getHtmlText = function() {
    return this.getText().replace(/\n/g, '<br />');
};

Message.prototype.getDateText = function() {
    var hours = this.getDate().getHours();
    var minutes = this.getDate().getMinutes();
    var seconds = this.getDate().getSeconds();
    return hours + ':' + minutes + ':' + seconds;
};

function LabbyMessage(id) {
    var self = this;
    var messages = [];

    var button = document.querySelector('#' + id + ' button');
    var counter = document.querySelector('#' + id + ' .counter');
    var messageField = document.querySelector('#' + id + ' .messages');
    var textarea = document.querySelector('#' + id + ' textarea');

    button.onclick = function() {
        var message = new Message(textarea.value, new Date());
        messages.push(message);

        self.showMessage(message);
    };

    this.updateCounter = function() {
        counter.innerHTML = 'Antal meddelanden: ' + messages.length;
    };

    this.showMessage = function(message) {
        var element = document.createElement('div');
        element.className = 'message';

        var close = document.createElement('span');
        close.className = 'close';
        close.innerHTML = 'x';
        close.onclick = function() {
            var index = messages.indexOf(message);
            if (index > -1) {
                messages.splice(index, 1);
            }
            self.redrawMessages();
        };
        element.appendChild(close);

        var date = document.createElement('p');
        date.className = 'date';
        date.innerHTML = message.getDateText();
        element.appendChild(date);

        var text = document.createElement('p');
        text.className = 'text';
        text.innerHTML = message.getHtmlText();
        element.appendChild(text);

        messageField.appendChild(element);

        self.updateCounter();
    };

    this.redrawMessages = function() {
        messageField.innerHTML = '';

        for (var i = 0; i < messages.length; i++) {
            self.showMessage(messages[i]);
        }

        self.updateCounter();
    };

    self.updateCounter();
}

window.onload = function() {
    new LabbyMessage('messageboard');
};