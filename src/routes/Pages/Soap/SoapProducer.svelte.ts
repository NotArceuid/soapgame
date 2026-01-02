import { SoapType } from "../../../Game/Content/Soap.svelte";
import { Player } from "../../../Game/Player.svelte";
import { Decimal } from "../../../Game/Shared/BreakInfinity/Decimal.svelte";
import { ExpPolynomial } from "../../../Game/Shared/Math";

export class SoapProducer implements SoapProducerProps {
  public SoapType: SoapType;
  public Speed: Decimal;
  public SpeedCount: number;
  public Quality: Decimal;
  public QualityCount: number;
  public Unlocked: boolean;
  public SpeedFormula: ExpPolynomial;
  public QualityFormula: ExpPolynomial;

  constructor(soapType: SoapType) {
    this.Speed = $state(Decimal.ONE);
    this.Quality = $state(Decimal.ONE);
    this.SoapType = $state(soapType);
    this.Unlocked = $state(true);
    this.SpeedCount = $state(0);
    this.QualityCount = $state(0);

    this.SpeedFormula = new ExpPolynomial(new Decimal(4), new Decimal(1.15));
    this.QualityFormula = new ExpPolynomial(new Decimal(2), new Decimal(1.17));
  }

  GetSpeedCost(amount: number) {
    return this.SpeedFormula.Integrate(this.SpeedCount, this.SpeedCount + amount);
  }

  GetQualityCost(amount: number) {
    return this.QualityFormula.Integrate(this.QualityCount, this.QualityCount + amount);
  }

  AddProgress() {
    let soap = Player.Soap.get(this.SoapType);
    if (!soap) {
      return
    }

    soap.AddProgress(this.Speed);
  }

  UpgradeQuality(amount: number) {
    let cost = this.GetQualityCost(amount);
    if (Player.Money.lte(cost)) {
      return;
    }

    Player.Money = Player.Money.sub(cost);
    this.QualityCount = this.QualityCount + amount;
    this.Quality.add(amount);
  }

  UpgradeSpeed(amount: number) {
    let cost = this.GetSpeedCost(amount);
    if (Player.Money.lte(cost)) {
      return;
    }

    Player.Money = Player.Money.sub(cost);
    this.SpeedCount = this.SpeedCount + amount;
    this.Speed.add(amount);
  }
}

export interface SoapProducerProps {
  SoapType: SoapType;
  Speed: Decimal;
  Quality: Decimal;
  Unlocked: boolean;
}
