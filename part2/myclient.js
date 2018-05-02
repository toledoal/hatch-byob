"use strict";

var fetch = require("node-fetch");

var Transaction = require("./transaction.js");
var MyREPL = require("./repl.js");

var listener = MyREPL.start();



listener.on("add",async function onAdd(text = ""){
	// TODO
	if (text !== ""){
	let tx = Transaction.createTransaction(text);
		fetch("http://localhost:8080/transaction/send", tx ).
		then(res => res.json()).
		then(tx => console.log("This is your Hash: " + tx.hash)).
		catch(err => console.error("Transaction failed to be sent."));
	}

});

listener.on("check",async function onSave(transactionHash){
	fetch(`http://localhost:8080/transaction?hash=${transactionHash}`).
	then(res => res.json()).
	then(tx => console.log(tx)).
	catch(err => console.error("Transaction Hash error."));
});
