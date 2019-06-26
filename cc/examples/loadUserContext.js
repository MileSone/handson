'use strict';

var RESTClient = require('node-rest-client').Client;
var isEmpty = require('../util/baseUtils').isEmpty;
var getToken = require('../util/tokenUtils').tokenUtils;
var config = require('../util/config');
//var data = require("../mock-json/loadUserContext.json");
var restClient = new RESTClient();

module.exports = {
	metadata: () => ({
		name: 'loadUserContext',
		"properties": {
			"userName": {
				"type": "string",
				"required": true
			}
		},
		// supportedActions: ["exists", "notexists"]
		supportedActions: []
	}),
	invoke: (conversation, done) => {
		// perform conversation tasks.
		var userName = conversation.properties().userName;
		var newStr = userName + " 欢迎进入CC";
			conversation.variable("output", newStr);
			conversation.transition();
			conversation.keepTurn(true);
			done();
	}
};