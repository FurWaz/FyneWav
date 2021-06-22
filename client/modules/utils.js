class Position {
    /**
     * Position's constructor
     * @param {Number} x The X coordonate of the Position
     * @param {Number} y The Y coordonate of the Position
     */
    constructor(x, y) {
        this.x = (x == null)? 0: x;
        this.y = (y == null)? 0: y;
    }
    /**
     * Returns the absolute distance between [this] and [p]
     * @param {Position} p The targeted Position
     * @returns {Number} The absolute distance between [this] and [p]
     */
    dist(p) {
        return Math.sqrt( Math.pow(this.x-p.x, 2) + Math.pow(this.y-p.y, 2) );
    }
    /**
     * Returns the result of [this] - [p]
     * @param {Position} p The target Position
     * @returns {Number} The result of [this] - [p]
     */
    minus(p) {
        return new Position( this.x - p.x, this.y - p.y );
    }
    /**
     * Returns the result of [this] + [p]
     * @param {Position} p The target Position
     * @returns {Number} The result of [this] + [p]
     */
    plus(p) {
        return new Position( this.x + p.x, this.y + p.y );
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
    container.insertBefore(el, container.firstChild);
    return el;
}

function addRemovableListElement(container, text, index, list, style) {
    let el = document.createElement("input");
    let dv = document.createElement("div");
    let dv2 = document.createElement("div");
    let cont = document.createElement("div");
    console.log("list", list);
    cont.classList.add("listelement");
    dv.classList.add("align-y");
    dv2.classList.add("align-y");
    el.value = text;
    if (style) {
        style.split(" ").forEach(s => {
            cont.classList.add(s);
        });
    }
    el.onkeyup = () => {
        list[index] = el.value;
    };
    dv.appendChild(el);
    let dv3 = addDiv(cont, "spread-x");
    dv3.appendChild(dv);
    cont.appendChild(dv3);
    container.insertBefore(cont, container.firstChild);
    addButton(dv2, "X", ()=>{
        list[index] = null;
        cont.remove();
    }, "text-red");
    cont.appendChild(dv2);
    return cont;
}

function addPlusListElement(container, callback, style) {
    let cont = document.createElement("div");
    let dv = document.createElement("div");
    let btn = document.createElement("button");
    cont.classList.add("listelement");
    cont.style.cursor = "pointer";
    dv.classList.add("align-x");
    btn.classList.add("text-green");
    btn.innerHTML = "+";
    if (style) {
        style.split(" ").forEach(s => {
            cont.classList.add(s);
        });
    }
    cont.onclick = callback;
    dv.appendChild(btn);
    cont.appendChild(dv);
    container.insertBefore(cont, container.firstChild);
    return cont;
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

function clearDiv(container) {
    while(container.firstChild)
        container.firstChild.remove();
}