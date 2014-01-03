"use strict";

var RWWM = RWWM || {};

RWWM.windows = {
    open: [],

    top: 1,
    left: 53,

    getTop: function(height) {

        if (this.top + height > innerHeight) {
            this.top = 1;
        }

        this.top += 15;

        return (this.top - 15) + 'px';
    },

    getLeft: function(width) {

        if (this.left + width > innerWidth) {
            this.left = 53;
        }

        this.left += 15;

        return (this.left - 15) + 'px';
    }
};

RWWM.Window = function(width, height, title, icon, menu) {
    menu = menu || {
        'File': {'Close': this.close}
    };

    var that = this;
    width += 4;
    height += 50;

    this.container = document.createElement("div");
    var decorator = document.createElement("div");
    this.menubar = document.createElement("ul");
    this.view = document.createElement("div");
    this.statusbar = document.createElement("p");

    this.container.className = "window";
    this.container.style.top = RWWM.windows.getTop(height);
    this.container.style.left = RWWM.windows.getLeft(width);
    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';

    decorator.className = "decorator";
    var close = document.createElement("button");
    var title_e = document.createElement("span");
    var icon_e = document.createElement("img");

    close.innerHTML = '&#x2715;';
    close.onclick = function(e) {that.close(); e.stopPropagation()};
    $(title_e).text(title);
    icon_e.setAttribute("src", icon);

    decorator.appendChild(close);
    decorator.appendChild(title_e);
    decorator.appendChild(icon_e);

    this.view.className = "view";
    this.statusbar.className = "statusbar";

    this.container.appendChild(decorator);

    this.menubar.className = "menubar";
    this.renderMenu(menu);
    this.container.appendChild(this.menubar);

    this.container.appendChild(this.view);
    this.container.appendChild(this.statusbar);

    RWWM.root.appendChild(this.container);

    RWWM.windows.open.push(this);
    this.container.style.zIndex = RWWM.windows.open.length;
    this.container.onclick = function() {that.focus()};
};

RWWM.Window.prototype.setStatus = function(status) {
    this.statusbar.innerHTML = status;
};

RWWM.Window.prototype.setStatusLoading = function() {
    this.setStatus('<img src="pics/loading.gif" /> Loading')
};

RWWM.Window.prototype.close = function() {
    if (this.onclose) {
        this.onclose();
    }

    var index = RWWM.windows.open.indexOf(this);
    if (index > -1) {
        RWWM.windows.open.splice(index, 1);
    }

    this.container.parentNode.removeChild(this.container);
};

RWWM.Window.prototype.focus = function() {
    var index = RWWM.windows.open.indexOf(this);
    if (index > -1) {
        RWWM.windows.open.splice(index, 1);
    }

    RWWM.windows.open.push(this);

    for (var i = 0; i < RWWM.windows.open.length; i++) {
        RWWM.windows.open[i].container.style.zIndex = i;
    }
};

RWWM.Window.prototype.renderUl = function(ul, menu) {
    var that = this;

    for (var key in menu) {
        if (!menu.hasOwnProperty(key)) {
            continue;
        }

        var value = menu[key];

        var li = document.createElement('li');
        var a = document.createElement('a');
        $(a).text(key);

        li.appendChild(a);

        if (typeof(value) == "function") {
            a.onclick = function() {value.call(that)};
        } else if (typeof(value) == "object") {
            a.className = 'sub';
            var u = document.createElement('ul');
            li.appendChild(this.renderUl(u, value));
        }

        ul.appendChild(li);
    }

    return ul;
};

RWWM.Window.prototype.renderMenu = function(menu) {
    this.menubar.innerHTML = '';

    this.renderUl(this.menubar, menu);
};

RWWM.launcher = {
    launcher: document.createElement("div"),

    init: function() {
        this.launcher.className = "launcher";
        RWWM.root.appendChild(this.launcher);
    },
    add: function(name, icon, Constructor, kwargs) {
        kwargs = kwargs || {};

        var button = document.createElement("button");
        var icon_e = document.createElement("img");
        icon_e.setAttribute("src", icon);
        icon_e.setAttribute("title", name);
        button.appendChild(icon_e);
        button.onclick = function() {
            new Constructor(kwargs);
        };
        this.launcher.appendChild(button);
    }
};

RWWM.init = function() {
    RWWM.root = document.getElementById("RWWM");

    RWWM.launcher.init();
};

window.onload = RWWM.init;