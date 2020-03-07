const taskbar = {
    "menuBtn": document.getElementById("tb-menu"),
    "programMenu": document.getElementById("program-menu"),
    "items": []
};

taskbar.appBar = document.getElementById("tb-apps");

taskbar.addItem = function(options) {
    let opts = {
        "icon": options.icon || "page-fill",
        "title": options.title || "Program"
    };

    let container = document.createElement("div");
    let iconElement;
    let titleElement = document.createElement("span");

    container.classList.add("item");

    if (opts.icon.indexOf("/") > -1) {
        iconElement = document.createElement("img");
        iconElement.classList.add("icon");
        iconElement.src = opts.icon;
    } else {
        iconElement = document.createElement("i");
        iconElement.classList.add("icon");
        iconElement.classList.add("ri-" + opts.icon);
    }

    titleElement.classList.add("label");
    titleElement.innerText = opts.title;

    container.appendChild(iconElement);
    container.appendChild(titleElement);

    taskbar.appBar.appendChild(container);

    taskbar.items.push(container);

    return container;
};

taskbar.addMenuItem = function(options) {
    let opts = {
        "icon": options.icon || "page-fill",
        "title": options.title || "Program"
    };

    let mainElement = document.createElement("program");
    let iconElement;
    let titleElement = document.createElement("span");

    mainElement.classList.add("program");

    if (opts.icon.indexOf("/") > -1) {
        iconElement = document.createElement("img");
        iconElement.classList.add("program-icon");
        iconElement.src = opts.icon;
    } else {
        iconElement = document.createElement("i");
        iconElement.classList.add("program-icon");
        iconElement.classList.add("ri-" + opts.icon);
    }

    titleElement.classList.add("program-title");
    titleElement.innerText = opts.title;

    mainElement.appendChild(iconElement);
    mainElement.appendChild(titleElement);

    taskbar.programMenu.children[1].appendChild(mainElement);

    return mainElement;
};

taskbar.closeProgramMenu = function() {
    if (taskbar.programMenu.dataset.enabled == "true") {
        taskbar.programMenu.classList.remove("active");
        taskbar.menuBtn.classList.remove("active");
        taskbar.programMenu.style.bottom = "-512px";
        taskbar.programMenu.style.opacity = "0";
        taskbar.programMenu.dataset.enabled = "false"
    }
};

taskbar.openProgramMenu = function() {
    if (taskbar.programMenu.dataset.enabled != "true") {
        taskbar.programMenu.classList.add("active");
        taskbar.menuBtn.classList.add("active");
        taskbar.programMenu.style.bottom = "40px";
        taskbar.programMenu.style.opacity = "1";
        taskbar.programMenu.dataset.enabled = "true"
    }
};

taskbar.toggleProgramMenu = function() {
    if (taskbar.programMenu.dataset.enabled == "true") {
        taskbar.closeProgramMenu();
    } else {
        taskbar.openProgramMenu();
    }
};

taskbar.menuBtn.addEventListener("click", (e) => {
    taskbar.toggleProgramMenu();
});

document.body.addEventListener("mousedown", (e) => {
    if (!document.getElementById("taskbar").contains(e.target) && !taskbar.programMenu.contains(e.target)) {
        taskbar.closeProgramMenu();
    }
});

taskbar.updateInfo = function() {
    let date = new Date();
    let timeElement = document.getElementById("tb-time");
    let dateElement = document.getElementById("tb-date");

    timeElement.innerText = new Intl.DateTimeFormat('en-US', {
        "hour": "numeric",
        "minute": "numeric"
    }).format(date);

    dateElement.innerText = new Intl.DateTimeFormat('en-US').format(date);

    window.requestAnimationFrame(taskbar.updateInfo);
};

taskbar.updateInfo();