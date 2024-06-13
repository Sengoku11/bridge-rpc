import { Injectable } from '@nestjs/common';
import { CrossChainMessenger, MessageStatus } from '@mantleio/sdk';
import dotenv from 'dotenv';
import { providers, Wallet } from 'ethers';
import * as fs from 'fs';
import * as process from 'process';
import { TransactionResponse } from '@ethersproject/abstract-provider';

dotenv.config();

interface Token {
  symbol: string;
  addressL1: string;
  addressL2: string;
  decimals: number;
}

interface TokensData {
  name: string;
  tokens: Token[];
}

function getMessageStatusName(status: MessageStatus): string {
  switch (status) {
    case MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE:
      return 'UNCONFIRMED_L1_TO_L2_MESSAGE';
    case MessageStatus.FAILED_L1_TO_L2_MESSAGE:
      return 'FAILED_L1_TO_L2_MESSAGE';
    case MessageStatus.STATE_ROOT_NOT_PUBLISHED:
      return 'STATE_ROOT_NOT_PUBLISHED';
    case MessageStatus.READY_TO_PROVE:
      return 'READY_TO_PROVE';
    case MessageStatus.IN_CHALLENGE_PERIOD:
      return 'IN_CHALLENGE_PERIOD';
    case MessageStatus.READY_FOR_RELAY:
      return 'READY_FOR_RELAY';
    case MessageStatus.RELAYED:
      return 'RELAYED';
    default:
      return 'UNKNOWN_STATUS';
  }
}

@Injectable()
export class MantleBridge {
  public readonly GWEI = 1_000_000_000;
  public readonly l2GasPrice: number;
  public readonly network: string;
  private readonly crossChainMessenger: CrossChainMessenger;
  private readonly erc20ABI;
  private readonly tokens: TokensData;
  private readonly l1Wallet: Wallet;
  private readonly l2Wallet: Wallet;
  private readonly l1RpcProvider: providers.JsonRpcProvider;
  private readonly l2RpcProvider: providers.JsonRpcProvider;

  constructor() {
    this.network = process.env.EXEC_ENV;
    this.l2GasPrice = 0.03 * this.GWEI;

    const key = process.env.PRIV_KEY!;
    this.l1RpcProvider = new providers.JsonRpcProvider(process.env.L1_RPC);
    this.l2RpcProvider = new providers.JsonRpcProvider(process.env.L2_RPC);
    this.l1Wallet = new Wallet(key, this.l1RpcProvider);
    this.l2Wallet = new Wallet(key, this.l2RpcProvider);
    this.crossChainMessenger = new CrossChainMessenger({
      l1ChainId: Number(process.env.L1_CHAINID),
      l2ChainId: Number(process.env.L2_CHAINID),
      l1SignerOrProvider: this.l1Wallet,
      l2SignerOrProvider: this.l2Wallet,
      bedrock: true,
    });

    this.erc20ABI = JSON.parse(fs.readFileSync('src/abi/erc20.json', 'utf-8'));

    const tokensPath =
      this.network === 'testnet'
        ? 'src/tokens/testnet.json'
        : 'src/tokens/mainnet.json';
    this.tokens = JSON.parse(
      fs.readFileSync(tokensPath, 'utf-8'),
    ) as TokensData;
  }

  async deposit(
    tokenType: 'ETH' | 'MNT' | 'ERC20',
    amount: bigint,
    tokenSymbol?: string,
  ): Promise<string> {
    let response: TransactionResponse;

    if (tokenType === 'ETH') {
      response = await this.crossChainMessenger.depositETH(amount.toString());
    } else if (tokenType === 'MNT') {
      response = await this.crossChainMessenger.depositMNT(amount.toString());
    } else if (tokenType === 'ERC20') {
      if (!tokenSymbol) {
        throw new Error('Token symbol is required for ERC20 deposits');
      }
      const token = this.tokens.tokens.find((t) => t.symbol === tokenSymbol);
      if (!token) {
        throw new Error(`Token with symbol ${tokenSymbol} not found`);
      }
      response = await this.crossChainMessenger.depositERC20(
        token.addressL1,
        token.addressL2,
        amount.toString(),
      );
    } else {
      throw new Error('Unsupported token type');
    }

    console.log(`Transaction hash (on L1): ${response.hash}`);
    await response.wait();

    return response.hash;
  }

  async withdraw(
    tokenType: 'ETH' | 'MNT' | 'ERC20',
    amount: bigint,
    tokenSymbol?: string,
  ) {
    let response: TransactionResponse;

    const currentNonce = await this.l2RpcProvider.getTransactionCount(
      this.l2Wallet.address,
    );

    const opts = {
      overrides: {
        gasLimit: 10_000_000_000,
        // gasPrice: this.l2GasPrice,
        nonce: currentNonce + 1,
      },
    };

    if (tokenType === 'ETH') {
      response = await this.crossChainMessenger.withdrawETH(
        amount.toString(),
        opts,
      );
    } else if (tokenType === 'MNT') {
      response = await this.crossChainMessenger.withdrawMNT(
        amount.toString(),
        opts,
      );
    } else if (tokenType === 'ERC20') {
      if (!tokenSymbol) {
        throw new Error('Token symbol is required for ERC20 deposits');
      }
      const token = this.tokens.tokens.find((t) => t.symbol === tokenSymbol);
      if (!token) {
        throw new Error(`Token with symbol ${tokenSymbol} not found`);
      }
      response = await this.crossChainMessenger.withdrawERC20(
        token.addressL1,
        token.addressL2,
        amount.toString(),
        opts,
      );
    } else {
      throw new Error('Unsupported token type');
    }

    await response.wait();

    return response.hash;
  }

  async prove(txHash: string) {
    const opts = {
      overrides: {
        gasLimit: 400_000,
        maxPriorityFeePerGas: 0.001 * this.GWEI,
      },
    };

    const response = await this.crossChainMessenger.proveMessage(txHash, opts);

    await response.wait();

    return response.hash;
  }

  async finalize(txHash: string) {
    const opts = {
      overrides: {
        gasLimit: 800_000,
        maxPriorityFeePerGas: 0.001 * this.GWEI,
      },
    };

    const response = await this.crossChainMessenger.finalizeMessage(
      txHash,
      opts,
    );

    await response.wait();

    return response.hash;
  }

  async status(txHash: string): Promise<string> {
    return getMessageStatusName(
      await this.crossChainMessenger.getMessageStatus(txHash),
    );
  }

  async approve(tokenSymbol: string, amount: bigint, layer: 'L1' | 'L2') {
    const currentNonce = await this.l2RpcProvider.getTransactionCount(
      this.l2Wallet.address,
    );

    const opts = {
      signer: layer == 'L1' ? this.l1Wallet : this.l2Wallet,
      overrides:
        layer == 'L1'
          ? undefined
          : {
              gasLimit: 10_000_000_000,
              gasPrice: this.l2GasPrice,
              nonce: currentNonce + 1,
            },
    };

    const token = this.tokens.tokens.find((t) => t.symbol === tokenSymbol);

    // Need the l2 address to know which bridge is responsible
    const approvalResponse = await this.crossChainMessenger.approveERC20(
      token.addressL1,
      token.addressL2,
      amount.toString(),
      opts,
    );

    console.log(`Transaction hash (on ${layer}): ${approvalResponse.hash}`);

    await approvalResponse.wait();

    return approvalResponse.hash;
  }
}
