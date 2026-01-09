import { SvelteMap } from "svelte/reactivity";
import { InvokeableEvent } from "../Shared/Events";

export const UnlockAchievement: InvokeableEvent<AchievementKey> = new InvokeableEvent<AchievementKey>();
export function InvokeAchievement(key: AchievementKey) { UnlockAchievement.invoke(key); }

export const AchievementsData: SvelteMap<AchievementKey, IAchievement> = new SvelteMap<AchievementKey, IAchievement>();
export enum AchievementKey {
  Soapy, Gooder, Businessman, Automation, OCD, Millionaire, Deccelerate, HighSpeed, Accelerate, Deccelerate2, EatSoap
}

AchievementsData.set(AchievementKey.Soapy,
  { name: "Soapy", description: "Produce your first soap" })
AchievementsData.set(AchievementKey.Gooder,
  { name: "Gooder", description: "Upgrade the soap producer once" })
AchievementsData.set(AchievementKey.Businessman,
  { name: "Businessman", description: "Sell your first soap" })
AchievementsData.set(AchievementKey.Automation,
  { name: "Red soap automation", description: "The factory must grow!!" })
AchievementsData.set(AchievementKey.OCD,
  { name: "5 squares", description: "Get more than 25 quality and speed upgrades" })
AchievementsData.set(AchievementKey.Millionaire,
  { name: "Millionaire", description: "Get more than 1 million money" })
AchievementsData.set(AchievementKey.Deccelerate,
  { name: "Quality over quantity", description: "Deccelerate once" })
AchievementsData.set(AchievementKey.HighSpeed,
  { name: "HighSpeed", description: "Overcap your speed while deccelerating" })
AchievementsData.set(AchievementKey.Accelerate,
  { name: "Too slow", description: "Accelerate once" })
AchievementsData.set(AchievementKey.Deccelerate2,
  { name: "Deccelerate 2", description: "You've passed deccelerate 2, now be prepare for the wall" })
AchievementsData.set(AchievementKey.EatSoap,
  { name: "Eat Soap", description: "Why... just why??" })

export interface IAchievement {
  name: string,
  description: string,
  unlocked?: boolean
}

// Decelerate.. I hope you enjoy stacking speed upgrades
// 25 T- seat soap desc: The wall is now over
