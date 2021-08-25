/* 
 * @author Shashank Tiwari
 * create basic blockchain using Nodejs
 */

'use strict';

const express = require("express");
const http = require('http');
const bodyParser = require('body-parser');

const blockchain = require('./blockchain');

class Server {

	constructor() {
		this.port = process.env.PORT || 3000;
		this.host = `localhost`;

		this.app = express();
		this.http = http.Server(this.app);
	}

  	appConfig() {
		this.app.use(
			bodyParser.json()
		);
		this.app.use(require("express").static('client'));
 	}

	/* Including app Routes starts*/
  	includeRoutes(app) {
		
		app.get("/mine_block", function (request, response) {
			const previousBlock = blockchain.getLastBlock();
			const proof = blockchain.proofOfWork(previousBlock.proof);
			const previousHash = blockchain.generateHash(previousBlock);
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
			response.status(200).json(jsonResponse);
		});

		app.get("/get_blockchain", function (request, response) {
			response.status(200).json({
				length: blockchain.chain.length,
				blockchain: blockchain.chain
			});
		});

		app.get("/is_blockchain_valid", function (request, response) {
			if(blockchain.isChainValid()) {
				response.status(200).json({
					message: 'Your Blockchain is valid.',
					error: false
				});
			} else {
				response.status(417).json({
					message: 'Your Blockchain is invalid.',
					error: true
				});
			}
		});
		
		app.get("**", function (req, response) {
			response.status(200).json({
				message: '404, Not Found.'
			});
		});
	}
	/* Including app Routes ends*/

	appExecute() {

		this.appConfig();
		this.includeRoutes(this.app);

		this.http.listen(this.port, this.host, () => {
			console.log(`Listening on http://${this.host}:${this.port}`);
		});
	}

}

const app = new Server();
app.appExecute();