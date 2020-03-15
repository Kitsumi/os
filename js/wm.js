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

    let handleContainer = document.createElement("div");
    handleContainer.classList.add("resizers");

    let handles = ["nw", "n", "ne", "w", "e", "sw", "s", "se"];

    for (var i = 0; i < handles.length; i++) {
        let handle = document.createElement("div");
        handle.classList.add("handle");
        handle.classList.add(handles[i]);

        handleContainer.appendChild(handle);
    }

    titleBar.appendChild(titleBarIcon);
    titleBar.appendChild(titleBarTitle);
    titleBar.appendChild(minimizeBtn);
    titleBar.appendChild(closeBtn);

    mainWindow.appendChild(titleBar);
    mainWindow.appendChild(mainWindowContent);
    mainWindow.appendChild(handleContainer);

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
            wm.selected.type = "move";

            cover.style.zIndex = 1000;

            document.body.style.cursor = "move";
        }
    });

    handleContainer.children[0].addEventListener("mousedown", (e) => {
        let cover = document.getElementById("move-cover");

        wm.selected.element = mainWindow;
        wm.selected.active = true;
        wm.selected.startX = e.clientX;
        wm.selected.startY = e.clientY;
        wm.selected.offsetX = e.clientX - parseInt(mainWindow.style.left);
        wm.selected.offsetY = e.clientY - parseInt(mainWindow.style.top);
        wm.selected.height = parseInt(mainWindow.style.height);
        wm.selected.width = parseInt(mainWindow.style.width);
        wm.selected.type = "resize";
        wm.selected.resize = "nw";

        cover.style.zIndex = 1000;

        document.body.style.cursor = "nw-resize";
    });

    handleContainer.children[1].addEventListener("mousedown", (e) => {
        let cover = document.getElementById("move-cover");

        wm.selected.element = mainWindow;
        wm.selected.active = true;
        wm.selected.startX = e.clientX;
        wm.selected.startY = e.clientY;
        wm.selected.offsetX = e.clientX - parseInt(mainWindow.style.left);
        wm.selected.offsetY = e.clientY - parseInt(mainWindow.style.top);
        wm.selected.height = parseInt(mainWindow.style.height);
        wm.selected.width = parseInt(mainWindow.style.width);
        wm.selected.type = "resize";
        wm.selected.resize = "n";

        cover.style.zIndex = 1000;

        document.body.style.cursor = "n-resize";
    });

    handleContainer.children[2].addEventListener("mousedown", (e) => {
        let cover = document.getElementById("move-cover");

        wm.selected.element = mainWindow;
        wm.selected.active = true;
        wm.selected.startX = e.clientX;
        wm.selected.startY = e.clientY;
        wm.selected.offsetX = e.clientX - parseInt(mainWindow.style.left);
        wm.selected.offsetY = e.clientY - parseInt(mainWindow.style.top);
        wm.selected.height = parseInt(mainWindow.style.height);
        wm.selected.width = parseInt(mainWindow.style.width);
        wm.selected.type = "resize";
        wm.selected.resize = "ne";

        cover.style.zIndex = 1000;

        document.body.style.cursor = "ne-resize";
    });

    handleContainer.children[3].addEventListener("mousedown", (e) => {
        let cover = document.getElementById("move-cover");

        wm.selected.element = mainWindow;
        wm.selected.active = true;
        wm.selected.startX = e.clientX;
        wm.selected.startY = e.clientY;
        wm.selected.offsetX = e.clientX - parseInt(mainWindow.style.left);
        wm.selected.offsetY = e.clientY - parseInt(mainWindow.style.top);
        wm.selected.height = parseInt(mainWindow.style.height);
        wm.selected.width = parseInt(mainWindow.style.width);
        wm.selected.type = "resize";
        wm.selected.resize = "w";

        cover.style.zIndex = 1000;

        document.body.style.cursor = "w-resize";
    });

    handleContainer.children[4].addEventListener("mousedown", (e) => {
        let cover = document.getElementById("move-cover");

        wm.selected.element = mainWindow;
        wm.selected.active = true;
        wm.selected.startX = e.clientX;
        wm.selected.startY = e.clientY;
        wm.selected.offsetX = e.clientX - parseInt(mainWindow.style.left);
        wm.selected.offsetY = e.clientY - parseInt(mainWindow.style.top);
        wm.selected.height = parseInt(mainWindow.style.height);
        wm.selected.width = parseInt(mainWindow.style.width);
        wm.selected.type = "resize";
        wm.selected.resize = "e";

        cover.style.zIndex = 1000;

        document.body.style.cursor = "e-resize";
    });

    handleContainer.children[5].addEventListener("mousedown", (e) => {
        let cover = document.getElementById("move-cover");

        wm.selected.element = mainWindow;
        wm.selected.active = true;
        wm.selected.startX = e.clientX;
        wm.selected.startY = e.clientY;
        wm.selected.offsetX = e.clientX - parseInt(mainWindow.style.left);
        wm.selected.offsetY = e.clientY - parseInt(mainWindow.style.top);
        wm.selected.height = parseInt(mainWindow.style.height);
        wm.selected.width = parseInt(mainWindow.style.width);
        wm.selected.type = "resize";
        wm.selected.resize = "sw";

        cover.style.zIndex = 1000;

        document.body.style.cursor = "sw-resize";
    });

    handleContainer.children[6].addEventListener("mousedown", (e) => {
        let cover = document.getElementById("move-cover");

        wm.selected.element = mainWindow;
        wm.selected.active = true;
        wm.selected.startX = e.clientX;
        wm.selected.startY = e.clientY;
        wm.selected.offsetX = e.clientX - parseInt(mainWindow.style.left);
        wm.selected.offsetY = e.clientY - parseInt(mainWindow.style.top);
        wm.selected.height = parseInt(mainWindow.style.height);
        wm.selected.width = parseInt(mainWindow.style.width);
        wm.selected.type = "resize";
        wm.selected.resize = "s";

        cover.style.zIndex = 1000;

        document.body.style.cursor = "s-resize";
    });

    handleContainer.children[7].addEventListener("mousedown", (e) => {
        let cover = document.getElementById("move-cover");

        wm.selected.element = mainWindow;
        wm.selected.active = true;
        wm.selected.startX = e.clientX;
        wm.selected.startY = e.clientY;
        wm.selected.offsetX = e.clientX - parseInt(mainWindow.style.left);
        wm.selected.offsetY = e.clientY - parseInt(mainWindow.style.top);
        wm.selected.height = parseInt(mainWindow.style.height);
        wm.selected.width = parseInt(mainWindow.style.width);
        wm.selected.type = "resize";
        wm.selected.resize = "se";

        cover.style.zIndex = 1000;

        document.body.style.cursor = "se-resize";
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
            mainWindow.style.display = "";
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
        if (wm.selected.type == "move") {
            element.style.top = ((e.clientY - wm.selected.startY) - wm.selected.offsetY + wm.selected.startY) + "px";
            element.style.left = ((e.clientX - wm.selected.startX) - wm.selected.offsetX + wm.selected.startX) + "px";
        } else if (wm.selected.type == "resize") {
            if (wm.selected.resize.indexOf("n") > -1) {
                element.style.top = ((e.clientY - wm.selected.startY) - wm.selected.offsetY + wm.selected.startY) + "px";
                element.style.height = (wm.selected.height - (e.clientY - wm.selected.startY)) + "px";
            } else if (wm.selected.resize.indexOf("s") > -1) {
                element.style.height = ((e.clientY - wm.selected.startY) + wm.selected.height) + "px";
            }

            if (wm.selected.resize.indexOf("w") > -1) {
                element.style.left = ((e.clientX - wm.selected.startX) - wm.selected.offsetX + wm.selected.startX) + "px";
                element.style.width = (wm.selected.width - (e.clientX - wm.selected.startX)) + "px";

            } else if (wm.selected.resize.indexOf("e") > -1) {
                element.style.width = ((e.clientX - wm.selected.startX) + wm.selected.width) + "px";
            }
        }
    }
});

document.body.addEventListener("mouseup", (e) => {
    if (wm.selected.active) {
        wm.selected.active = false;
        document.body.style.cursor = "initial";
        document.getElementById("move-cover").style.zIndex = -1000;
    }
});

document.body.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

document.body.addEventListener("mouseup", (e) => {
    let menu = document.getElementById("context");

    if (menu) {
        let element = e.target;
        while (element.id != "context" && element != document.body) {
            element = element.parentNode;
        }

        if (element.id == "context") return;

        document.body.removeChild(menu);
    }
});