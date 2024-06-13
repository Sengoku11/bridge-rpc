import {
  Post,
  Body,
  Controller,
  InternalServerErrorException,
} from '@nestjs/common';
import { MantleBridge } from '../bridge';
import { DepositDto } from './deposit.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('deposit')
@Controller('deposit')
export class DepositController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  @Post()
  @ApiOperation({
    summary: 'Deposit tokens in L1',
    description:
      'Deposits the specified amount of tokens to the bridge contract in L1.',
  })
  @ApiBody({
    type: DepositDto,
    description: 'Details of the deposit transaction.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful deposit',
    schema: {
      example: { txHash: '0xabc123...', latency: 120 },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: { error: 'Error message', latency: 120 },
    },
  })
  async deposit(@Body() depositDto: DepositDto) {
    const startTime = Date.now();
    const amount = BigInt(depositDto.amount);
    const ticker = depositDto.ticker.toUpperCase();

    const tokenType = ticker === 'ETH' || ticker === 'MNT' ? ticker : 'ERC20';

    try {
      const txHash = await this.mantleBridge.deposit(
        tokenType,
        amount,
        tokenType === 'ERC20' ? ticker : undefined,
      );
      const latency = Date.now() - startTime;
      return { txHash, latency };
    } catch (error) {
      const latency = Date.now() - startTime;
      throw new InternalServerErrorException({
        error: error.message,
        latency,
      });
    }
  }
}
