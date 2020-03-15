(function() {
const FileManagerApp = {
    "directory": "/",
    "fsDir": fs.filesystem.root,
    "mainWindow": document.currentScript.parentNode,
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

function fileClickHandler(e) {
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
        FileManagerApp.fsDir.getFile(element.dataset.filename, {}, function(fileEntry) {
            window.open(fileEntry.toURL(), '_blank');
        }, handleError);
    } else {
        element.dataset.clicked = true;
        setTimeout(function() {
            element.dataset.clicked = false;
        }, 500);
    }
}

function handleError() {
    console.log.call([...arguments].unshift("ERROR"));
}

function createFileContextElement(e) {
    let element = e.target;
    while (!element.classList.contains("file")) {
        element = element.parentNode;
    }

    let contextMenu = document.createElement("div");
    contextMenu.id = "context";
    contextMenu.style.top = e.clientY + "px";
    contextMenu.style.left = e.clientX + "px";

    let removeItem = document.createElement("span");
    removeItem.classList.add("item");
    removeItem.innerText = "Delete";
    removeItem.addEventListener("click", function() {
        let menu = document.getElementById("context");
        if (menu) {
            menu.parentNode.removeChild(menu);
        }
        fs.removeFile(FileManagerApp.fsDir, element.dataset.filename, (err) => {
            if (err) {
                handleError(err);
            }

            FileManagerApp.listDirectory();
        });
    });

    contextMenu.appendChild(removeItem);
    document.body.appendChild(contextMenu);
};

function handleUpload(e) {
    let fileList = e.target.files;
    if (fileList.length > 0) {
        let file = fileList[0];

        FileManagerApp.fsDir.getFile(file.name, {create: true, exclusive: true}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.addEventListener("writeend", (e) => {
                    FileManagerApp.listDirectory();
                });
                fileWriter.addEventListener("error", handleError);

                let reader = new FileReader();
                reader.addEventListener("loadend", (e) => {
                    fileWriter.write(new Blob(e.result));
                });
                reader.addEventListener("error", handleError);
                reader.readAsArrayBuffer(file);
            }, handleError);
        }, handleError);
    } else {
        e.target.parentNode.removeChild(e.target);
    }
}

function uploader() {
    let fileSelector = document.createElement("input");
    fileSelector.type = "file";
    fileSelector.style.position = "absolute";
    fileSelector.style.top = "-10000px";
    fileSelector.style.left = "-10000px";
    document.body.appendChild(fileSelector);

    fileSelector.addEventListener("change", handleUpload);
    fileSelector.addEventListener("onblur", handleUpload);
    fileSelector.addEventListener("click", handleUpload);

    fileSelector.click();
}

function createContextElement(e) {
    let element = e.target;
    if (element.id != "files") return;

    let contextMenu = document.createElement("div");
    contextMenu.id = "context";
    contextMenu.style.top = e.clientY + "px";
    contextMenu.style.left = e.clientX + "px";

    let uploadItem = document.createElement("span");
    uploadItem.classList.add("item");
    uploadItem.innerText = "Upload";
    uploadItem.addEventListener("click", function() {
        let menu = document.getElementById("context");
        if (menu) {
            menu.parentNode.removeChild(menu);
        }
        uploader();
    });

    contextMenu.appendChild(uploadItem);
    document.body.appendChild(contextMenu);
};

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
    fs.listDirectory(FileManagerApp.directory, (err, data, directory) => {
        if (err) {
            return handleError("Error", err);
        }

        let fileListElement = FileManagerApp.mainWindow.querySelector("#files");
        fileListElement.innerHTML = "";

        for (var i = 0; i < data.length; i++) {
            let file = data[i];

            let fileElement = document.createElement("div");
            fileElement.classList.add("file");

            fileElement.dataset.path = file.fullPath;
            fileElement.dataset.type = file.isDirectory ? "directory" : "file";
            fileElement.dataset.filename = file.name;
            if (file.isDirectory) {
                fileElement.addEventListener("click", dirClickHandler);
            } else {
                fileElement.addEventListener("click", fileClickHandler);
            }
            fileElement.addEventListener("contextmenu", createFileContextElement);

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

        FileManagerApp.fsDir = directory;
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

FileManagerApp.mainWindow.querySelector("#files").addEventListener("contextmenu", createContextElement);

FileManagerApp.listDirectory();
FileManagerApp.updateMenuBar();
})();