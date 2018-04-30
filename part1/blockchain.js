"use strict";

var SHA256 = require("crypto-js/sha256");
var Crypto = require("crypto-js");




 Object.assign(module.exports,{
    blocks: [
        {
            data: "genesis!",
            hash: "000000",
            index: 0,
            prevHash: undefined,
            timestamp: 1523291999654,
        }],
    addBlock: function(text){
        let block = {
            data: text,
            hash: "000001",
            index: this.blocks[this.blocks.length - 1].index + 1,
            prevHash: this.blocks[this.blocks.length-1].hash,
            timestamp: Date.now(),
        }
        this.blocks.push(block);
    },
    createBlockHash: function(data){
        return Crypto.SHA256(`${data.prevHash};${data.index};${data.data};${data.timestamp}`).toString();
    },
    print: function(){

    },
    isValid: function(){
        
    }
 });




// Hints:
//
// SHA256(..).toString()
