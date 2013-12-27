"use strict"

var RWWM = RWWM || {};

function RWWM.Window(width, height, title, icon) {
    var container = document.createElement("div");
    var decorator = document.createElement("div");
    this.view = document.createElement("div");
    var status = document.createElement("p");

    var close = document.createElement("button");
    var title_e = document.createElement("span");
    var icon_e = document.createElement("img");

    $(title_e).text(title);
    icon_e.setAttribute("src", icon);

    decorator.appendChild(close);
    decorator.appendChild(title_e);
    decorator.appendChild(icon_e);

    container.appendChild(decorator);
    container.appendChild(this.view);
    container.appendChild(status);
}

function RWWM.init() {

}

window.onload = RWWM.init;