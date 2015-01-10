#!/usr/bin/env node

var port = 3000;

var io = require("socket.io")();
var crypto = require("crypto");

var connections = 0;

io.on("connection", function(socket) {
	connections++;
	log(connections + " connections.", "connect");
	socket.on("chat", function(message) {
		log(message.id.substr(0, 6) + ": " + message.content, "message");
		var sha1 = crypto.createHash("sha1");
		sha1.update(message.id);
		message.content = htmlspecialchars(message.content);
		message.id = sha1.digest("hex").substr(0, 6);
		socket.broadcast.emit("chat", message);
	});
	socket.on("disconnect", function() {
		connections--;
		log(connections + " connections.", "disconn");
	});
});

io.listen(port);
log("Welcome to Kinggai Server.");
log("Listening on *:" + port + ".");

function htmlspecialchars(s) {
    s = s.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/"/g, "&quot;");
    s = s.replace(/'/g, "&#039;");
    return s;
};

function log(message, type) {
	console.log("[" + new Date().toISOString() + "] (" + (type || "systlog") + ") " + message);
}
