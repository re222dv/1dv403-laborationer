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
    return this.getText().replace('\n', '<br />');
}

Message.prototype.getDateText = function () {
    return this.getDate();
}

function LabbyMessage() {
}

window.onload = function () {
}