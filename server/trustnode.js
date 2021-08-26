/* 
 * @author Rajesh Bhaskar
 * create trustchain using Nodejs
 */

'use strict';
const bodyParser = require('body-parser');
import { Picker } from 'meteor/communitypackages:picker';
var blockchain = require ('./blockchain.js');

Picker.route('/mine_block', function (params, request, response, next) {
	const previousBlock = blockchain.getLastBlock();
	const previousHash = blockchain.generateHash(previousBlock);
	const proof = blockchain.proofOfTrust(previousHash);
	const block = blockchain.createBlock({
		previousHash: previousHash,
		proof: proof
	});
	const jsonResponse = {
		message: 'You mined a new Block.',
		index: block.index,
		timestamp: block.timestamp,
		data: block.data,
		proof: block.proof,
		previous_hash: block.previous_hash
	}
	response.writeHead(200)
	response.end(JSON.stringify(jsonResponse))
});


Picker.route('/get_blockchain', function (params, request, response, next) {
	response.writeHead(200)
	response.end(JSON.stringify(
		{
			length: blockchain.chain.length,
			blockchain: blockchain.chain 
		}))
  });

Picker.route('/is_blockchain_valid', function (params, request, response, next) {
	response.writeHead(200)
	if (blockchain.isChainValid()) {
		response.end(JSON.stringify({
			message: 'Your Blockchain is valid.',
			error: false
		}));
	} else {
		response.end(JSON.stringify({
			message: 'Your Blockchain is invalid.',
			error: true
		}));
	}
});
