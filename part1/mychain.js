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

	// Validates the block chain
	if (Blockchain.isValid()){
	Blockchain.blocks = blocks;
	}
}

var listener = MyREPL.start();

listener.on("add",function onAdd(text = ""){
	Blockchain.addBlock(text);
});

listener.on("print",function onPrint(){
	Blockchain.print();
});

listener.on("save",function onSave(file = ""){
	if (file !== ""){
		fs.writeFileSync(file,JSON.stringify(Blockchain.blocks),"utf-8");
	} 
});
