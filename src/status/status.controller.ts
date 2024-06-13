import {
  Controller,
  Get,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import { MantleBridge } from '../bridge';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('status')
export class StatusController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  @Get(':txHash')
  @ApiOperation({
    summary: 'Get transaction status',
    description: 'Retrieves the status of the specified transaction.',
  })
  @ApiParam({
    name: 'txHash',
    description: 'The transaction hash',
    example:
      '0x1e6755bb7b4191b8c786939d28d66a8c5b1259ab2f50a8f7a5dd5d5e484e17e5',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful status retrieval',
    schema: {
      example: { txStatus: 'confirmed', latency: 100 },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: { error: 'Error message', latency: 100 },
    },
  })
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
