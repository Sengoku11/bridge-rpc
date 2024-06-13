/**
 * Data Transfer Object (DTO) for approval operations.
 *
 * @property {string} ticker - The currency ticker symbol, representing the type of cryptocurrency.
 *                              Examples include 'ETH' for Ethereum, 'MNT' for Mantle.
 *                              This should be a valid, recognized currency symbol.
 *
 * @property {string} amount - The amount to deposit, expressed as a string representation of a BigInt.
 *                             This value should be the smallest indivisible unit of the token (such as Wei for Ethereum).
 *                             For instance, '1000000000000000000' stands for 1 ETH.
 *
 * @property {'L1' | 'L2'} layer - Specifies the blockchain layer where the approval transaction should take place.
 *                                 'L1' refers to the Layer 1 blockchain, such as Ethereum.
 *                                 'L2' refers to the Layer 2 solution, such as Mantle.
 *                                 This distinction determines the execution environment for the transaction.
 */
export class ApproveDto {
  /**
   * The currency ticker symbol.
   * Example: 'ETH', 'MNT'.
   */
  ticker: string;

  /**
   * The amount to deposit, represented as a string of a BigInt value.
   * Example: '1000000000000000000' for 1 ETH.
   */
  amount: string;

  /**
   * Specifies the blockchain layer where the approval transaction should take place.
   * 'L1' refers to the Layer 1 blockchain (Ethereum).
   * 'L2' refers to the Layer 2 solution (Mantle).
   * Example: 'L2' for approve transactions in Mantle.
   */
  layer: 'L1' | 'L2';
}
