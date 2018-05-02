"use strict";

var Crypto = require("crypto-js");
var Transaction = require("../part2/transaction");

Object.assign(module.exports,{
    blocks: [
        {
            data: "genesis!",
            hash: "000000",
            index: 0,
            prevHash: undefined,
            timestamp: 1523291999654,
        }],
    addBlock: function(blockData){
        if (blockData === null){
        return false;
        } else{
        let block = {
            data: blockData,
            index: this.blocks[this.blocks.length - 1].index + 1,
            prevHash: this.blocks[this.blocks.length-1].hash,
            timestamp: Date.now(),
        }
        block.hash = this.createBlockHash(block);
        this.blocks.push(block);
        return block;
        } 
    },
    createBlockHash: function(data){
        return Crypto.SHA256(`${data.prevHash};${data.index};${JSON.stringify(data.data)};${data.timestamp}`).toString();
    },
    print: function(){
        console.log(this.blocks);
    },
    isValid: function(){

        // Validates Blockchain and Genesis Block Existance
        if (Array.isArray(this.blocks) && 
        this.blocks.length >= 1 &&
        this.blocks[0].hash === '000000' && 
        this.blocks[0].index === 0) {
           
                let dirtyIndex = this.blocks.filter( (block, i, arr) => {
                    // Validates Indexes Correspondance
                    if (block.index !== i){
                        return block;
                    }
                });

                let dirtyHash = this.blocks.filter( (block, i, arr) => {
                    // Validates that PrevHash corresponds with Hash
                    if (i > 0){
                        if (block.prevHash !== arr[i - 1].hash){
                            return block;
                        }
                    }
                });

                let dataString = this.blocks.filter( (block, i, arr) => {
                    // Validates block data is string
                    if (!Array.isArray(block.data) && block.data !== 'genesis!'){
                        console.log(block);
                        return block;
                    }
                });

                let validHash = this.blocks.filter( (block, i, arr) => {
                    // Validates hash is 64 chars long
                    if (i > 0){
                        if (block.hash.length !== 64){
                            return block;
                        }
                    }
                });

                // Checks if there is any dirty block
                // Due to testing requirements we have a 'chained validation'
                // We could update these to match a more granular validation
                // And report the 'culprit' block 
                if(dirtyIndex.length !== 0){
                    return false;
                } else{
                    if (dirtyHash.length !== 0){
                        return false;
                    } else{
                        if (dataString.length !== 0){
                            return false;
                        }else{
                            if (validHash.length !== 0){
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
 
        }else{
            return false;
        }      
        
    },
    blockIsValid: function(block){

        if (typeof block !== "object"){
            return false;
         }
        
        if (!Array.isArray(block.data)){
                return false;    
        }

        let invalidTx;
        block.data.forEach(tx => {
           if (!Transaction.isValid(tx)){
               invalidTx = true;
           }
        });

        if (invalidTx){
            return false;
        }

        if (block.hash !== this.createBlockHash(block).toString()){
            return false;
        }

        return true;
    },
    containsTransaction: function(){

    }
 });




// Hints:
//
// blockIsValid(..)
//
// containsTransaction(..)
