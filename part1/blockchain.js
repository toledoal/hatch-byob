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
            index: this.blocks[this.blocks.length - 1].index + 1,
            prevHash: this.blocks[this.blocks.length-1].hash,
            timestamp: Date.now(),
        }

        block.hash = this.createBlockHash(block);
        this.blocks.push(block);
    },
    createBlockHash: function(data){
        return Crypto.SHA256(`${data.prevHash};${data.index};${data.data};${data.timestamp}`).toString();
    },
    print: function(){
        console.log(this.blocks);
    },
    isValid: function(){
        if (Array.isArray(this.blocks) && this.blocks.length >= 1){
            if (this.blocks[0].hash === '000000' && this.blocks[0].index === 0){

                let dirtyIndex = this.blocks.filter( (block, i, arr) => {
                    if (block.index !== i){
                        return block;
                    }
                });

                let dirtyHash = this.blocks.filter( (block, i, arr) => {
                    if (i > 0){
                    if (block.prevHash !== arr[i - 1].hash){
                        return block;
                    }
                    }
                });

                let dataString = this.blocks.filter( (block, i, arr) => {
                    if (typeof block.data !== "string"){
                        return block;
                    }
                });

                let validHash = this.blocks.filter( (block, i, arr) => {
                    if (i > 0){
                    if (block.hash.length !== 64){
                        return block;
                    }
                    }
                });

               

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
                
        }else{
            return false;
        }      
        
    }
 });

