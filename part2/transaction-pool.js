"use strict";

var TransactionPool = Object.assign(module.exports,{
    isPending: function(hash){
        return this.pending.filter(transaction => transaction.hash === hash && transaction)[0];
    },
    isInvalid: function(hash){
        return this.invalid.filter(transaction => transaction.hash === hash && transaction)[0];
    },
    validate: function(transaction){
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
        return true;
    },
    accept: function(tx){
        console.log(tx);


        if (typeof tx === "object"){

            if (!this.validate(tx)){
                this.invalid.push(tx);
                return false;
            }


            if (this.isPending(tx.hash) === undefined){
                this.pending.push(tx);
                return true;
            }
            if (this.isPending(tx.hash)){
                this.invalid.push(tx);
                return false;
            }
            


         

            
        } else {
            return false;
        }
    },
    pending: [],
    invalid: [],

 });


// Hints:
//
// isPending(..)
// isInvalid(..)
// accept(..)
