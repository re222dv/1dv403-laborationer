'use strict';

var RWWM = RWWM || {};

RWWM.launcher = {
    launcher: document.createElement('div'),
    items: {},
    width: 59,

    init: function() {
        this.launcher.className = 'launcher';
        RWWM.root.appendChild(this.launcher);
    },
    add: function(name, icon, Constructor, color) {
        var button = document.createElement('div');
        var icon_e = document.createElement('img');
        icon_e.setAttribute('src', icon);
        button.appendChild(icon_e);
        button.onclick = function(event) {
            if (event.target === this.firstChild) {
                var item = RWWM.launcher.items[name];

                if (item.windows.length < 1) {
                    new Constructor();
                } else {
                    if (item.last === RWWM.windows.open[RWWM.windows.open.length-1] &&
                        item.last.container.style.display !== 'none') {
                        new Constructor();
                    } else {
                        item.last.focus();
                    }
                }
            }
        };

        var dots = document.createElement('div');
        dots.className = 'dots';
        button.appendChild(dots);

        var focus = document.createElement('span');
        focus.className = 'focus';
        button.appendChild(focus);

        var tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        var ul = document.createElement('ul');

        tooltip.appendChild(ul);
        button.appendChild(tooltip);
        this.launcher.appendChild(button);

        this.items[name] = {
            button: button,
            color: color,
            Constructor: Constructor,
            dots: dots,
            last: null,
            tooltip: ul,
            windows: []
        };

        this.drawTooltip(name);
    },

    drawTooltip: function(name) {
        var item = this.items[name];

        item.tooltip.innerHTML = '';

        var li = document.createElement('li');
        li.innerHTML = name;
        li.onclick = function() {
            new item.Constructor();
        };
        item.tooltip.appendChild(li);

        if (RWWM.launcher.items[name].windows.length > 0) {
            item.tooltip.appendChild(document.createElement('hr'));

            RWWM.launcher.items[name].windows.forEach(function(window) {
                var li = document.createElement('li');
                $(li).text(window.title);
                li.onclick = function() {
                    window.focus.call(window);
                    this.onmouseout();
                };
                li.onmouseover = function() {
                    window.container.classList.add('show');
                    $('.window').addClass('fade');
                };
                li.onmouseout = function() {
                    $('.fade').removeClass('fade');
                    window.container.classList.remove('show');
                };
                item.tooltip.appendChild(li);
            });

            switch (RWWM.launcher.items[name].windows.length) {
                case 1:
                    item.dots.className = 'dots one';
                    item.dots.innerHTML = '<p></p>';
                    break;
                case 2:
                    item.dots.className = 'dots two';
                    item.dots.innerHTML = '<p></p><p></p>';
                    break;
                default :
                    item.dots.className = 'dots three';
                    item.dots.innerHTML = '<p></p><p></p><p></p>';
                    break;
            }
            item.button.style.backgroundColor = item.color;
        } else {
            item.dots.className = 'dots';
            item.dots.innerHTML = '';
            item.button.style.backgroundColor = 'transparent';
        }
    }
};

RWWM.windows = {
    open: [],

    top: 0,
    left: RWWM.launcher.width,

    getTop: function(height) {
        height += 75;

        if (this.top + height > $(RWWM.root).height()) {
            this.top = 1;
        }

        this.top += 15;

        return (this.top - 15) + 'px';
    },

    getLeft: function(width) {
        width += 8;

        if (this.left + width > $(RWWM.root).width()) {
            this.left = RWWM.launcher.width;
        }

        this.left += 15;

        return (this.left - 15) + 'px';
    }
};

