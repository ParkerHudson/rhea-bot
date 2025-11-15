module.exports = {
    name: 'roll',
    description:
        'Roll dice in the format XdY (e.g. 2d6) with optional modifiers separated by + (e.g. 2d6+3)',
    usage: '<dice expression>',
    args: true,
    execute(message, args) {
        if (!args.length) {
            return message.reply('please provide a dice expression (e.g. `2d6+4`).');
        }

        const expression = args.join('').replace(/\s+/g, '');
        const segments = expression.split('+').filter(Boolean);

        if (!segments.length) {
            return message.reply('I could not understand that dice expression.');
        }

        const diceSummary = [];
        let total = 0;

        for (const segment of segments) {
            const match = segment.match(/^(\d*)d(\d+)$/i);
            if (match) {
                const diceCount = clampDiceCount(match[1] ? parseInt(match[1], 10) : 1);
                const diceSize = parseInt(match[2], 10);

                if (Number.isNaN(diceSize) || diceSize <= 0) {
                    return message.reply(`\`${segment}\` is not a valid dice size.`);
                }

                const rolls = rollMultipleDice(diceCount, diceSize);
                diceSummary.push(`${segment}: [${rolls.join(', ')}]`);
                total += rolls.reduce((sum, roll) => sum + roll, 0);
                continue;
            }

            const modifier = Number(segment);
            if (Number.isNaN(modifier)) {
                return message.reply(`I couldn't parse \`${segment}\` as part of the dice expression.`);
            }

            total += modifier;
            diceSummary.push(`+${modifier}`);
        }

        const resultMessage = [
            diceSummary.length ? `**Dice Rolls:** ${diceSummary.join(', ')}` : null,
            `**Total:** ${total}`,
        ]
            .filter(Boolean)
            .join('\n');

        return message.channel.send(resultMessage);
    },
};

function rollMultipleDice(count, size) {
    const rolls = [];
    for (let i = 0; i < count; i += 1) {
        rolls.push(1 + Math.floor(Math.random() * size));
    }
    return rolls;
}

function clampDiceCount(count) {
    if (Number.isNaN(count) || count <= 0) {
        return 1;
    }

    return Math.min(count, 100);
}
