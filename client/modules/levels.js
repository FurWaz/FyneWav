let volumeLVL = document.getElementById("lvl-volume-fill");
let processorLVL = document.getElementById("lvl-processor-fill");

setInterval(() => {
    volumeLVL.style.height = (100-engine.getVolume())+"%";
    processorLVL.style.height = (100-engine.getProcessor())+"%";
}, 33);