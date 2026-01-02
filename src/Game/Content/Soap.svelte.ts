import { Player } from "../Player.svelte";
import { Decimal } from "../Shared/BreakInfinity/Decimal.svelte";

export class Soap implements ISoapData {
  public Type: SoapType;
  public Tier: number;
  public Amount: Decimal;
  public Quality: Decimal;
  public SoapGain: Decimal;
  public Progress: Decimal;
  public MaxProgress: Decimal;
  public Unlocked: boolean;

  constructor(data: ISoapData) {
    this.Type = data.Type;
    this.Tier = $state(data.Tier);
    this.Amount = $state(data.Amount);
    this.Quality = $state(data.Quality);
    this.SoapGain = $state(data.SoapGain);
    this.Progress = $state(data.Progress);
    this.MaxProgress = $state(data.MaxProgress);
    this.Unlocked = $state(data.Unlocked);
  }

  public CanSell(amount: Decimal): boolean {
    return this.Amount >= amount;
  }

  public Sell(amount: Decimal) {
    Player.Money = Player.Money.add(this.Quality.mul(amount));
    this.Amount = this.Amount.minus(amount);
  }

  public AddProgress(value: Decimal) {
    this.Progress = this.Progress.add(value);
    if (this.Progress.gte(this.MaxProgress)) {
      this.Progress = Decimal.ZERO;
      this.SoapMade(this.SoapGain);
    }
  }

  public SoapMade(gain: Decimal) {
    this.Amount = this.Amount.add(gain);
  }
}

export enum SoapPages {
  Sell, Produce, Upgrades
}

export enum SoapType {
  Red = "Red Soap",
  Orange = "Orange Soap",
  Green = "Green Soap",
  Blue = "Blue Soap",
  Indigo = "Indigo Soap",
  Violet = "Violet Soap",
  White = "White Soap",
  Black = "Black Soap",
  Rainbow = "Rainbow Soap"
}

export interface ISoapData {
  Type: SoapType;
  Tier: number;
  Amount: Decimal;
  Quality: Decimal;
  SoapGain: Decimal;
  Progress: Decimal;
  MaxProgress: Decimal;
  Unlocked: boolean;
}

export const SoapData: ISoapData[] = [
  {
    Type: SoapType.Red,
    Tier: 0,
    Amount: Decimal.ZERO,
    Quality: Decimal.ONE,
    Progress: Decimal.ZERO,
    MaxProgress: new Decimal(100),
    Unlocked: true,
    SoapGain: Decimal.ONE
  }
]
