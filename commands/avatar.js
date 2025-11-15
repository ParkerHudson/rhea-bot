module.exports = {
    name: 'avatar',
    description: 'Displays your avatar or any mentioned user avatar',
    aliases: ['icon'],
    cooldown: 3,
    usage: '[@user ...]',
    execute(message) {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: <${resolveAvatarURL(message.author)}>`);
        }

        const avatarList = message.mentions.users.map(
            user => `${user.username}'s avatar: <${resolveAvatarURL(user)}>`,
        );

        return message.channel.send(avatarList);
    },
};

function resolveAvatarURL(user) {
    const resolver = user.displayAvatarURL;
    if (typeof resolver === 'function') {
        return resolver({ format: 'png', dynamic: true, size: 1024 });
    }

    return resolver;
}
