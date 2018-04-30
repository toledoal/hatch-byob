"use strict";

var path = require("path");
var fs = require("fs");
var Blockchain = require("./blockchain.js");
var MyREPL = require("./repl.js");

var args = require("minimist")(process.argv.slice(2),{
	string: [ "load" ],
});

if (args.load) {
	let file = path.resolve(args.load);
	let contents = fs.readFileSync(file,"utf-8");
	let blocks = JSON.parse(contents);

	// TODO
	Blockchain.blocks = blocks;
	Blockchain.isValid();
}

var listener = MyREPL.start();

listener.on("add",function onAdd(text = ""){
	Blockchain.addBlock(text);
});

listener.on("print",function onAdd(text = ""){
	Blockchain.print();
});

listener.on("save",function onAdd(text = ""){
	let toSave = Blockchain.print();
	fs.writeFileSync(file,JSON.stringify(toSave),"utf-8");
});

// Hint:
// fs.writeFileSync(file,JSON.stringify( .. ),"utf-8");
