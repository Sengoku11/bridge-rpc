import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { MantleBridge } from '../bridge';
import { ProveDto } from './prove.dto';

@Controller('prove')
export class ProveController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  /*
  curl -X POST http://localhost:3020/prove \
     -H "Content-Type: application/json" \
     -d '{"txHash": "0xaf98c986659ca38c2a9df53071334a2b42d8c828bacd47446b6ae81a7b188453"}'
  */
  @Post()
  async prove(@Body() proveDto: ProveDto) {
    const startTime = Date.now();

    try {
      const txHash = await this.mantleBridge.prove(proveDto.txHash);
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
