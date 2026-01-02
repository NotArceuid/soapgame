import { SvelteMap } from "svelte/reactivity";
import { InvokeableEvent } from "../Shared/Events";
import { ReactiveText } from "../Shared/ReactiveText.svelte.ts";
import { Decimal } from "../Shared/BreakInfinity/Decimal.svelte.ts";
import { ExpPolynomial } from "../Shared/Math.ts";
import { Player } from "../Player.svelte.ts";

export const UnlockUpgrades: InvokeableEvent<UpgradesKey> = new InvokeableEvent<UpgradesKey>();
export const UpgradesData: SvelteMap<UpgradesKey, IUpgrades> = new SvelteMap<UpgradesKey, IUpgrades>();

export enum UpgradesKey { Bulk, MaxBulk, SpeedUpgrade, QualityUpgrade, OCD, TierUp, OrangeSoap, EatRedSoap, Cat }

export interface IUpgrades {
  name: string,
  description: () => ReactiveText,
  maxCount: number,
  Requirements: [() => ReactiveText, () => boolean][];
  ShowCondition: Array<() => boolean>;
  getMax?: () => number;
  unlocked?: boolean;
  buyAmount?: number;
}

class BulkUpgrade implements IUpgrades {
  name = "Grr my fingers hurt!!";
  description = () => new ReactiveText("Unlocks Bulk");
  maxCount = 1;
  Requirements = [[() => new ReactiveText("Cost: 1,000"), () => true]] as [() => ReactiveText, () => boolean][];
  ShowCondition = [() => true];
}

class MaxBulkUpgrade implements IUpgrades {
  name = "My fingers still hurt!!";
  description = () => new ReactiveText("Unlocks Max Buttons in bulk");
  maxCount = 1;
  Requirements = [[() => new ReactiveText("Cost: 25,000"), () => true]] as [() => ReactiveText, () => boolean][];
  ShowCondition = [() => true];
}

class SpeedUpgrade implements IUpgrades {
  name = "It's too slow!!";
  description = () => new ReactiveText("Improves Producer Speed by 100%");
  unlocked = true;
  maxCount = 700;
  buyAmount = $state(1);
  private speedCost = new ExpPolynomial(new Decimal(100), new Decimal(1.15));
  private level = () => Player.SoapUpgrades.get(UpgradesKey.SpeedUpgrade) ?? 0;

  Requirements = [
    [
      () => {
        return new ReactiveText(`Cost: ${this.speedCost.Integrate(this.level(), this.level() + this.buyAmount).format()}`)
      },
      () => {
        return Player.Money.gte(this.speedCost.Integrate(this.level(), this.level() + this.buyAmount)) && this.level() < this.maxCount
      }
    ]
  ] as [() => ReactiveText, () => boolean][];

  getMax = () => {
    let amt = this.speedCost.BuyMax(Player.Money, this.level());
    return amt == -1 ? 1 : amt;
  }

  ShowCondition = [() => true];
}

class QualityUpgrade implements IUpgrades {
  name = "Not rich enough!!";
  description = () => new ReactiveText("Improves Producer Quality by 100%");
  unlocked = true;
  maxCount = 600;
  buyAmount = $state(1);
  private level = () => Player.SoapUpgrades.get(UpgradesKey.QualityUpgrade) ?? 0;
  private qualityCost = new ExpPolynomial(new Decimal(100), new Decimal(1.17));

  Requirements = [
    [
      () => {
        return new ReactiveText(`Cost: ${this.qualityCost.Integrate(this.level(), this.level() + this.buyAmount).format()}`)
      },
      () => {
        return Player.Money.gte(this.qualityCost.Integrate(this.level(), this.level() + this.buyAmount)) && this.level() < this.maxCount
      }
    ]
  ] as [() => ReactiveText, () => boolean][];

  getMax = () => {
    let amt = this.qualityCost.BuyMax(Player.Money, this.level());
    return amt == -1 ? 1 : amt;
  }

  ShowCondition = [() => true];
}

class OCDUpgrade implements IUpgrades {
  name = "Do you have OCD?";
  description = () => new ReactiveText("Unlock OCD Buy");
  maxCount = 1;
  Requirements = [[() => new ReactiveText("Cost: 24999.98"), () => true]] as [() => ReactiveText, () => boolean][];
  ShowCondition = [() => true];
}

class TierUpUpgrade implements IUpgrades {
  name = "Promotions";
  description = () => new ReactiveText("Unlock Tier up");
  maxCount = 1;
  Requirements = [[() => new ReactiveText("Cost: 100,000"), () => true]] as [() => ReactiveText, () => boolean][];
  ShowCondition = [() => true];
}

class OrangeSoapUpgrade implements IUpgrades {
  name = "Unlock orange soap";
  description = () => new ReactiveText("I hope they don't contain any harmful chemicals");
  maxCount = 1;
  Requirements = [[() => new ReactiveText("Cost: 1.00m"), () => true]] as [() => ReactiveText, () => boolean][];
  ShowCondition = [() => true];
}

class EatRedSoapUpgrade implements IUpgrades {
  name = "Learn to eat red soap";
  description = () => new ReactiveText("Why would you do that?");
  maxCount = 1;
  Requirements = [[() => new ReactiveText("Cost: 2.50m"), () => true]] as [() => ReactiveText, () => boolean][];
  ShowCondition = [() => true];
}

class CatUpgrade implements IUpgrades {
  name = "Buy a.. cat?";
  description = () => new ReactiveText("Quite an expensive kitten");
  maxCount = 1;
  Requirements = [[() => new ReactiveText("Cost: 5.00m"), () => true]] as [() => ReactiveText, () => boolean][];
  ShowCondition = [() => true];
}

UpgradesData.set(UpgradesKey.Bulk, new BulkUpgrade());
UpgradesData.set(UpgradesKey.MaxBulk, new MaxBulkUpgrade());
UpgradesData.set(UpgradesKey.SpeedUpgrade, new SpeedUpgrade());
UpgradesData.set(UpgradesKey.QualityUpgrade, new QualityUpgrade());
UpgradesData.set(UpgradesKey.OCD, new OCDUpgrade());
UpgradesData.set(UpgradesKey.TierUp, new TierUpUpgrade());
UpgradesData.set(UpgradesKey.OrangeSoap, new OrangeSoapUpgrade());
UpgradesData.set(UpgradesKey.EatRedSoap, new EatRedSoapUpgrade());
UpgradesData.set(UpgradesKey.Cat, new CatUpgrade());
