const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const fs = require("fs");
const prefix = config.prefix;
const regex = require("./data.json");
const diepregex = RegExp(regex.diep);
let curArgs;
let reactLink;
let link;
let linkOwner;
let onoff;
let channelDetector;
let delMessages;

function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

client.on("ready", client => {
    console.log("Link Detection Is Online!");
    console.log(config.testChannelID + "Is the ID of current detection channel.");
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving link detection on ${client.guilds.size} servers`);
});

client.on("message", async msg => {

  if(msg.content.includes("<@492828155510521866> prefix")) {
    msg.reply("**l.**help");
  }

    if(msg.content.startsWith("l.help")) {
      let helpEmbed = new Discord.RichEmbed()
      .setTitle("Link Detection")
      .setDescription("Setting and config for link detection.")
      .addField("l.setChannel <id>", "Sets link detection channel.")
      .addField("l.removeChannel <id>", "Removes channel from link detection.")
      .addField("l.delMessages", "Deletes any messages not matching the regex.")
      .addField("l.off", "Globally disables link detection.")
      .setFooter("Need help? [Join Our Discord Server](https://discord.gg/tnY35Wx)")
      .addField("l.on", "Globally enables link detection.");

      msg.channel.send(helpEmbed);
    }


    setInterval(function() {
        console.log("Keeping online.");
    }, 10000);

    let msgArray = msg.content.split(" ");
    args = msgArray.slice(0);

    if(msg.content.startsWith("l.setChannel")) {
      channelDetector = args[0];
    }

    if(msg.content.startsWith("l.delMessages")) {
        delMessages = true;
    }

    if(delMessages = true, diepregex.test(args[0]) = false, msg.channel.id !== channelDetector) {
      msg.delete();
    }

    let largs = msgArray.slice(0);
    console.log(args[0]);
    if(!msg.channel.id === channelDetector) return;



    if (diepregex.test(args[0])) {
        link = args[0];
        curArgs = args.slice(1).join(" ");
        linkOwner = msg.author.tag;
        try {
            let linkEmbed = new Discord.RichEmbed()
                .setTitle(linkOwner)
                .setDescription("React with :link: to join!")
                .setFooter("Sometimes you may need to react twice in order to process.")
                .addField("Info:", curArgs)
                .addField("Users:", linkOwner);

            reactLink = await msg.channel.send(linkEmbed);
            reactLink.react("🔗");
        } catch (e) {
            console.error(e);
        }

    }

});



client.on("messageReactionAdd", async (reaction, user, CURARGS) => {
    let msg = reaction.message;
    try {
        const filter = (reaction) => reaction.emoji.name === "🔗";
        let collector = await msg.createReactionCollector(filter, {
            max: 15,
            time: 3600000,
            errors: ['time']
        })
        collector.on("collect", collected => {
            console.log(collected);
            let toSend = collected.users.get(user.id).send(link);
            let usersJoined = collected.users.get(user.id);
            console.log(toSend);
            console.log(curArgs);
            let newLinkEmbed = new Discord.RichEmbed()
                .setTitle(linkOwner)
                .setDescription("React with :link: to join!")
                .addField("Info:", curArgs)
                .setFooter("Sometimes you may need to react twice to process!")
                .addField("Users:", `\n${linkOwner}\n ${usersJoined.tag}`);

            const newEmbed = reactLink.edit(newLinkEmbed);
        })
    } catch (e) {
        console.error(e);
    }

});

client.login(config.token);
