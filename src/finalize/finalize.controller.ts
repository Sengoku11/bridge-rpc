import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { MantleBridge } from '../bridge';
import { FinalizeDto } from './finalize.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('withdrawal')
@Controller('finalize')
export class FinalizeController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  @Post()
  @ApiOperation({
    summary: 'Finalize withdrawal',
    description: 'Finalizes the specified withdrawal transaction.',
  })
  @ApiBody({
    type: FinalizeDto,
    description: 'Details of the finalize transaction.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful finalize',
    schema: {
      example: { txHash: '0x1234567890abcdef...', latency: 100 },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: { error: 'Error message', latency: 100 },
    },
  })
  async finalize(@Body() finalizeDto: FinalizeDto) {
    const startTime = Date.now();

    try {
      const txHash = await this.mantleBridge.finalize(finalizeDto.txHash);
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
