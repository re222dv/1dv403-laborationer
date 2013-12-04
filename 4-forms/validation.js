"use strict"

if (!HTMLElement.prototype.addNext) {
    HTMLElement.prototype.addNext = function(element) {
        if (this.nextSibling) {
            this.parentNode.insertBefore(element, this.nextSibling);
        } else {
            this.parentNode.appendChild(element);
        }
    }
}

function ValidatedForm(id) {
    var form = document.getElementById(id);
    var modal = form.querySelector('.modal');
    var fields = modal.querySelector('.fields');

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
        } else if (element.tagName === 'BUTTON' && element.className === 'submit') {
            element.onclick = displayModal;
        }
    }

    modal.querySelector('.close').onclick = closeModal;

    function displayModal() {
        fields.innerHTML = '';

        for (var i = 0; i < form.children.length; i++) {
            var element = form.children[i];
            if (element.tagName === 'INPUT') {
                element.onblur();
            }
        }

        for (i = 0; i < form.children.length; i++) {
            element = form.children[i];
            if (element.tagName === 'INPUT') {
                if (element.classList.contains('bad')) {
                    element.focus();
                    return false;
                }

                var label = form.querySelector('label[for="' + element.id + '"]');

                addModalField(label.innerHTML, element.value);
            } else if (element.tagName === 'SELECT') {
                var label = form.querySelector('label[for="' + element.id + '"]');
                var option = element.options[element.selectedIndex];

                addModalField(label.innerHTML, option.innerHTML);
            }
        }

        modal.classList.add('show');
        return false;
    }

    function closeModal() {
        modal.classList.remove('show');
        return false;
    }

    function addModalField(nameText, valueText) {
        var div = document.createElement('div');
        var name = document.createElement('span');
        var value = document.createElement('span');

        var text = document.createTextNode(nameText + ':');
        name.appendChild(text);
        text = document.createTextNode(valueText);
        value.appendChild(text);

        div.appendChild(name);
        div.appendChild(value);
        fields.appendChild(div);
    }
}

ValidatedForm.prototype.textField = function() {
    if (this.value === '') {
        this.className = 'bad';

        if (this.nextSibling.tagName !== 'SPAN') {
            var span = document.createElement('span');
            var text = document.createTextNode('Detta fält får inte lämnas blankt.');
            span.className = 'error';
            span.appendChild(text);
            this.addNext(span);
        }
    } else {
        this.className = 'good';

        if (this.nextSibling.tagName === 'SPAN') {
            this.parentNode.removeChild(this.nextSibling);
        }
    }
};

ValidatedForm.prototype.postcodeField = function() {
    this.value = this.value.replace(/^(SE)? ?(\d\d\d)( |\-)?(\d\d)$/, '$2$4');

    if (this.value.match(/^\d\d\d\d\d$/) == null) {
        this.className = 'bad';

        if (this.nextSibling.tagName !== 'SPAN') {
            var span = document.createElement('span');
            var text = document.createTextNode('Ange ett postnummer i formatet XXXXX.');
            span.className = 'error';
            span.appendChild(text);
            this.addNext(span);
        }
    } else {
        this.className = 'good';

        if (this.nextSibling.tagName === 'SPAN') {
            this.parentNode.removeChild(this.nextSibling);
        }
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

        if (this.nextSibling.tagName !== 'SPAN') {
            var span = document.createElement('span');
            var text = document.createTextNode('Ange en korrekt e-post adress.');
            span.className = 'error';
            span.appendChild(text);
            this.addNext(span);
        }
    } else {
        this.className = 'good';

        if (this.nextSibling.tagName === 'SPAN') {
            this.parentNode.removeChild(this.nextSibling);
        }
    }
};

window.onload = function() {
    new ValidatedForm('form');
};