/* 
 * @author Rajesh Bhaskar
 * create trustchain using Nodejs
 */

'use strict';

import BigNumber from "bignumber.js";
const SHA256 = require("crypto-js/sha256");
var bigInt = require("big-integer");


class Blockchain {

	constructor() {
		// total number of validators
		this.NUMVALIDATORS = 500;
		// min number of validators needed to mine the block
		this.MINVALIDATORS = 100;
		// simulating the list of validators, later this will be a network of validators
		this.validators = [];

		this.chain = [];
		this.createValidators();
		this.createBlock({previousHash: 0, proof: 1});
	}

	// create validators.. later validators should be able to self-register
	createValidators(){
		console.log("NUMVALIDATORS: ", this.NUMVALIDATORS)
		for (let i = 0; i < this.NUMVALIDATORS; i++) {
			let r = (Math.random() * 100000).toString();
			let s = SHA256(r, 5).toString();
			this.validators[i] = new String(s);
		  }		
	}

	createBlock({ previousHash, proof }) {
		const block = {
			index: this.chain.length + 1,
			timestamp: (+new Date()).toString(),
			data: Math.random(),
			proof: proof,
			previous_hash: previousHash
		}
		this.chain.push(block);
		return block;
	}

	getLastBlock() {
		return this.chain[this.chain.length - 1] !== undefined ? this.chain[this.chain.length - 1] :  null;
	}

	// get the validator for this node
	getCurrentValidator() {

	}

	getDigitalSignatureOfValidator(){
		return "dummyDigitalSignature";
	}

	// wait and get 66% of the validators to agree
	getAllValidations(previousHash){
		// console.log("inside getAllValidations() ", this.NUMVALIDATORS)
		let validatorArray = [];
		for (let i = 0; i < this.NUMVALIDATORS; i++) {
			// console.log(i, this.validators[i])
			
			// setting up the modulo parameter...
			let o = this.NUMVALIDATORS / this.MINVALIDATORS;

			// console.log("previous hash: ", previousHash)
			let nonce = [this.validators[i], previousHash];
			let noncedHash = SHA256(nonce.toString(), 5).toString()
			let s = bigInt (noncedHash, 16);
			// console.log("s", s, "s % o", s.divmod(o))
			// pick the elements that were modulo 0 
			if (s.divmod(o).remainder == 0){
				// console.log("found a validator: ", this.validators[i])
				validatorArray.push([
					{v: this.validators[i], 
						sig: this.getDigitalSignatureOfValidator()
					}
				])			
			}
		  }
		//   console.log("validators:\n", validatorArray)
		  console.log("num validators: ", validatorArray.length)
		  return validatorArray;
	}

	proofOfTrust(previousHash) {
		// get validations from majority of nodes
		console.log("inside proofOfTrust()")
		let validatorArray = this.getAllValidations(previousHash);
		// validatorArray = JSON.stringify(proofArray);
		return {vArray: validatorArray};
	}

	generateHash(block) {
		return SHA256(JSON.stringify(block)).toString();
	}

	isChainValid() {
		const chain = this.chain;
		let previousBlock = chain[0];
		let blockIndex = 1;
		while (blockIndex < chain.length) {
			const currentBlock = chain[blockIndex];
			// TODO: also check the validator array, the digital signatures etc...
			if (currentBlock.previous_hash !== this.generateHash(previousBlock)) {
				return false;
			}
			previousBlock = currentBlock;
			blockIndex += 1;
		}
		return true;
	}
}

module.exports = new Blockchain();
