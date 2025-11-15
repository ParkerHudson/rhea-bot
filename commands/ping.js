module.exports = {
    name: 'ping',
    description: 'Check the bot latency',
    cooldown: 2,
    async execute(message) {
        const sent = await message.channel.send('Pinging...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(message.client.ping);

        return sent.edit(`Pong! Round-trip: ${latency}ms | API: ${apiLatency}ms`);
    },
};