RWWM.Window = function(name, width, height, title, icon, menu, resizeable) {
    menu = menu || {
        'File': {'Close': this.close}
    };
    resizeable = resizeable !== undefined ? resizeable : true;

    var that = this;

    this.name = name;
    this.title = title;
    this.resizeable = resizeable;

    this.container = document.createElement('div');
    var decorator = document.createElement('div');
    this.menubar = document.createElement('ul');
    this.view = document.createElement('div');
    this.statusbar = document.createElement('p');

    this.container.className = 'window';
    this.container.style.top = RWWM.windows.getTop(height);
    this.container.style.left = RWWM.windows.getLeft(width);
    this.setSize(width, height);

    decorator.className = 'decorator';
    decorator.onmousedown = function(event) {
        var y = event.clientY - that.container.offsetTop;
        var x = event.clientX - that.container.offsetLeft;

        document.body.onmousemove = function(event) {
            that.move.call(that, event, y, x);
        };
    };
    document.body.addEventListener('mouseup', function() {
        document.body.onmousemove = null;
    }, true);

    var close = document.createElement('button');
    var minimize = document.createElement('button');
    this.title_e = document.createElement('span');
    var icon_e = document.createElement('img');

    close.className = 'close';
    close.onclick = function(e) {that.close(); e.stopPropagation()};
    close.onmousedown = function(e) {e.stopPropagation()};

    minimize.className = 'minimize';
    minimize.onclick = function(e) {that.minimize(); e.stopPropagation()};
    minimize.onmousedown = function(e) {e.stopPropagation()};

    this.setTitle(title);

    icon_e.setAttribute('src', icon);

    if (resizeable) {
        this.container.classList.add('resizeable');
        this.title_e.classList.add('threeButtons');

        var maximize = document.createElement('button');

        maximize.className = 'maximize';
        maximize.onclick = function(e) {that.maximize(); e.stopPropagation()};
        maximize.onmousedown = function(e) {e.stopPropagation()};

        decorator.appendChild(maximize);

        var handle = document.createElement('div');
        handle.className = 'handle';
        handle.onmousedown = function() {
            document.body.onmousemove = function(event) {
                that.resize.call(that, event);
            };
            return false;
        };
        this.container.appendChild(handle);
    }

    decorator.appendChild(close);
    decorator.appendChild(minimize);
    decorator.appendChild(this.title_e);
    decorator.appendChild(icon_e);

    this.view.className = 'view';
    this.statusbar.className = 'statusbar';

    this.container.appendChild(decorator);

    this.menubar.className = 'menubar';
    this.renderMenu(menu);
    this.container.appendChild(this.menubar);

    this.container.appendChild(this.view);
    this.container.appendChild(this.statusbar);

    RWWM.root.appendChild(this.container);

    if (RWWM.launcher.items[name]) {
        RWWM.launcher.items[name].last = this;
        RWWM.launcher.items[name].windows.push(this);

        RWWM.launcher.drawTooltip(name);
    }

    RWWM.windows.open.push(this);
    this.container.style.zIndex = RWWM.windows.open.length;
    $('.launcher > .focus').removeClass('focus');
    if (RWWM.launcher.items[this.name] && RWWM.launcher.items[this.name].button) {
        RWWM.launcher.items[this.name].button.classList.add('focus');
    }

    this.container.addEventListener('mousedown', function() {return that.focus()}, true);
};

RWWM.Window.prototype.setSize = function(width, height) {
    width += 8;
    height += 75;

    var top = parseInt(this.container.style.top);
    var left = parseInt(this.container.style.left);

    if (top + height > $(RWWM.root).height()) {
        top = top - ((top + height) - $(RWWM.root).height());
        top = top < 0 ? 0 : top;
        this.container.style.top = top + 'px'
    }

    if (left + width > $(RWWM.root).width()) {
        left = left - ((left + width) - $(RWWM.root).width());
        left = left < RWWM.launcher.width ? RWWM.launcher.width : left;
        this.container.style.left = left + 'px';
    }

    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';
};

RWWM.Window.prototype.setStatus = function(status) {
    this.statusbar.innerHTML = status;
};

RWWM.Window.prototype.setStatusLoading = function() {
    this.setStatus('<img src="pics/loading.gif" /> Loading')
};

RWWM.Window.prototype.setTitle = function(title) {
    this.title = title;
    $(this.title_e).text(title);

    RWWM.launcher.drawTooltip(this.name);
};

RWWM.Window.prototype.close = function() {
    if (this.onclose) {
        this.onclose();
    }

    var index = RWWM.windows.open.indexOf(this);
    if (index > -1) {
        RWWM.windows.open.splice(index, 1);
    }

    if (RWWM.launcher.items[this.name]) {
        if (RWWM.launcher.items[this.name].button) {
            RWWM.launcher.items[this.name].button.classList.remove('focus');
        }

        index = RWWM.launcher.items[this.name].windows.indexOf(this);

        if (index > -1) {
            RWWM.launcher.items[this.name].windows.splice(index, 1);
        }

        RWWM.launcher.drawTooltip(this.name);
    }

    if (RWWM.windows.open.length > 0) {
        var next = RWWM.windows.open[RWWM.windows.open.length - 1];

        if (RWWM.launcher.items[next.name] && RWWM.launcher.items[next.name].button) {
            RWWM.launcher.items[next.name].button.classList.add('focus');
        }
    }

    this.container.parentNode.removeChild(this.container);
};

