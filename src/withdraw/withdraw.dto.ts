import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({
    description:
      'The currency ticker symbol, representing the type of cryptocurrency.',
    example: 'ETH',
    enum: ['ETH', 'MNT', 'ERC20'],
  })
  ticker: string;

  @ApiProperty({
    description:
      'The amount to withdraw, expressed as a string representation of a BigInt. This value should be the smallest indivisible unit of the token (such as Wei for Ethereum).',
    example: '1000000000000000000',
  })
  amount: string;
}
