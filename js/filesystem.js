const fs = {};

window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

let storageSpace = 2 * 1024 * 1024 * 1024;
navigator.webkitPersistentStorage.requestQuota(storageSpace, (grantedBytes) => {  
        window.requestFileSystem(PERSISTENT, grantedBytes, (e) => {
            fs.filesystem = e;
        }, (err) => {
            console.log("Filesystem Error:", err);
        });
    }, (e) => {
        console.log("Filesystem Error", err);
    }
);