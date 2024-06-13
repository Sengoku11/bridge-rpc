import { Body, Controller, InternalServerErrorException, Post } from "@nestjs/common";
import { MantleBridge } from "../bridge";
import { WithdrawDto } from "./withdraw.dto";

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly mantleBridge: MantleBridge) {}

  /*
  curl -X POST http://localhost:3020/withdraw \
     -H "Content-Type: application/json" \
     -d '{"ticker": "ETH", "amount": "1000000000000"}'
  */
  @Post()
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
