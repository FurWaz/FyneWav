const FILE_EXPAND_CURSOR = "file-expand";
const ARRANGER_EXPAND_CURSOR = "arranger-expand";
const RACKS_EXPAND_CURSOR = "racks-expand";

var expandZone = null;

window.addEventListener("keydown", ev => {
    console.log("pressed: "+ev.key);
});

window.addEventListener("mousedown", ev => {
    cursor.pos = new Position(ev.x, ev.y);
    if (ev.target.id == FILE_EXPAND_CURSOR) 
        expandZone = FILE_EXPAND_CURSOR;
    if (ev.target.id == ARRANGER_EXPAND_CURSOR) 
        expandZone = ARRANGER_EXPAND_CURSOR;
    if (ev.target.id == RACKS_EXPAND_CURSOR) 
        expandZone = RACKS_EXPAND_CURSOR;
    if (dropMenu.showing && !dropMenu.hitbox(new Position(ev.x, ev.y))) {
        dropMenu.hide();
    }
    cursor._down = true;
});

window.addEventListener("mouseup", ev => {
    cursor.pos = new Position(ev.x, ev.y);
    cursor._down = false;
    cursor.obj = null;
    if (expandZone != null) config.saveConfig();
    expandZone = null;

    if (cursor.obj != null) { // stop dragging something
        if (arranger.hitbox(cursor.pos)) {
            console.log("dragged in arranger");
        }
    }
});

window.addEventListener("mousemove", ev => {
    cursor.pos = new Position(ev.x, ev.y);
    if (cursor._down) { // first movement after click for dragging
        cursor._down = false;
        let file = fileExplorer.findFile(ev.target);
        if (file != null) cursor.obj = file.dom.cloneNode(true);
    }
    if (expandZone != null) {
        switch (expandZone) {
            case FILE_EXPAND_CURSOR:
                let f_size = document.getElementById("content").getBoundingClientRect();
                let f_percent = (ev.x - f_size.x)*100 / f_size.width;
                fileExplorer.dom.style.width = f_percent+"%";
                break;
            case ARRANGER_EXPAND_CURSOR:
                let a_size = document.getElementById("creation-zone").getBoundingClientRect();
                let a_percent = (ev.y - a_size.y)*100 / a_size.height;
                arranger.dom.style.height = a_percent+"%";
                break;
            case RACKS_EXPAND_CURSOR:
                let r_size = document.getElementById("tweak-zone").getBoundingClientRect();
                let r_percent = (ev.x - r_size.x)*100 / r_size.width;
                document.getElementById("racks-container").style.width = r_percent+"%";
                break;
        
            default:
                break;
        }
    }
});

document.getElementById("content").style.maxHeight =
    "calc( 100% - "+document.getElementById("menubar").getBoundingClientRect().height+"px );";