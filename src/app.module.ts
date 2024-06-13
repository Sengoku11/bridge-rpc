import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MantleBridge } from './bridge';
import { StatusController } from './status/status.controller';
import { DepositController } from './deposit/deposit.controller';
import { ApproveController } from './approve/approve.controller';
import { WithdrawController } from './withdraw/withdraw.controller';
import { ProveController } from './prove/prove.controller';
import { FinalizeController } from './finalize/finalize.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    StatusController,
    DepositController,
    ApproveController,
    WithdrawController,
    ProveController,
    FinalizeController,
  ],
  providers: [MantleBridge],
})
export class AppModule {}
