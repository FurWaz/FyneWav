class Position {
    /**
     * Position's constructor
     * @param {Number} x The X coordonate of the Position
     * @param {Number} y The Y coordonate of the Position
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Returns the absolute distance between [this] and [p]
     * @param {Position} p The targeted Position
     * @returns {Number} The absolute distance between [this] and [p]
     */
    dist(p) {
        return Math.sqrt( Math.pow(this.x-p.x, 2) + Math.pow(this.y-p.y, 2) );
    }
}

function addButton(container, text, callback, style) {
    let btn = document.createElement("button");
    if (style) {
        style.split(" ").forEach(s => {
            btn.classList.add(s);
        });
    }
    btn.innerHTML = text;
    btn.onclick = callback;
    container.appendChild(btn);
    return btn;
}

function addLabel(container, text, style) {
    let lbl = document.createElement("p");
    if (style) {
        style.split(" ").forEach(s => {
            lbl.classList.add(s);
        });
    }
    lbl.innerHTML = text;
    container.appendChild(lbl);
    return lbl;
}

function addTitle(container, text, style) {
    let ttl = document.createElement("h2");
    if (style) {
        style.split(" ").forEach(s => {
            ttl.classList.add(s);
        });
    }
    ttl.innerHTML = text;
    container.appendChild(ttl);
    return ttl;
}

function addSeparatorTitle(container, text, style) {
    let ttl = document.createElement("h3");
    if (style) {
        style.split(" ").forEach(s => {
            ttl.classList.add(s);
        });
    }
    ttl.innerHTML = text;
    container.appendChild(ttl);
    return ttl;
}

function addListBlock(container, style) {
    let list = document.createElement("div");
    list.classList.add("listblock");
    if (style) {
        style.split(" ").forEach(s => {
            list.classList.add(s);
        });
    }
    container.appendChild(list);
    return list;
}

function addListElement(container, text, style) {
    let el = document.createElement("p");
    el.classList.add("listelement");
    el.innerHTML = text;
    if (style) {
        style.split(" ").forEach(s => {
            el.classList.add(s);
        });
    }
    container.appendChild(el);
    return el;
}

function addRemovableListElement(container, text, index, list, style) {
    let el = document.createElement("p");
    let dv = document.createElement("div");
    let dv2 = document.createElement("div");
    let cont = document.createElement("div");
    cont.classList.add("listelement");
    dv.classList.add("align-y");
    dv2.classList.add("align-y");
    el.innerHTML = text;
    if (style) {
        style.split(" ").forEach(s => {
            cont.classList.add(s);
        });
    }
    dv.appendChild(el);
    cont.appendChild(dv);
    container.appendChild(cont);
    addDiv(cont, "spread-x");
    addButton(dv2, "X", ()=>{
        list.splice(index, 1);
        cont.remove();
    }, "text-red");
    cont.appendChild(dv2);
    return el;
}

function addDiv(container, style) {
    let dv = document.createElement("div");
    if (style) {
        style.split(" ").forEach(s => {
            dv.classList.add(s);
        });
    }
    container.appendChild(dv);
    return dv;
}

function addYSeparator(container, style) {
    let s = document.createElement("div");
    s.classList.add('separator-y');
    container.appendChild(s);
    return s;
}

function addXSeparator(container, style) {
    let s = document.createElement("div");
    s.classList.add('separator-x');
    container.appendChild(s);
    return s;
}

function addYArranger(container, style) {
    let s = document.createElement("div");
    s.classList.add('arranger-y');
    container.appendChild(s);
    return s;
}

function addXArranger(container, style) {
    let s = document.createElement("div");
    s.classList.add('arranger-x');
    container.appendChild(s);
    return s;
}