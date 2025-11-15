const { Client, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { prefix, token } = require('./config');

const client = new Client();
const cooldowns = new Collection();
const commandsDir = path.join(__dirname, 'commands');

client.commands = loadCommands(commandsDir);

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.author.bot || !message.content.startsWith(prefix)) {
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            ({ aliases }) => aliases && aliases.includes(commandName),
        );

    if (!command) {
        return;
    }

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        const usage = formatUsage(command, prefix);
        return message.channel.send(
            `You didn't provide any arguments, ${message.author}!${usage}`,
        );
    }

    if (enforceCooldown(command, message, cooldowns)) {
        return;
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(`Error executing ${command.name}:`, error);
        message.reply('UH OH STINKY.... ERROR!');
    }
});

if (!token) {
    console.error(
        'Discord token missing. Set DISCORD_TOKEN env variable or provide one in config.json.',
    );
    process.exit(1);
}

client.login(token);

function loadCommands(directory) {
    const commands = new Collection();
    const commandFiles = fs
        .readdirSync(directory)
        .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(directory, file);
        const command = require(filePath);

        // Track the module path so commands like reload can reference it later.
        command.modulePath = filePath;
        commands.set(command.name, command);
    }

    return commands;
}

function formatUsage(command, commandPrefix) {
    if (!command.usage) {
        return '';
    }

    return `\nThe proper usage would be: \`${commandPrefix}${command.name} ${command.usage}\``;
}

function enforceCooldown(command, message, cooldownMap) {
    if (!cooldownMap.has(command.name)) {
        cooldownMap.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldownMap.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = Math.ceil((expirationTime - now) / 1000);
            message.reply(
                `please wait ${timeLeft} more second(s) before reusing the \`${command.name}\` command.`,
            );
            return true;
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    return false;
}
