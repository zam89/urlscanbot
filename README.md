URLScan_Bot
===

A Telegram bot that generates screenshots of given URLs.

Features
===
 - Saves the screenshots with the MD5 of the URL as name
 - Checks if a screenshot already exists for given url. If it does, returns the existing screenshot. Delete the screenshots from the `screenshot` directory to regenerate screenshots.

Dependencies
===

System level
---
 - NodeJS
 - PhantomJS

NodeJS level
---
 - node-telegram-bot
 - webshot
 - md5
 - valid-url

How to Run
===
 - Install NodeJS in your host machine
 - Install all above dependencies by running `npm install`
 - Make sure your OS user has write access to the bot's directory
 - Make sure you have created/requested Telegram Bot API from BotFather (https://core.telegram.org/bots#6-botfather)
 - Then run the bot like this -

        $ URLSCANBOT_TOKEN='Your Token' node app.js
- Visit your bot via Telegram & sent URL via message
- You'll received chat reply from your bot containing screenshot

Credit
===
- This script was originally written by iambibhas (https://github.com/iambibhas/telebot_screeny)
- All copyright & credit to him. Code in my Github is just another version that suites my need.
