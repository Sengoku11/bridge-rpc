import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { MantleBridge } from '../bridge';
import { ApproveDto } from './approve.dto';

@Controller('approve')
export class ApproveController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  /*
  curl -X POST http://localhost:3020/approve \
     -H "Content-Type: application/json" \
     -d '{"ticker": "ETH", "amount": "1000000000000", "layer": "L2"}'
  */
  @Post()
  async approve(@Body() approveDto: ApproveDto) {
    const startTime = Date.now();
    const amount = BigInt(approveDto.amount);
    const ticker = approveDto.ticker.toUpperCase();

    if (approveDto.layer !== 'L1' && approveDto.layer !== 'L2') {
      throw new BadRequestException(
        `Invalid layer: ${approveDto.layer}. Must be 'L1' or 'L2'.`,
      );
    }

    try {
      const txHash = await this.mantleBridge.approve(
        ticker,
        amount,
        approveDto.layer,
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
