/**
 * Data Transfer Object (DTO) for finalize operations.
 *
 * @property {string} txHash - The transaction hash of a withdrawal operation that is waiting for a finalize transaction.
 *                              This hash is used to identify and validate the withdrawal transaction in the blockchain.
 *                              It should be a valid hash string generated by the blockchain during the withdrawal process.
 */
export class FinalizeDto {
  /**
   * The transaction hash of a withdrawal operation that is awaiting a finalize transaction.
   * This is used to identify and confirm the withdrawal transaction on the blockchain.
   * Example: '0x1234567890abcdef...'
   */
  txHash: string;
}
