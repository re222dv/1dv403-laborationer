"use strict"

var RWWM = RWWM || {};

RWWM.windows = {
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

RWWM.Window = function(width, height, title, icon) {
    var that = this;

    this.container = document.createElement("div");
    var decorator = document.createElement("div");
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
    close.onclick = function() {that.close()};
    $(title_e).text(title);
    icon_e.setAttribute("src", icon);

    decorator.appendChild(close);
    decorator.appendChild(title_e);
    decorator.appendChild(icon_e);

    this.view.className = "view";
    this.statusbar.className = "statusbar";

    this.container.appendChild(decorator);
    this.container.appendChild(this.view);
    this.container.appendChild(this.statusbar);

    RWWM.root.appendChild(this.container);
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

    this.container.parentNode.removeChild(this.container);
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