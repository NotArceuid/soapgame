import { log } from "console";
import { SaveSystem } from "./Saves.ts";
import { Decimal } from "./Shared/BreakInfinity/Decimal.svelte";
import { CalculateOfflineTick, RunOfflineCalculations } from "./Game.svelte.ts";

interface IPlayer {
  Name: string;
  Playtime: number,
  SaveTime: number,
  Tickets: Decimal,
  Money: Decimal;
  Charge: Decimal;
  SC: number;
  BulkAmount: number;
}

class PlayerClass {
  _player = $state<IPlayer>({
    Name: "Save Slot 1",
    Playtime: 0,
    SaveTime: 0,
    Money: new Decimal(0),
    Tickets: new Decimal(0),
    Charge: new Decimal(0),
    SC: 0,
    BulkAmount: 1,
  });

  get BulkAmount() {
    return this._player.BulkAmount;
  }

  set BulkAmount(value) {
    this._player.BulkAmount = value;
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

  get Ticket() {
    return this._player.Tickets;
  }

  set Ticket(value) {
    this._player.Tickets = value;
  }

  get Charge() {
    return this._player.Charge;
  }

  set Charge(value) {
    this._player.Charge = value;
  }

  saveKey: string = "player";
  constructor() {
    SaveSystem.SaveCallback<IPlayerSaves>(this.saveKey, () => {
      return {
        //@ts-ignore
        version: PKG_VERSION,
        playtime: Player._player.Playtime,
        savetime: new Date().getTime(),
        name: this.Name,
        money: this.Money,
        ticket: this.Ticket,
        charge: this.Charge,
      }
    });

    SaveSystem.LoadCallback<IPlayerSaves>(this.saveKey, (data) => {
      this._player.Money = new Decimal(data.money);
      this._player.SaveTime = data.savetime;
      this._player.Name = data.name
      this._player.Tickets = new Decimal(data.ticket);
      this._player.Charge = new Decimal(data.charge);
      this._player.Playtime = data.playtime;

      this.CalculateOfflineProgress();
    });
  }

  CalculateOfflineProgress() {
    let time = 0
    this._player.SaveTime === 0 ? time = 0 : time = this._player.SaveTime;
    let realTime = CalculateOfflineTick(new Date().getTime() - time);
    RunOfflineCalculations(realTime);
  }
}

interface IPlayerSaves {
  version: string,
  playtime: number,
  savetime: number,
  name: string,
  money: Decimal,
  ticket: Decimal,
  charge: Decimal,
}

export const Player = new PlayerClass();
setInterval(() => {
  Player._player.Playtime += 1
}, 1000);
