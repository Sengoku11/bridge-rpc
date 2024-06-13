import {
  Controller,
  Get,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import { MantleBridge } from '../bridge';

@Controller('status')
export class StatusController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  @Get(':txHash')
  async txStatus(@Param('txHash') txHash: string) {
    const startTime = Date.now();
    try {
      const txStatus = await this.mantleBridge.status(txHash);
      const latency = Date.now() - startTime;
      return { txStatus, latency };
    } catch (error) {
      const latency = Date.now() - startTime;
      throw new InternalServerErrorException({
        error: error.message,
        latency,
      });
    }
  }
}
