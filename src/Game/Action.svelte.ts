import type { Decimal } from "./Shared/BreakInfinity/Decimal.svelte";

export interface IProgress {
  valueGain: Decimal;
  value: Decimal;
  maxValue: Decimal;
}
