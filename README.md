# Ethereum - Mantle Bridge
This project provides a bridge between the Ethereum blockchain and the Mantle chain using the NestJS framework. 
It offers a robust and efficient solution for multi-stage liquidity transfers, leveraging the convenience of RPC 
to ensure atomic separation of commands. 

This approach mitigates the impact of errors or disconnections at any step of the liquidity transfer process, which can take 
up to 7 days on the mainnet. The server is designed to be easily integrated into any environment as a microservice.

## Running the app
#### 1. Prepare .env file. 
Optionally add new ERC-20 tokens to `/src/tokens/...` and create `mainnet.json` file.

If you want to add a brand new ERC-20 token, you can follow my example: https://github.com/mantlenetworkio/mantle-token-lists/pull/79

#### 2. Run:
```bash
# in container
docker compose up -d  # or docker-compose up -d

# installation
$ yarn install

# local development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
#### 3. Open http://localhost:3020 in your browser.

## Examples
- [Deposit tx](https://sepolia.etherscan.io/tx/0x4bb0d94f7b588f26f6ebe2e4fa0f4dbf23fb8f9468149e5c4d2fa15595c4c33b)
- [Prove tx](https://sepolia.etherscan.io/tx/0xfb0eae17f02dc4ad44cf0f9845fec2511c21bf7baf9d4bd5fa647feb21a2c327)
- [Finalize tx](https://sepolia.etherscan.io/tx/0xd689de7acd3b87ef2d1be7cf30d86cdad7b11d21dc1c26ef21250721773dbba0)
- [Withdrawal tx](https://sepolia.mantlescan.xyz/tx/0x1e6755bb7b4191b8c786939d28d66a8c5b1259ab2f50a8f7a5dd5d5e484e17e5)

[Check more transactions in my wallet](https://sepolia.etherscan.io/address/0xc492ad183c47196c34d3650bbac6a9b986fd4be0)

## Faucets
- **ETH**: https://faucets.chain.link/sepolia, https://cloud.google.com/application/web3/faucet/ethereum/sepolia
- **MNT**: https://faucet.testnet.mantle.xyz/
- **LINK**: https://faucets.chain.link/sepolia
