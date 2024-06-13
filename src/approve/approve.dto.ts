import { ApiProperty } from '@nestjs/swagger';

export class ApproveDto {
  @ApiProperty({
    description:
      'The currency ticker symbol, representing the type of cryptocurrency.',
    example: 'ETH',
    enum: ['ETH', 'MNT', 'ERC20'],
  })
  ticker: string;

  /**
   * The amount to approve, represented as a string of a BigInt value.
   * Example: '1000000000000000000' for 1 ETH.
   */
  @ApiProperty({
    description:
      'The amount to approve, expressed as a string representation of a BigInt. This value should be the smallest indivisible unit of the token (such as Wei for Ethereum).',
    example: '1000000000000000000',
  })
  amount: string;

  /**
   * Specifies the blockchain layer where the approval transaction should take place.
   * 'L1' refers to the Layer 1 blockchain (Ethereum).
   * 'L2' refers to the Layer 2 solution (Mantle).
   * Example: 'L2' for approve transactions in Mantle.
   */
  @ApiProperty({
    description:
      'Specifies the blockchain layer where the approval transaction should take place. "L1" for Layer 1 (Ethereum), "L2" for Layer 2 (Mantle).',
    example: 'L2',
    enum: ['L1', 'L2'],
  })
  layer: 'L1' | 'L2';
}
