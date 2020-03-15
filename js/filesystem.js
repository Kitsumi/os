const fs = {};

window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

let storageSpace = 2 * 1024 * 1024 * 1024;
navigator.webkitPersistentStorage.requestQuota(storageSpace, (grantedBytes) => {  
        window.requestFileSystem(PERSISTENT, grantedBytes, (e) => {
            fs.filesystem = e;
            createDir(fs.filesystem.root, "/Users/Default/Documents".split("/"));
            createDir(fs.filesystem.root, "/Users/Default/Music".split("/"));
            createDir(fs.filesystem.root, "/Users/Default/Videos".split("/"));
            createDir(fs.filesystem.root, "/Users/Default/Pictures".split("/"));
            createDir(fs.filesystem.root, "/Users/Default/Desktop".split("/"));
            createDir(fs.filesystem.root, "/Users/Default/Downloads".split("/"));
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
                    callback(null, entries.sort(), fileEntry);
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

fs.removeFile = function(dir, filename, callback) {
    dir.getFile(filename, {create: false}, function(fileEntry) {
        fileEntry.remove(function() {
            callback();
        }, (err) => {
            callback(err);
        });
    }, (err) => {
        callback(err);
    });
};

function createDir(rootDirEntry, folders) {
    if (folders[0] == '.' || folders[0] == '') {
      folders = folders.slice(1);
    }
    rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
      if (folders.length) {
        createDir(dirEntry, folders.slice(1));
      }
    }, console.log);
};