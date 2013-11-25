"use strict"

function Message(message, date) {

    this.getText = function() {
        return message;
    }

    this.setText = function (value) {
        message = value;
    }

    this.getDate = function () {
        return date;
    }

    this.setDate = function (value) {
        date = value;
    }
}

Message.prototype.toString = function() {
    return this.getText() + ' (' + this.getDate() + ')';
}

Message.prototype.getHtmlText = function () {
    return this.getText().replace(/\n/g, '<br />');
}

Message.prototype.getDateText = function () {
    return this.getDate();
}

function LabbyMessage(id) {
    var messages = [];

    var button = document.querySelector('#' + id + ' button');
    var textarea = document.querySelector('#' + id + ' textarea');

    button.onclick = function() {
        var message = new Message(textarea.value, new Date());
        messages.push(message);
    };
}

window.onload = function () {
    new LabbyMessage('messageboard');
}