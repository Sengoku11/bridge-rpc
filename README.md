# Ethereum - Mantle Bridge
This project provides a bridge between the Ethereum blockchain and the Mantle chain using the NestJS framework. 
It offers a robust and efficient solution for multi-stage liquidity transfers, leveraging the convenience of RPC 
to ensure atomic separation of commands. 

This approach mitigates the impact of errors or disconnections at any step of the liquidity transfer process, which can take 
up to 7 days on the mainnet. The server is designed to be easily integrated into any environment as a microservice.

## Faucets
- **ETH**: https://faucets.chain.link/sepolia, https://cloud.google.com/application/web3/faucet/ethereum/sepolia
- **MNT**: https://faucet.testnet.mantle.xyz/
- **LINK**: https://faucets.chain.link/sepolia

## Installation
```bash
$ yarn install
```

## Running the app
#### 1. Prepare .env file. 
Optionally add new ERC-20 tokens to `/src/tokens/...` and create `mainnet.json` file.
#### 2. Run:
```bash
# in container
docker compose up -d  # or docker-compose up -d

# local development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
#### 3. Open http://localhost:3020 in your browser.

## Test
```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
