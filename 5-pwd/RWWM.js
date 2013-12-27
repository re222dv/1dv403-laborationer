"use strict"

var RWWM = RWWM || {};

RWWM.Window = function(width, height, title, icon) {
    var container = document.createElement("div");
    var decorator = document.createElement("div");
    this.view = document.createElement("div");
    this.statusbar = document.createElement("p");

    container.className = "window";
    container.style.width = width + 'px';
    container.style.height = height + 'px';

    decorator.className = "decorator";
    var close = document.createElement("button");
    var title_e = document.createElement("span");
    var icon_e = document.createElement("img");

    close.innerHTML = '&#x2715;';
    $(title_e).text(title);
    icon_e.setAttribute("src", icon);

    decorator.appendChild(close);
    decorator.appendChild(title_e);
    decorator.appendChild(icon_e);

    this.view.className = "view";
    this.statusbar.className = "statusbar";

    container.appendChild(decorator);
    container.appendChild(this.view);
    container.appendChild(this.statusbar);

    RWWM.root.appendChild(container);
};

RWWM.Window.prototype.setStatus = function(status) {
    this.statusbar.innerHTML = status;
};

RWWM.Window.prototype.setStatusLoading = function() {
    this.setStatus('<img src="pics/loading.gif" /> Loading')
};

RWWM.init = function() {
    RWWM.root = document.getElementById("RWWM");

    var t = new RWWM.Window(300, 400, "Test", "");
    t.setStatus('test')
};

window.onload = RWWM.init;