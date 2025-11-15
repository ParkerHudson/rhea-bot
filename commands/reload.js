const path = require('path');

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    usage: '<command name>',
    args: true,
    execute(message, args) {
        const commandName = args[0].toLowerCase();
        const { commands } = message.client;
        const command =
            commands.get(commandName) ||
            commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(
                `There is no command with name or alias \`${commandName}\`, ${message.author}!`,
            );
        }

        const modulePath = command.modulePath || path.join(__dirname, `${command.name}.js`);

        try {
            delete require.cache[require.resolve(modulePath)];
            const newCommand = require(modulePath);
            newCommand.modulePath = modulePath;
            commands.set(newCommand.name, newCommand);
            return message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            return message.channel.send(
                `There was an error while reloading \`${command.name}\`:\n\`${error.message}\``,
            );
        }
    },
};
