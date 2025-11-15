# rhea-bot

An all-purpose Discord bot that bundles a few utility commands (ping, avatar lookup, dice rolling, command reloads, etc.) for my personal server. The project is intentionally small so it can be used as a starting point for experimenting with new commands.

## Features

- Modular command loader with hot-reload support (`!reload <command>`).
- Helpful utilities such as `!ping`, `!avatar`, `!roll`, and `!help`.
- Built-in cooldown handling plus argument validation.

## Getting Started

### Prerequisites

- Node.js (v12+ recommended).
- A Discord bot application + token (create one from the [Discord Developer Portal](https://discord.com/developers/applications)).

### Installation

```bash
git clone git@github.com:<you>/rhea-bot.git
cd rhea-bot
npm install
```

### Configuration

You can provide the bot token/prefix through a `config.json` file (kept out of Git) or via environment variables.

1. Copy the template:

   ```bash
   cp config.example.json config.json
   ```

2. Edit `config.json` with your preferred prefix and Discord bot token.

   _Alternatively_, set environment variables before running the bot:

   ```bash
   set DISCORD_TOKEN=your-token-here
   set DISCORD_PREFIX=!
   ```

   (Use `export` instead of `set` on macOS/Linux.)

### Running the Bot

```bash
npm start
```

The bot logs in and prints `Ready!` when it successfully connects.

## Available Commands

| Command  | Description                                                      |
|----------|------------------------------------------------------------------|
| `help`   | Lists every command or details for a specific command.           |
| `ping`   | Measures round-trip/API latency.                                 |
| `avatar` | Shows your avatar or the avatars of mentioned users.             |
| `roll`   | Rolls dice expressions like `2d6+3`.                             |
| `reload` | Reloads a command module without restarting the bot.             |

Feel free to add more commands inside the `commands/` directory – each file exports an object with `name`, optional metadata, and an `execute` function that receives `(message, args)`.

## Contributing / Notes

- Keep your real `config.json` and `.env` files private – they are in `.gitignore` so accidental commits don’t leak tokens.
- When deploying to hosting providers or CI, configure `DISCORD_TOKEN` as a secret environment variable instead of embedding it in the repo.
- Commands are hot-reloaded via `!reload <name>`, so you can iterate quickly without restarting the process.
