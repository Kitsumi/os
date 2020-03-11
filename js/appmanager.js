const appManager = {};

appManager.load = function(appName) {
    let request = new Request('/apps/' + appName + '/app.json');

    fetch(request)
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Failed to load app.');
        }
    })
    .then(data => {
        request = new Request('/apps/' + appName + '/' + data.main);

        fetch(request).then(response => {
            if (response.status === 200) {
                return response.text();
            } else {
                throw new Error('Failed to load app.');
            }
        }).then(body => {
            let menuItem = taskbar.addMenuItem({
                "icon": data.icon.src,
                "title": data.title
            });

            menuItem.addEventListener("click", (e) => {
                taskbar.closeProgramMenu();
                let mainWindow = wm.addWindow({
                    "icon": data.icon.src,
                    "title": data.title,
                    "x": Math.floor(window.innerWidth / 2) - Math.floor(window.innerWidth / 4),
                    "y": Math.floor(window.innerHeight / 2) - Math.floor(window.innerHeight / 4),
                    "width": Math.floor(window.innerWidth / 2),
                    "height": Math.floor(window.innerHeight / 2)
                });

                mainWindow.children[1].innerHTML = body;

                for (var i = 0; i < data.scripts.length; i++) {
                    let script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = '/apps/' + appName + "/" + data.scripts[i];

                    mainWindow.appendChild(script);
                }
            });
        }).catch(error => {
            console.error(error);
        });
    }).catch(error => {
        console.error(error);
    });
};

appManager.load("fileExplorer");