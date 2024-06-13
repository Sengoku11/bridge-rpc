/**
 * Data Transfer Object (DTO) for withdraw operations.
 *
 * @property {string} ticker - The currency ticker symbol, representing the type of cryptocurrency.
 *                              Examples include 'ETH' for Ethereum, 'MNT' for Mantle.
 *                              This should be a valid, recognized currency symbol.
 *
 * @property {string} amount - The amount to deposit, expressed as a string representation of a BigInt.
 *                             This value should be the smallest indivisible unit of the token (such as Wei for Ethereum).
 *                             For instance, '1000000000000000000' stands for 1 ETH.
 */
export class WithdrawDto {
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
}
