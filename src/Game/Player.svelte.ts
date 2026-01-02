import { Soap, SoapData, SoapType } from "./Soap/Soap.svelte.ts";
import { Update } from "./Game.svelte.ts";
import { SaveSystem, type Saveable } from "./Saves.ts";
import { Decimal } from "./Shared/BreakInfinity/Decimal.svelte";
import { UpgradesData, UpgradesKey } from "./Soap/Upgrades.svelte.ts";
import { log } from "console";

interface IPlayer {
  Name: string;
  Money: Decimal;
  Soaps: Map<SoapType, Soap>;
  Bulk: Bulk;
  SoapUpgrades: Map<UpgradesKey, number>
}

class PlayerClass implements Saveable {
  _player = $state<IPlayer>({
    Name: "Player",
    Money: new Decimal(0),
    Soaps: new Map<SoapType, Soap>(),
    Bulk: Bulk.One,
    SoapUpgrades: new Map(),
  });

  constructor() {
    this._player.Soaps.set(SoapType.Red, new Soap(SoapData[0]))
    Object.values(UpgradesKey).forEach((val) => {
      if (typeof val === 'number')
        return;

      this._player.SoapUpgrades.set(val as unknown as UpgradesKey, 0);
    })

    //      Object.values(SoapType)
    //      .forEach((soap, idx) => {
    //        if (typeof soap === 'number')
    //          return;
    //        const newSoap = new Soap(SoapData[0]);
    //        this._player.Soaps.set(soap as unknown as SoapType, newSoap);
    //      })
  }

  get SoapUpgrades() {
    return this._player.SoapUpgrades;
  }

  get Bulk() {
    return this._player.Bulk;
  }

  set Bulk(value) {
    this._player.Bulk = value;
  }

  get Name() {
    return this._player.Name;
  }

  get Money() {
    return this._player.Money;
  }

  set Money(value) {
    this._player.Money = value;
  }

  get Soap() {
    return this._player.Soaps;
  }

  saveKey: string = "player_data";
  getSaveData(): unknown {
    return {
      Name: this.Name,
      Money: this.Money,
      Soaps: this.Soap,
    };
  }

  loadSaveData(data: IPlayer): void {
    this._player.Name = data.Name;
    this._player.Money = data.Money;
    this._player.Soaps = data.Soaps;
  }

  onLoadComplete(): void { }
}

// Yes, this is some real shitty code right here
export enum Bulk {
  One, Ten, TwoFive, Max, Juanzerozeo
}

export const Player = new PlayerClass();
Update.add(() => {

});

SaveSystem.SaveCallback(Player.saveKey, () => {
  return Player.getSaveData();
});
SaveSystem.LoadCallback(Player.saveKey, (data) => {
  Player.loadSaveData(data as IPlayer);
});
