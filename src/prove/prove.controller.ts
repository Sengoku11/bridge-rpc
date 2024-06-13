import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { MantleBridge } from '../bridge';
import { ProveDto } from './prove.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('withdrawal')
@Controller('prove')
export class ProveController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  @Post()
  @ApiOperation({
    summary: 'Prove withdrawal',
    description: 'Proves the specified withdrawal transaction.',
  })
  @ApiBody({ type: ProveDto, description: 'Details of the prove transaction.' })
  @ApiResponse({
    status: 200,
    description: 'Successful prove',
    schema: {
      example: {
        txHash:
          '0x1234567890abcdef...',
        latency: 100,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: { error: 'Error message', latency: 100 },
    },
  })
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
