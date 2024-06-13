import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { MantleBridge } from '../bridge';
import { ApproveDto } from './approve.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('approve')
export class ApproveController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  @Post()
  @ApiOperation({
    summary: 'Approve tokens',
    description:
      'Approves the specified amount of tokens on the specified layer.',
  })
  @ApiBody({
    type: ApproveDto,
    description: 'Details of the approval transaction.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful approval',
    schema: {
      example: { txHash: '0xabc123...', latency: 120 },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        error: "Invalid layer: L3. Must be 'L1' or 'L2'.",
        latency: 120,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: { error: 'Error message', latency: 120 },
    },
  })
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
