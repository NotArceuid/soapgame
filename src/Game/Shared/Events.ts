export type EventHandler<T> = (event: T) => void;

export interface IEvent<T> {
	add(handler: EventHandler<T>): void;
	remove(handler: EventHandler<T>): void;
}

export class InvokeableEvent<T> implements IEvent<T> {
	private handlers: EventHandler<T>[] = [];

	/**
	 * @param handler Method that will be called when event is invoked.
	 */
	public add(handler: EventHandler<T>) {
		this.handlers.push(handler);
	}

	/**
	 * @param handler An existing method that is called when event is invoked.
	 */
	public remove(handler: EventHandler<T>) {
		for (let i = 0; i < this.handlers.length; i++) {
			if (this.handlers[i] === handler) {
				this.handlers.splice(i, 1);
			}
		}
	}

	/**
	 * Runs all the methods that were added.
	 * @param event An argument that handlers expect (Use null if none are expected).
	 */
	public invoke(event: T) {
		for (let handler of this.handlers) {
			handler(event);
		}
	}
}
