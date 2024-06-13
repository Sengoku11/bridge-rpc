import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { MantleBridge } from '../bridge';
import { WithdrawDto } from './withdraw.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('withdrawal')
@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  @Post()
  @ApiOperation({
    summary: 'Withdraw tokens',
    description: 'Withdraws the specified amount of tokens.',
  })
  @ApiBody({
    type: WithdrawDto,
    description: 'Details of the withdraw transaction.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful withdraw',
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
  async withdraw(@Body() withdrawDto: WithdrawDto) {
    const startTime = Date.now();
    const amount = BigInt(withdrawDto.amount);
    const ticker = withdrawDto.ticker.toUpperCase();

    const tokenType = ticker === 'ETH' || ticker === 'MNT' ? ticker : 'ERC20';

    try {
      const txHash = await this.mantleBridge.withdraw(
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
