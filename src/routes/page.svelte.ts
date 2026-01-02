import { PageHandler } from "./Pages/Pages";

export enum Pages {
  Soap,
  Settings,
  HowTfDoIPlay,
}

export const MainPageHandler = new PageHandler<Pages>(true);
