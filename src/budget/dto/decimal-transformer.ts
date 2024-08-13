import Decimal from 'decimal.js';
import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  to(decimal?: Decimal): string | null {
    return decimal?.toString();
  }
  from(decimal?: string): Decimal | null {
    return decimal ? new Decimal(decimal) : null;
  }
}
export const DecimalToString =
  (decimals: number = 2) =>
  (decimal?: Decimal) =>
    decimal?.toFixed?.(decimals) || decimal;
