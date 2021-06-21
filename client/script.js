const FILE_EXPAND_CURSOR = "file-expand";
const ARRANGER_EXPAND_CURSOR = "arranger-expand";
const RACKS_EXPAND_CURSOR = "racks-expand";

var expandZone = null;

window.addEventListener("keydown", ev => {
    console.log("pressed: "+ev.key);
});

window.addEventListener("mousedown", ev => {
    if (ev.target.id == FILE_EXPAND_CURSOR) 
        expandZone = FILE_EXPAND_CURSOR;
    if (ev.target.id == ARRANGER_EXPAND_CURSOR) 
        expandZone = ARRANGER_EXPAND_CURSOR;
    if (ev.target.id == RACKS_EXPAND_CURSOR) 
        expandZone = RACKS_EXPAND_CURSOR;
    if (dropMenu.showing && !dropMenu.hitbox(new Position(ev.x, ev.y))) {
        dropMenu.hide();
    }
});

window.addEventListener("mouseup", ev => {
    if (expandZone != null) config.saveConfig();
    expandZone = null;
});

window.addEventListener("mousemove", ev => {
    if (expandZone != null) {
        switch (expandZone) {
            case FILE_EXPAND_CURSOR:
                let f_size = document.getElementById("content").getBoundingClientRect();
                let f_percent = (ev.x - f_size.x)*100 / f_size.width;
                document.getElementById("file-explorer").style.width = f_percent+"%";
                break;
            case ARRANGER_EXPAND_CURSOR:
                let a_size = document.getElementById("creation-zone").getBoundingClientRect();
                let a_percent = (ev.y - a_size.y)*100 / a_size.height;
                document.getElementById("arranger").style.height = a_percent+"%";
                break;
            case RACKS_EXPAND_CURSOR:
                let r_size = document.getElementById("tweak-zone").getBoundingClientRect();
                let r_percent = (ev.x - r_size.x)*100 / r_size.width;
                document.getElementById("racks").style.width = r_percent+"%";
                break;
        
            default:
                break;
        }
    }
});

document.getElementById("content").style.maxHeight =
    "calc( 100% - "+document.getElementById("menubar").getBoundingClientRect().height+"px );";

window.addEventListener("resize", ev => {
    console.log(window.innerWidth+", "+window.innerHeight);
});