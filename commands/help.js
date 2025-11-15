const { prefix } = require('../config');

module.exports = {
    name: 'help',
    description: 'List all commands or info about a specific command',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        const { commands } = message.client;

        if (!args.length) {
            const response = [];
            response.push("Here's a list of all my commands:");
            response.push(commands.map(command => command.name).sort().join(', '));
            response.push(
                `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`,
            );

            return message.author
                .send(response, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply("I've sent you a DM with all my commands!");
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply("It seems like I can't DM you. Do you have DMs disabled?");
                });
        }

        const name = args[0].toLowerCase();
        const command =
            commands.get(name) ||
            commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

        if (!command) {
            return message.reply("that's not a valid command!");
        }

        const details = [];
        details.push(`**Name:** ${command.name}`);
        if (command.aliases && command.aliases.length) {
            details.push(`**Aliases:** ${command.aliases.join(', ')}`);
        }
        if (command.description) {
            details.push(`**Description:** ${command.description}`);
        }
        if (command.usage) {
            details.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        }
        details.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        return message.channel.send(details, { split: true });
    },
};
