(function() {
const FileManagerApp = {
    "directory": "/",
    "mainWindow": document.scripts[0].parentNode,
    "history": [],
    "forward": []
};

function dirClickHandler(e) {
    let element = e.target;
    while (!element.classList.contains("file")) {
        element = element.parentNode;
    }
    
    let removeList = FileManagerApp.mainWindow.querySelectorAll(".file.selected");

    for (var i = 0; i < removeList.length; i++) {
        removeList[i].classList.remove("selected");
    }

    element.classList.add("selected");
    if (element.dataset.clicked == "true") {
        if (element.dataset.type == "directory") {
            FileManagerApp.history.push(FileManagerApp.directory);
            FileManagerApp.forward = [];
            FileManagerApp.directory = element.dataset.path;
            
            FileManagerApp.updateMenuBar();

            FileManagerApp.listDirectory();
        }
    } else {
        element.dataset.clicked = true;
        setTimeout(function() {
            element.dataset.clicked = false;
        }, 500);
    }
}

function breadcrumbClick(e) {
    if (e.target.dataset.path != FileManagerApp.directory) {
        FileManagerApp.history.push(FileManagerApp.directory);
        FileManagerApp.forward = [];
        FileManagerApp.directory = e.target.dataset.path;
            
        FileManagerApp.updateMenuBar();

        FileManagerApp.listDirectory();
    }
}

FileManagerApp.updateMenuBar = function () {
    if (FileManagerApp.directory.length > 1) {
        FileManagerApp.mainWindow.querySelector("#up").classList.add("active");
    } else {
        FileManagerApp.mainWindow.querySelector("#up").classList.remove("active");
    }

    if (FileManagerApp.history.length > 0) {
        FileManagerApp.mainWindow.querySelector("#back").classList.add("active");
    } else {
        FileManagerApp.mainWindow.querySelector("#back").classList.remove("active");
    }

    if (FileManagerApp.forward.length > 0) {
        FileManagerApp.mainWindow.querySelector("#forward").classList.add("active");
    } else {
        FileManagerApp.mainWindow.querySelector("#forward").classList.remove("active");
    }

    let menuBar = FileManagerApp.mainWindow.querySelector("#breadcrumbs");
    menuBar.innerHTML = "";

    let splitPath = FileManagerApp.directory.split("/");
    if (FileManagerApp.directory.length <= 1) {
        splitPath = [""];
    }

    for (var i = 0; i < splitPath.length; i++) {
        let pathElement = document.createElement("span");
        pathElement.classList.add("crumb");
        let fullPath = splitPath.slice(0, i + 1).join("/");
        pathElement.dataset.path = fullPath.length < 1 ? "/" : fullPath;
        pathElement.addEventListener("click", breadcrumbClick);
        pathElement.innerText = splitPath[i].length == 0 ? "Root" : splitPath[i];
        menuBar.appendChild(pathElement);
    }
};

FileManagerApp.listDirectory = function() {
    fs.listDirectory(FileManagerApp.directory, (err, data) => {
        if (err) {
            return console.log("Error", err);
        }

        let fileListElement = FileManagerApp.mainWindow.querySelector("#files");
        fileListElement.innerHTML = "";

        for (var i = 0; i < data.length; i++) {
            let file = data[i];

            let fileElement = document.createElement("div");
            fileElement.classList.add("file");

            fileElement.dataset.path = file.fullPath;
            fileElement.dataset.type = file.isDirectory ? "directory" : "file";
            fileElement.addEventListener("click", dirClickHandler);

            let icon = document.createElement("i");
            icon.classList.add("icon");
            icon.classList.add(file.isDirectory ? "ri-folder-fill" : "ri-file-fill");

            let title = document.createElement("span");
            title.classList.add("title");
            title.innerText = file.name;

            fileElement.appendChild(icon);
            fileElement.appendChild(title);

            fileListElement.appendChild(fileElement);
        }
    });
};

FileManagerApp.mainWindow.querySelector("#files").addEventListener("click", (e) => {
    if (e.target == FileManagerApp.mainWindow.querySelector("#files")) {
        let list = FileManagerApp.mainWindow.querySelectorAll(".file");

        for (var i = 0; i < list.length; i++) {
            let element = list[i];
            element.classList.remove("selected");
            element.dataset.clicked = false;
        }
    }
});


FileManagerApp.mainWindow.querySelector("#back").addEventListener("click", (e) => {
    let path = FileManagerApp.history.pop();
    if (path) {
        FileManagerApp.forward.unshift(FileManagerApp.directory);
        FileManagerApp.directory = path;

        FileManagerApp.updateMenuBar();

        FileManagerApp.listDirectory();
    }
});

FileManagerApp.mainWindow.querySelector("#forward").addEventListener("click", (e) => {
    let path = FileManagerApp.forward.shift();
    if (path) {
        FileManagerApp.history.push(FileManagerApp.directory);
        FileManagerApp.directory = path;
        FileManagerApp.updateMenuBar();
        FileManagerApp.listDirectory();
    }
});

FileManagerApp.mainWindow.querySelector("#up").addEventListener("click", (e) => {
    let path = FileManagerApp.directory.split("/");
    if (path.length > 1) {
        FileManagerApp.history.push(FileManagerApp.directory);
        FileManagerApp.directory = path.slice(0, path.length - 1).join("/");

        FileManagerApp.updateMenuBar();

        FileManagerApp.listDirectory();
    }
});

FileManagerApp.listDirectory();
FileManagerApp.updateMenuBar();
})();