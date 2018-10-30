var Bot = require('node-telegram-bot'),
    webshot = require('webshot'),
    url = require('valid-url'),
    md5 = require('md5'),
    fs = require('fs');

var send_message = function(bot, message, text) {
    // sends a text message
    bot.sendMessage({
        chat_id: message.chat.id,
        reply_to_message_id: message.message_id,
        text: text
    });
};

var send_photo = function(bot, message, file_location) {
    // sends a photo, with the chat action "Sending photo >>>"
    bot.sendChatAction({
        chat_id: message.chat.id,
        action: 'upload_photo'
    });

    bot.sendPhoto({
        chat_id: message.chat.id,
        reply_to_message_id: message.message_id,
        files: {
            photo: file_location
        }
    }, function (err, msg) {
        console.log(err);
        console.log(msg);
    });
};

var options = {
	streamType: 'jpg',
	rederDelay: 15,
    phantomConfig: {
        'ssl-protocol': 'any',
        'ignore-ssl-errors': 'yes',
        'web-security': 'false'
    }
};

var bot = new Bot({
    token: process.env.URLSCANBOT_TOKEN
})

.on('message', function (message) {
    //console.log(message);

    if (message.text === undefined) {
        return;
    }
    var message_text = message.text.toLowerCase();

    // if the message starts with /urlscan command, ignore it
    if (message_text.lastIndexOf('/urlscan', 0) === 0) {
        message_text = message_text.replace('/urlscan', '').trim()
    }
    // if the message starts with @, ignore it
    if (message_text.lastIndexOf('@urlscan', 0) === 0) {
        message_text = message_text.replace('@urlscan', '').trim()
    }
	// if the message starts with /start, say Hello
    if (message_text.lastIndexOf('/start', 0) === 0) {
        send_message(bot, message, 'Hi there!');
		return;
    }

    if (!message_text) {
        // if the message was only "/urlscan"
        return;
    }

    if (message_text.lastIndexOf('http', 0) < 0) {
        // if the url doesn't have a protocol, assume http
        message_text = 'http://' + message_text;
    }

    //console.log(message_text);

    // check if the url was actually a valid url
    if (!url.isWebUri(message_text)) {
        send_message(bot, message, 'Sorry, that does not look like a valid url.');
        return;
    }

    // generate file name and location
    var hash = md5(message_text);
    var file_location = './screenshot/' + hash + '.jpg';

    // If a screenshot already exists for the given url's hash, return it
    if (fs.existsSync(file_location)) {
        send_photo(bot, message, file_location);

        console.log('Screenshot already available.');
		console.log('URL : ' + message_text + '\n');
        return;
    }

    // fetch screenshot, save it and return
    //webshot(message_text, file_location, webshot_options, function(err) {
	webshot(message_text, file_location, options, (err) => {
		if (err) {
			return console.log(err);
		}
        if (err !== null) {
            // there was an error
            send_message(bot, message, 'Sorry, could not take a screenshot of that :(');
        } else {
            send_photo(bot, message, file_location);
			console.log('URL : ' + message_text + '\n');
        }
    });
})
.start();
