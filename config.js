const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

let fileConfig = {};
if (fs.existsSync(configPath)) {
    try {
        fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
        console.warn('Could not parse config.json, falling back to environment variables.', error);
    }
}

const prefix = process.env.DISCORD_PREFIX || fileConfig.prefix || '!';
const token = process.env.DISCORD_TOKEN || fileConfig.token || '';

module.exports = { prefix, token };
