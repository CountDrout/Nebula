require('dotenv').config();
const Discord = require("discord.js");

const client = new Discord.Client({ 
    partials: [
      Discord.Partials.Channel,
      Discord.Partials.GuildMember,
      Discord.Partials.Message,
      Discord.Partials.Reaction,
      Discord.Partials.User,
      Discord.Partials.GuildScheduledEvent
  ],
    intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMembers,
      Discord.GatewayIntentBits.GuildBans,
      Discord.GatewayIntentBits.GuildEmojisAndStickers,
      Discord.GatewayIntentBits.GuildIntegrations,
      Discord.GatewayIntentBits.GuildWebhooks,
      Discord.GatewayIntentBits.GuildInvites,
      Discord.GatewayIntentBits.GuildVoiceStates,
      Discord.GatewayIntentBits.GuildMessages,
      Discord.GatewayIntentBits.GuildMessageReactions,
      Discord.GatewayIntentBits.GuildMessageTyping,
      Discord.GatewayIntentBits.DirectMessages,
      Discord.GatewayIntentBits.DirectMessageReactions,
      Discord.GatewayIntentBits.DirectMessageTyping,
      Discord.GatewayIntentBits.GuildScheduledEvents,
      Discord.GatewayIntentBits.MessageContent
  ],
});

const prefix = "!";

// Event triggered when the bot is ready
client.once('ready', () => {
  console.log('Bot is online!');
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const start = Date.now();
    message.reply("Pinging...").then((sentMessage) => {
      const latency = Date.now() - start;
      sentMessage.edit(`Pong! Latency: ${latency}ms`);
    });
  } else if (command === "shutdown") {
    if (message.author.id !== process.env.ADMIN_USER_ID) {
      message.reply("You are not authorized to use this command.");
      return;
    }
    message.reply("Shutting down...").then(() => {
      client.destroy();
      process.exit(0);
    });
  } else if (command === 'ban') {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.reply('You do not have permission to use this command.');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('Please mention a valid member to ban.');
    }

    if (!member.bannable) {
      return message.reply('I cannot ban this member.');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    member.ban({ reason })
      .then(() => {
        message.reply(`Successfully banned ${member.user.tag}.`);
      })
      .catch((error) => {
        console.error('Error banning member:', error);
        message.reply('An error occurred while trying to ban the member.');
      });
  }

});

// Log in to Discord using the bot token
client.login(process.env.TOKEN);