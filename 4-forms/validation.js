"use strict"

function ValidatedForm(id) {
    var form = document.getElementById(id);

    for (var i = 0; i < form.children.length; i++) {
        var element = form.children[i];
        if (element.tagName === 'INPUT') {
            if (element.getAttribute('type') === 'text') {
                element.onblur = this.textField;
            } else if (element.getAttribute('type') === 'number') {
                element.onblur = this.postcodeField;
            } else if (element.getAttribute('type') === 'email') {
                element.onblur = this.emailField;
            }
        }
    }
}

ValidatedForm.prototype.textField = function() {
    if (this.value === '') {
        this.className = 'bad';
    } else {
        this.className = 'good';
    }
};

ValidatedForm.prototype.postcodeField = function() {
    if (this.value.match(/\d\d\d\d\d/) == null) {
        this.className = 'bad';
    } else {
        this.className = 'good';
    }
};

ValidatedForm.prototype.emailField = function() {
    // Email addresses are ugly and not very useful therefore this regex is collected from
    // http://www.regular-expressions.info/email.html
    // It won't match every valid email address in the world but it's certainly better than most sites.
    var emailRegex = new RegExp('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
                                '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?');
    if (this.value.match(emailRegex) == null) {
        this.className = 'bad';
    } else {
        this.className = 'good';
    }
};

window.onload = function() {
    new ValidatedForm('form');
};