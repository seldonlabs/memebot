// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// Discord bot
const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const config = require('./config.json');
const memes = require('./memes.json');

// logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = process.env.LOGGER || 'debug';

// init bot
const client = new Discord.Client();

client.login(auth.token);

// message event
client.on('message', async message => {

    // Ignoring other bots
    if (message.author.bot)
        return;

    const content = message.content;
    // Ignoring wrong prefix (!)
    if (content.indexOf(config.prefix) !== 0) return;

    // channel
    const author = message.author;
    const channel = message.channel;

    const args = content.slice(config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    switch (cmd) {
        // ping
        case 'ping':
            // logger.info(evt);
            const m = await channel.send("Ping?");
            var delay = m.createdTimestamp - message.createdTimestamp;
            var resp;

            if (delay > 0 && delay < 200)
                resp = "I'm fast peeps";
            else if (delay > 200 && delay < 400)
                resp = "Victor my vector is nominal";
            else if (delay > 400)
                resp = "Halp! Too much input, please stap!";

            m.edit(`Pong! ${resp} (${delay}ms). API Latency is ${Math.round(client.ping)}ms`);
            break;
        case 'subscribe':
            channel.send("You are now subscribed to " + args[0]);
        break;
        case 'unsubscribe':
            channel.send("You are now unsubscribed from " + args[0]);
        break;
            // help
        case 'help':
            author.send("**All the memes**: \n");

            var resp = "";

            Object.keys(memes).forEach((meme, i) => {
                resp += `**!${meme}**: ${memes[meme].desc}\n`;
            });

            author.send(resp, {split: true});
            break;
            // error
        default:
            var meme = memes[cmd];
            if (meme) {
                channel.send({embed: {
                    title: meme.desc,
                    image: {
                        url: meme.url
                    }

                }});
            } else {
                channel.send(`I struggle to find your meme ${author.username}, ask me for !help.`);
            }
            break;
    }
});