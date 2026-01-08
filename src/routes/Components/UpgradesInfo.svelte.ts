import type { ReactiveText } from "../../Game/Shared/ReactiveText.svelte";
export interface IUpgradesInfo {
  name: string;
  description: () => ReactiveText;
  Requirements: [() => ReactiveText, () => boolean];
  count: number;
  maxCount: number;
  effect?: () => ReactiveText

  getMax?: () => number;
  buyAmount: number;
  buy: () => void;
}
