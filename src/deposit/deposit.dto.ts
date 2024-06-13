import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({
    description:
      'The currency ticker symbol, representing the type of cryptocurrency.',
    example: 'ETH',
    enum: ['ETH', 'MNT', 'ERC20'],
  })
  ticker: string;

  @ApiProperty({
    description:
      'The amount to deposit, expressed as a string representation of a BigInt.',
    example: '1000000000000000000',
  })
  amount: string;
}
