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

fs.listDirectory = function(dir, callback) {
    fs.filesystem.root.getDirectory(dir, {}, (fileEntry) => {
        var dirReader = fileEntry.createReader();
        var entries = [];

        var readEntries = function() {
            dirReader.readEntries(function(results) {
                if (!results.length) {
                    callback(null, entries.sort());
                } else {
                    entries = entries.concat(Array.prototype.slice.call(results || [], 0));
                    readEntries();
                }
            }, (err) => {
                callback(err);
            });
        };

        readEntries();
    }, (err) => {
        callback(err);
    });
}