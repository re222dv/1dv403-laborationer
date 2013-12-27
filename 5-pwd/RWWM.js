"use strict"

var RWWM = RWWM || {};

RWWM.Window = function(width, height, title, icon) {
    var container = document.createElement("div");
    var decorator = document.createElement("div");
    this.view = document.createElement("div");
    var statusbar = document.createElement("p");

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
    statusbar.className = "statusbar";

    container.appendChild(decorator);
    container.appendChild(this.view);
    container.appendChild(statusbar);

    RWWM.root.appendChild(container);
};

RWWM.init = function() {
    RWWM.root = document.getElementById("RWWM");

    new RWWM.Window(300, 400, "Test", "");
};

window.onload = RWWM.init;