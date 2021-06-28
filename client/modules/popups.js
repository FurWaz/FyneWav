let popupsContainer = document.getElementById("popups-container");

function openErrorPopup(msg, err) {
    let container = document.createElement("div");
    let popup = document.createElement("div");
    let error = document.createElement("p");
    let buttons = document.createElement("div");
    let btnOK = document.createElement("button");

    container.classList.add("popup-englobe");
    container.classList.add("align-y");
    popup.classList.add("popup-div");
    popup.classList.add("align-x");
    error.classList.add("popup-error");
    error.style.color = "var(--color-red-light)";
    buttons.classList.add("popup-buttons");
    btnOK.classList.add("popup-btn");
    btnOK.classList.add("outline");
    
    msg.split("\n").forEach(m => {
        let message = document.createElement("h3");
        message.classList.add("popup-message");
        if (m.trim().startsWith("http")) {
            message.classList.add("link");
            message.onclick = () => {window.location.href = m;};
        }
        message.innerHTML = m;

        popup.appendChild(message);
    });

    error.innerHTML = err;
    btnOK.innerHTML = "OK";

    btnOK.onclick = () => {
        container.classList.add("disappear");
        setTimeout(() => {
            clearDiv(popupsContainer);
        }, 250);
    }

    popup.appendChild(error);
    popup.appendChild(buttons);
    buttons.appendChild(btnOK);
    container.appendChild(popup);
    popupsContainer.appendChild(container);
}