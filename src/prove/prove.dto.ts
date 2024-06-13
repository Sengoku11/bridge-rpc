import { ApiProperty } from '@nestjs/swagger';

export class ProveDto {
  @ApiProperty({
    description:
      'The transaction hash of a withdrawal operation that is awaiting a finalize transaction.',
    example:
      '0x1e6755bb7b4191b8c786939d28d66a8c5b1259ab2f50a8f7a5dd5d5e484e17e5',
  })
  txHash: string;
}
