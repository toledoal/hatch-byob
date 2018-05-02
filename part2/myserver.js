"use strict";

var path = require("path");
var fs = require("fs");
var http = require("http");

var getStream = require("get-stream");

var Blockchain = require("./blockchain.js");
var TransactionPool = require("./transaction-pool.js");

var args = require("minimist")(process.argv.slice(2),{
	string: [ "load" ],
});

const BLOCK_SIZE = 4;

if (args.load) {
	let file = path.resolve(args.load);
	let contents = fs.readFileSync(file,"utf-8");
	let blocks = JSON.parse(contents);

	// Validates the block chain
	if (Blockchain.isValid()){
		Blockchain.blocks = blocks;
		}
}

var CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Credentials": false,
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Accept, Content-Type, User-Agent, X-Requested-With",
};

var JSON_HEADERS = {
	"Content-Type": "application/json",
	"Cache-Control": "max-age: 0, no-cache",
};

var httpServer = http.createServer(onMessage);

httpServer.listen(8080,"localhost");

console.log("Listening on http://localhost:8080...");


// ******************************

async function onMessage(req,res) {
	try {
		// CORS preflight?
		if (
			req.method == "OPTIONS" &&
			["GET","POST"].includes(req.headers["access-control-request-method"])
		) {
			res.writeHead(200,CORS_HEADERS);
			res.end();

			return;
		}

		var [,recordType,action] = req.url.match(/^\/([^\/]+)\/([^\/]+)/) || [];
		if (recordType && action) {
			recordType = recordType.toLowerCase();
			action = action.toLowerCase();

			if (
				req.method == "POST" &&
				recordType == "transaction" &&
				action == "send"
			) {
				let transaction = JSON.parse(await getStream(req));

				// TODO

				let acceptable = TransactionPool.accept(transaction);
				 
				res.writeHead(200,Object.assign({},JSON_HEADERS,CORS_HEADERS));
				res.end(JSON.stringify({ status: "OK" }));

				if(acceptable){
					addNewBlock();
				}
				

				return;
			}
			else if (
				req.method == "GET" &&
				recordType == "transaction" &&
				action !== ""
			) {
				if (req.query.hash){
				let statusMsg = {};

				let isPending = TransactionPool.isPending(req.query.hash);;
				let isInvalid = TransactionPool.isInvalid(req.query.hash);
				//let containsIt = Blockchain.con.isPending();
				// TODO
				if (isPending !== undefined){
				   Object.assign(statusMsg, {Pending: isPending} );
				}

				if (isInvalid !== undefined){
					Object.assign(statusMsg, {IsInvalid: isInvalid} );
				 }

				}

				// containsTransaction(..)
				res.writeHead(200,Object.assign({},JSON_HEADERS,CORS_HEADERS));
					res.end(JSON.stringify({ status: statusMsg }));

				return;
			}
		}

		console.error("Unrecognized exchange.");
	}
	catch (err) {
		console.error(err.toString());
	}

	res.writeHead(404,CORS_HEADERS);
	res.end();
}

function addNewBlock() {
	var transactions = TransactionPool.pending.splice(0,BLOCK_SIZE);
	var block = Blockchain.addBlock(transactions);
	if (block) {
		saveBlockchain();
		console.log(`Block added: ${block.hash}`);
	}
}

function saveBlockchain() {
	fs.writeFileSync(
		path.resolve("mychain.json"),
		JSON.stringify(Blockchain.blocks,null,4),
		"utf-8"
	);
}
