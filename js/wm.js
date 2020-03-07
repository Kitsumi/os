const wm = {
    "element": document.getElementById("windows"),
    "selected": {
        "active": false,
        "element": null,
        "startX": 0,
        "startY": 0,
        "offsetX": 0,
        "offsetY": 0
    },
    "windows": []
};

wm.addWindow = function(options) {
    let opts = {
        "icon": options.icon || "file-fill",
        "title": options.title || "Window",
        "x": options.x || 0,
        "y": options.y || 0,
        "width": options.width || 0,
        "height": options.height || 0
    }

    let mainWindow = document.createElement("div");
    mainWindow.classList.add("window");
    mainWindow.style.top = opts.y + "px";
    mainWindow.style.left = opts.x + "px";
    mainWindow.style.width = opts.width + "px";
    mainWindow.style.height = opts.height + "px";

    let titleBar = document.createElement("div");
    titleBar.classList.add("title-bar");

    let titleBarIcon;
    if (opts.icon.indexOf("/") > -1) {
        titleBarIcon = document.createElement("img");
        titleBarIcon.classList.add("icon");
        titleBarIcon.src = opts.icon;
    } else {
        titleBarIcon = document.createElement("i");
        titleBarIcon.classList.add("icon");
        titleBarIcon.classList.add("ri-" + opts.icon);
    }

    let titleBarTitle = document.createElement("span");
    titleBarTitle.classList.add("title");
    titleBarTitle.innerText = opts.title;

    let minimizeBtn = document.createElement("i");
    minimizeBtn.classList.add("window-btn");
    minimizeBtn.classList.add("ri-subtract-line");

    let closeBtn = document.createElement("i");
    closeBtn.classList.add("window-btn");
    closeBtn.classList.add("ri-close-line");

    let mainWindowContent = document.createElement("div");
    mainWindowContent.classList.add("window-content");

    titleBar.appendChild(titleBarIcon);
    titleBar.appendChild(titleBarTitle);
    titleBar.appendChild(minimizeBtn);
    titleBar.appendChild(closeBtn);

    mainWindow.appendChild(titleBar);
    mainWindow.appendChild(mainWindowContent);

    wm.element.appendChild(mainWindow);

    titleBar.addEventListener("mousedown", (e) => {
        if (!e.target.classList.contains("window-btn")) {
            let cover = document.getElementById("move-cover");

            wm.selected.element = mainWindow;
            wm.selected.active = true;
            wm.selected.startX = e.clientX;
            wm.selected.startY = e.clientY;
            wm.selected.offsetX = e.clientX - parseInt(mainWindow.style.left);
            wm.selected.offsetY = e.clientY - parseInt(mainWindow.style.top);

            cover.style.zIndex = 1000;

            document.body.style.cursor = "move";
        }
    });

    mainWindow.addEventListener("mousedown", (e) => {
        wm.windows.push(wm.windows.splice(wm.windows.indexOf(mainWindow), 1)[0]);
        for (var i = 0; i < wm.windows.length; i++) {
            let window = wm.windows[i];
            window.style.zIndex = 1 + i;
        }
    });

    let menuBtn = taskbar.addItem(opts);
    menuBtn.addEventListener("click", (e) => {
        if (mainWindow.style.display == "none") {
            mainWindow.style.display = "block";
            menuBtn.classList.add("active");

            wm.windows.push(wm.windows.splice(wm.windows.indexOf(mainWindow), 1)[0]);
            for (var i = 0; i < wm.windows.length; i++) {
                let window = wm.windows[i];
                window.style.zIndex = 1 + i;
            }
        } else {
            mainWindow.style.display = "none";
            menuBtn.classList.remove("active");
        }
    });

    minimizeBtn.addEventListener("click", (e) => {
        mainWindow.style.display = "none";
        menuBtn.classList.remove("active");
    });

    closeBtn.addEventListener("click", (e) => {
        wm.windows.splice(wm.windows.indexOf(mainWindow), 1)
        for (var i = 0; i < wm.windows.length; i++) {
            let window = wm.windows[i];
            window.style.zIndex = 1 + i;
        }
        menuBtn.parentNode.removeChild(menuBtn);
        wm.element.removeChild(mainWindow);
    });

    menuBtn.classList.add("active");
    wm.windows.push(mainWindow);

    return mainWindow;
};

document.body.addEventListener("mousemove", (e) => {
    if (wm.selected.active) {
        let element = wm.selected.element;

        element.style.top = ((e.clientY - wm.selected.startY) - wm.selected.offsetY + wm.selected.startY) + "px";
        element.style.left = ((e.clientX - wm.selected.startX) - wm.selected.offsetX + wm.selected.startX) + "px";
    }
});

document.body.addEventListener("mouseup", (e) => {
    if (wm.selected.active) {
        wm.selected.active = false;
        document.body.style.cursor = "initial";
        document.getElementById("move-cover").style.zIndex = -1000;
    }
});