RWWM.Window.prototype.maximize = function() {
    if (this.resizeable) {
        var that = this;

        this.container.classList.add('animate');
        this.container.classList.toggle('maximized');
        window.setTimeout(function() {
            that.container.classList.remove('animate');

            if (that.onresize) {
                that.onresize();
            }
        }, 100);
    }
};

RWWM.Window.prototype.minimize = function() {
    $(this.container).hide(300);
};

RWWM.Window.prototype.unminimize = function() {
    $(this.container).show(300);
};

RWWM.Window.prototype.move = function(event, y, x) {
    var top = event.clientY - y;
    var left = event.clientX - x;

    var width = $(this.container).width();
    var height = $(this.container).height();

    if (top + height > $(RWWM.root).height()) {
        top = top - ((top + height) - $(RWWM.root).height());
    }

    if (left + width > $(RWWM.root).width()) {
        left = left - ((left + width) - $(RWWM.root).width());
    }

    top = top < 0 ? 0 : top;
    left = left < RWWM.launcher.width ? RWWM.launcher.width : left;

    this.container.style.top = top + 'px';
    this.container.style.left = left + 'px';
};

RWWM.Window.prototype.resize = function(event) {
    var width = event.clientX - this.container.offsetLeft;
    var height = event.clientY - this.container.offsetTop;

    width = width < 200 ? 200 : width;
    height = height < 200 ? 200 : height;

    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';

    if (this.onresize) {
        this.onresize();
    }
};

RWWM.Window.prototype.focus = function() {
    this.unminimize();

    $('.launcher > .focus').removeClass('focus');

    if (RWWM.launcher.items[this.name]) {
        if (RWWM.launcher.items[this.name].button) {
            RWWM.launcher.items[this.name].button.classList.add('focus');
        }
        if (RWWM.launcher.items[this.name].last) {
            RWWM.launcher.items[this.name].last = this;
        }
    }

    var index = RWWM.windows.open.indexOf(this);

    if (index != RWWM.windows.open.length - 1) {
        if (index > -1) {
            RWWM.windows.open.splice(index, 1);
        }

        RWWM.windows.open.push(this);

        for (var i = 0; i < RWWM.windows.open.length; i++) {
            RWWM.windows.open[i].container.style.zIndex = i;
        }

        return false;
    }

    return true;
};

RWWM.Window.prototype.renderUl = function(ul, menu) {
    var that = this;

    var sub = undefined;

    for (var key in menu) {
        if (!menu.hasOwnProperty(key)) {
            continue;
        }

        var value = menu[key];

        var li = document.createElement('li');
        var a = document.createElement('a');
        $(a).text(key);

        li.appendChild(a);

        if (typeof(value) === 'function') {
            li.onclick = (function(value){return function() {value.call(that)}}(value));
        } else if (value instanceof Array) {
            a.className = 'option';
            var options = value[0];
            value.splice(0, 1);

            sub = document.createElement('ul');

            (function(value, options, sub) { // Create a new scope for the loop so value, options and sub keeps its values
                value.forEach(function(data) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    $(a).text(data);

                    li.appendChild(a);

                    if (data === options.selected) {
                        li.className = 'selected';
                    }

                    li.onclick = function() {
                        if (li.className !== 'selected') {
                            options.onchange.call(that, data);
                            sub.querySelector('.selected').className = '';
                            li.className = 'selected';
                        }
                    };

                    sub.appendChild(li);
                });
            }(value, options, sub));

            li.appendChild(sub);

        } else if (typeof(value) === 'object') {
            a.className = 'sub';
            sub = document.createElement('ul');
            li.appendChild(this.renderUl(sub, value));
        }

        ul.appendChild(li);
    }

    return ul;
};

RWWM.Window.prototype.renderMenu = function(menu) {
    this.menubar.innerHTML = '';

    this.renderUl(this.menubar, menu);
};

RWWM.setSize = function(width, height) {
    RWWM.root.style.width = width + 'px';
    RWWM.root.style.height = height + 'px';

    if (height < $(RWWM.root.parentNode).height()) {
        RWWM.root.style.top = ($(RWWM.root.parentNode).height() - height) / 2 + 'px';
    }

    if (width < $(RWWM.root.parentNode).width()) {
        RWWM.root.style.left = ($(RWWM.root.parentNode).width() - width) / 2 + 'px';
    }
};

RWWM.init = function() {
    RWWM.root = document.getElementById('RWWM');

    RWWM.launcher.init();
};

window.onload = RWWM.init;