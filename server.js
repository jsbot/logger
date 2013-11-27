var http = require("http"),
	io = require("socket.io"),
	log4js = require('log4js');

function start() {
	function onRequest(request, response) {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Hello World");
		response.end();
	}

	server = http.createServer(onRequest).listen(8880);
	console.log("Server has started.");


	log4js.configure({
		appenders: [
			{
				type: "file",
				filename: "../logger/logs/client.log",
				category: [ 'logs','file' ]
			},
			{
				type: "console"
			}
		],
		replaceConsole: true
	});

	log4js.loadAppender('file');

	var logger = log4js.getLogger('logs');
	logger.setLevel('INFO');



	var socket = io.listen(server, {log: 0});
	socket.on('connection', function (client) {

		console.log("New client is here!");
		client.emit('wellcome', "Hey you!");

		client.on('logmessage', function (data) {
			logger.info(data);
		});
	});

}

exports.start = start;