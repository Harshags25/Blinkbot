# blinkaibot

@blinkaibot is an AI-powered Twitter bot that helps users find the correct Solana Blinks for various blockchain transactions. Users can tag the bot in a tweet with their request, and BlinkAIbot will respond with the appropriate Blink URL,

📌 How It Works

- Users tweet their request and tag @blinkaibot.

- The bot processes the request and finds the correct Solana Blink.

- The bot replies with the appropriate Blink URL.

```
@blinkaibot Stake hSOL
@blinkaibot Coin flip game
@blinkaibot Buy .sol domain
@blinkaibot Swap SOL to JUP
@blinkaibot Create a donation Blink for <wallet_address>
```
 
## Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm
- Twitter account credentials

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Harshags25/Blinkbot
cd BlinkBot
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
// POSTGRES DB to store the querys
DATABASE_URL=""
```

4. Set up the database:
```bash
pnpm prisma generate
pnpm prisma db push
```

## Usage

1. Start the bot:
```bash
pnpm start
```

## Development

### Building the Project

```bash
pnpm build
```
 
## Project Structure

```
BlinkBot/
├── src/               # Source code
│   ├── ai.ts         # AI integration
│   ├── index.ts      # Main entry point
│   ├── tools/        # Blockchain tools
│   └── types.ts      # TypeScript types
├── prisma/           # Database schema
├── dist/             # Compiled output
└── package.json      # Project configuration
```

## Dependencies

- @prisma/client: Database ORM
- @solana/web3.js: Solana blockchain integration
- agent-twitter-client: Twitter API client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 
