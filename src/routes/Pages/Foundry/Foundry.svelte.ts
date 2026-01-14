import { SvelteMap } from "svelte/reactivity";
import { GeneratorsData, GeneratorsKey } from "../../../Game/Foundry/Generator.svelte";
import { Update } from "../../../Game/Game.svelte";
import { Player } from "../../../Game/Player.svelte";
import { Decimal } from "../../../Game/Shared/BreakInfinity/Decimal.svelte";
import { ReactiveText } from "../../../Game/Shared/ReactiveText.svelte";
import { UpgradesData, UpgradesKey } from "../../../Game/Soap/Upgrades.svelte";

interface IMilestoneEntries {
  threshold: Decimal;
  text: () => ReactiveText;
  formula: () => Decimal;
}

export const ChargeMilestones = new SvelteMap<number, IMilestoneEntries>([
  [0, {
    threshold: new Decimal(100),
    text: () => new ReactiveText(`Producer quality ${formatChargeMilestone(0)}x`),
    formula: () => {
      if (Player.Charge.lt(100))
        return Decimal.ZERO;
      return Player.Charge.sub(100).div(100).plus(1);
    }
  }],
  [1, {
    threshold: new Decimal(100_000),
    text: () => new ReactiveText(`Producer speed ${formatChargeMilestone(1)}x`),
    formula: () => {
      if (Player.Charge.lt(100_000))
        return Decimal.ZERO;
      return Player.Charge.sub(100_000).div(100_000).plus(1);
    }
  }],
  [2, {
    threshold: new Decimal(100_000_000),
    text: () => new ReactiveText(`Sell Mult ${formatChargeMilestone(2)}x`),
    formula: () => {
      if (Player.Charge.lt(100_000_000))
        return Decimal.ZERO;
      return Player.Charge.sub(100_000_000).div(100_000_000).times(0.5).plus(1);
    }
  }],
  [3, {
    threshold: new Decimal(100_000_000_000),
    text: () => new ReactiveText(`Red Soap Gain ${formatChargeMilestone(3)}x`),
    formula: () => {
      if (Player.Charge.lt(100_000_000_000))
        return Decimal.ZERO;
      return Player.Charge.sub(100_000_000_000).div(100_000_000_000).times(2).plus(1);
    }
  }],
  [4, {
    threshold: new Decimal(100_000_000_000_000),
    text: () => new ReactiveText(`Orange Soap Gain ${formatChargeMilestone(4)}x`),
    formula: () => {
      if (Player.Charge.lt(100_000_000_000_000))
        return Decimal.ZERO;
      return Player.Charge.sub(100_000_000_000_000).div(100_000_000_000_000).times(2).plus(1);
    }
  }],
]);

function formatChargeMilestone(index: number): string {
  const thresholds = [100, 100_000, 100_000_000, 100_000_000_000, 100_000_000_000_000];
  const scalingFactors = [1, 1, 0.5, 2, 2];

  if (index >= thresholds.length) return "1";

  const threshold = thresholds[index];
  const scaling = scalingFactors[index];

  if (Player.Charge.lt(threshold)) return "1";

  const value = Player.Charge.sub(threshold).div(threshold).times(scaling).plus(1);
  return value.format();
}

Update.add(() => {
  let chargeGain = new Decimal(GeneratorsData[GeneratorsKey.ChargeSpeed].count * 0.25).mul(UpgradesData[UpgradesKey.ChargeSpeedUpgrade].count + 1);
  Player.Charge = Player.Charge.add(chargeGain);
})
