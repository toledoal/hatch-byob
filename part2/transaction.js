"use strict";

var SHA256 = require("crypto-js/sha256");

Object.assign(module.exports,{
    createTransactionHash: function(transaction){
        return SHA256(`${transaction.data};${transaction.timestamp}`).toString();
    },
    createTransaction: function(text) {
        let transaction = { data: text, timestamp: Date.now() } 
        transaction.hash = this.createTransactionHash(transaction);
        return transaction;
    },
    isValid: function(transaction){

                if (typeof transaction !== "object"){
                    return false;
                }
                if (!transaction.data){
                    return false;
                } 
                if (typeof (transaction.data) !== "string"){
                    return false;
                }                
                if (transaction.hash.length !== 64){
                    return false;
                }

                if (transaction.hash !== this.createTransactionHash(transaction).toString()){
                    return false;
                }
                
                return true;
                
     
        
    },

});

// Hints:
//
// createTransaction(..)
//
// isValid(..)
