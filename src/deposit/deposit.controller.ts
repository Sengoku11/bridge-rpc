import {
  Post,
  Body,
  Controller,
  InternalServerErrorException,
} from '@nestjs/common';
import { MantleBridge } from '../bridge';
import { DepositDto } from './deposit.dto';

@Controller('deposit')
export class DepositController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  /*
  curl -X POST http://localhost:3020/deposit \
     -H "Content-Type: application/json" \
     -d '{"ticker": "ETH", "amount": "1000000000000"}'
  */
  @Post()
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
