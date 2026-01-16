import { InvokeableEvent } from "../../Game/Shared/Events";

export interface INotification {
  name: string;
  description: string;
}

export const NotificationPopUp = new InvokeableEvent<INotification>();
