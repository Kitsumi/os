(function() {
const FileManagerApp = {
    "directory": "/",
    "mainWindow": document.scripts[0].parentNode
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
}

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

FileManagerApp.listDirectory();
})();