class Queue<T> {
	protected Elements = $state<T[]>([]);
	protected Front = $state(0);
	protected Rear = $state(-1);
	protected Size = $state(0);
	protected Capacity: number;

	/**
	 * Make the Queue iterable and Spreadable
	 */
	*[Symbol.iterator]() {
		for (let i = 0; i < this.Size; i++) {
			yield this.Elements[(this.Front + i) % this.Capacity];
		}
	}

	/**
	 * property represents the Object name
	 */
	get [Symbol.toStringTag]() {
		return "Queue"; // Expected output: "[object Queue]"
	}

	/**
	 * Default constructor for Queue
	 */
	constructor(capacity: number = 10) {
		this.Capacity = Math.max(1, capacity);
		this.Elements = new Array<T>(this.Capacity);
	}

	/**
	 * Adds an element to the end of the Queue
	 */
	public Enqueue(element: T): void {
		if (this.IsFull()) {
			this.Resize(this.Capacity * 2);
		}

		this.Rear = (this.Rear + 1) % this.Capacity;
		this.Elements[this.Rear] = element;
		this.Size++;
	}

	/**
	 * Removes and returns the element at the front of the Queue
	 */
	public Dequeue(): T | undefined {
		if (this.IsEmpty()) {
			return undefined;
		}

		const element = this.Elements[this.Front];
		this.Elements[this.Front] = undefined as T; // Clear reference
		this.Front = (this.Front + 1) % this.Capacity;
		this.Size--;

		// Shrink if too empty
		if (this.Size > 0 && this.Size <= Math.floor(this.Capacity / 4)) {
			this.Resize(Math.max(10, Math.floor(this.Capacity / 2)));
		}

		return element;
	}

	/**
	 * Returns the element at the front of the Queue without removing it
	 */
	public Peek(): T | undefined {
		if (this.IsEmpty()) {
			return undefined;
		}
		return this.Elements[this.Front];
	}

	/**
	 * Returns the element at the rear of the Queue without removing it
	 */
	public PeekRear(): T | undefined {
		if (this.IsEmpty()) {
			return undefined;
		}
		return this.Elements[this.Rear];
	}

	/**
	 * Checks if the Queue is empty
	 */
	public IsEmpty(): boolean {
		return this.Size === 0;
	}

	/**
	 * Checks if the Queue is full
	 */
	public IsFull(): boolean {
		return this.Size === this.Capacity;
	}

	/**
	 * Returns the number of elements in the Queue
	 */
	public GetSize(): number {
		return this.Size;
	}

	/**
	 * Returns the capacity of the Queue
	 */
	public GetCapacity(): number {
		return this.Capacity;
	}

	/**
	 * Removes all elements from the Queue
	 */
	public Clear(): void {
		this.Elements = new Array<T>(this.Capacity);
		this.Front = 0;
		this.Rear = -1;
		this.Size = 0;
	}

	/**
	 * Returns the number of elements in the Queue
	 * Alias for GetSize() for compatibility with List interface
	 */
	public Count(): number {
		return this.Size;
	}

	/**
	 * Removes the first occurrence of a specific element from the Queue
	 * @param element The element to remove
	 * @returns true if element was found and removed; false otherwise
	 */
	public Remove(element: T): boolean {
		if (this.IsEmpty()) {
			return false;
		}

		let foundIndex = -1;
		let currentIndex = 0;

		// Find the element and its position
		for (const item of this) {
			if (item === element) {
				foundIndex = currentIndex;
				break;
			}
			currentIndex++;
		}

		if (foundIndex === -1) {
			return false;
		}

		// If it's the front element, use Dequeue
		if (foundIndex === 0) {
			this.Dequeue();
			return true;
		}

		// If it's the rear element, use RemoveRear logic
		if (foundIndex === this.Size - 1) {
			this.Elements[this.Rear] = undefined as T;
			this.Rear = (this.Rear - 1 + this.Capacity) % this.Capacity;
			this.Size--;
			return true;
		}

		// For elements in the middle, we need to shift elements
		this.RemoveAtInternal(foundIndex);
		return true;
	}

	/**
	 * Removes all elements that match the conditions defined by the specified predicate
	 * @param predicate A function to test each element for a condition
	 * @returns A new Queue containing the removed elements
	 */
	public RemoveAll(
		predicate: (value: T, index: number, queue: Queue<T>) => boolean,
	): Queue<T> {
		const removedElements = new Queue<T>();
		const keptElements = new Queue<T>(this.Capacity);
		let index = 0;

		for (const element of this) {
			if (predicate(element, index, this)) {
				removedElements.Enqueue(element);
			} else {
				keptElements.Enqueue(element);
			}
			index++;
		}

		// Replace current elements with kept elements using $state
		this.Elements = keptElements.Elements;
		this.Front = keptElements.Front;
		this.Rear = keptElements.Rear;
		this.Size = keptElements.Size;
		this.Capacity = keptElements.Capacity;

		return removedElements;
	}

	/**
	 * Removes the element at the specified index
	 * @param index The zero-based index of the element to remove
	 * @returns The removed element
	 */
	public RemoveAt(index: number): T | undefined {
		if (index < 0 || index >= this.Size) {
			throw new Error("Index is out of range.");
		}

		if (index === 0) {
			return this.Dequeue();
		}

		if (index === this.Size - 1) {
			const element = this.Elements[this.Rear];
			this.Elements[this.Rear] = undefined as T;
			this.Rear = (this.Rear - 1 + this.Capacity) % this.Capacity;
			this.Size--;
			return element;
		}

		return this.RemoveAtInternal(index);
	}

	/**
	 * Internal method to remove element at specified index (not front or rear)
	 */
	private RemoveAtInternal(index: number): T | undefined {
		const actualIndex = (this.Front + index) % this.Capacity;
		const element = this.Elements[actualIndex];

		// Create a new array to trigger reactivity
		const newElements = [...this.Elements];

		// Shift elements to fill the gap
		if (index < this.Size / 2) {
			// Shift elements from front to the removal point backward
			for (let i = index; i > 0; i--) {
				const current = (this.Front + i) % this.Capacity;
				const previous = (this.Front + i - 1) % this.Capacity;
				newElements[current] = newElements[previous];
			}
			newElements[this.Front] = undefined as T;
			this.Front = (this.Front + 1) % this.Capacity;
		} else {
			// Shift elements from removal point to rear forward
			for (let i = index; i < this.Size - 1; i++) {
				const current = (this.Front + i) % this.Capacity;
				const next = (this.Front + i + 1) % this.Capacity;
				newElements[current] = newElements[next];
			}
			newElements[this.Rear] = undefined as T;
			this.Rear = (this.Rear - 1 + this.Capacity) % this.Capacity;
		}

		this.Elements = newElements;
		this.Size--;
		return element;
	}

	/**
	 * Converts the Queue to an array
	 */
	public ToArray(): T[] {
		const result: T[] = [];
		for (let i = 0; i < this.Size; i++) {
			result.push(this.Elements[(this.Front + i) % this.Capacity]);
		}
		return result;
	}

	/**
	 * Creates a string representation of the Queue
	 */
	public ToString(): string {
		return `Queue [${this.ToArray().join(", ")}]`;
	}

	/**
	 * Creates a reactive copy of the Queue
	 */
	public Clone(): Queue<T> {
		const newQueue = new Queue<T>(this.Capacity);
		for (const element of this) {
			newQueue.Enqueue(element);
		}
		return newQueue;
	}

	/**
	 * Checks if the Queue contains a specific element
	 */
	public Contains(element: T): boolean {
		for (const item of this) {
			if (item === element) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns the first index of the specified element in the Queue
	 */
	public IndexOf(element: T): number {
		let index = 0;
		for (const item of this) {
			if (item === element) {
				return index;
			}
			index++;
		}
		return -1;
	}

	/**
	 * Returns the last index of the specified element in the Queue
	 */
	public LastIndexOf(element: T): number {
		let lastIndex = -1;
		let currentIndex = 0;
		for (const item of this) {
			if (item === element) {
				lastIndex = currentIndex;
			}
			currentIndex++;
		}
		return lastIndex;
	}

	/**
	 * Applies a function to each element in the Queue
	 */
	public ForEach(
		callback: (value: T, index: number, queue: Queue<T>) => void,
	): void {
		let index = 0;
		for (const item of this) {
			callback(item, index, this);
			index++;
		}
	}

	/**
	 * Creates a new Queue with the results of calling a provided function on every element
	 */
	public Map<U>(
		callback: (value: T, index: number, queue: Queue<T>) => U,
	): Queue<U> {
		const newQueue = new Queue<U>(this.Capacity);
		let index = 0;
		for (const item of this) {
			newQueue.Enqueue(callback(item, index, this));
			index++;
		}
		return newQueue;
	}

	/**
	 * Creates a new Queue with all elements that pass the test implemented by the provided function
	 */
	public Filter(
		predicate: (value: T, index: number, queue: Queue<T>) => boolean,
	): Queue<T> {
		const newQueue = new Queue<T>(this.Capacity);
		let index = 0;
		for (const item of this) {
			if (predicate(item, index, this)) {
				newQueue.Enqueue(item);
			}
			index++;
		}
		return newQueue;
	}

	/**
	 * Returns the first element in the Queue that satisfies the provided testing function
	 */
	public Find(
		predicate: (value: T, index: number, queue: Queue<T>) => boolean,
	): T | undefined {
		let index = 0;
		for (const item of this) {
			if (predicate(item, index, this)) {
				return item;
			}
			index++;
		}
		return undefined;
	}

	/**
	 * Returns true if at least one element in the Queue satisfies the provided testing function
	 */
	public Some(
		predicate: (value: T, index: number, queue: Queue<T>) => boolean,
	): boolean {
		let index = 0;
		for (const item of this) {
			if (predicate(item, index, this)) {
				return true;
			}
			index++;
		}
		return false;
	}

	/**
	 * Returns true if all elements in the Queue satisfy the provided testing function
	 */
	public Every(
		predicate: (value: T, index: number, queue: Queue<T>) => boolean,
	): boolean {
		let index = 0;
		for (const item of this) {
			if (!predicate(item, index, this)) {
				return false;
			}
			index++;
		}
		return true;
	}

	/**
	 * Reduces the Queue to a single value by executing a reducer function on each element
	 */
	public Reduce<U>(
		reducer: (
			accumulator: U,
			currentValue: T,
			index: number,
			queue: Queue<T>,
		) => U,
		initialValue: U,
	): U {
		let accumulator = initialValue;
		let index = 0;
		for (const item of this) {
			accumulator = reducer(accumulator, item, index, this);
			index++;
		}
		return accumulator;
	}

	/**
	 * Internal method to resize the Queue
	 */
	protected Resize(newCapacity: number): void {
		const newElements = new Array<T>(newCapacity);

		// Copy elements to new array
		for (let i = 0; i < this.Size; i++) {
			newElements[i] = this.Elements[(this.Front + i) % this.Capacity];
		}

		this.Elements = newElements;
		this.Capacity = newCapacity;
		this.Front = 0;
		this.Rear = this.Size - 1;
	}
}
/**
 * A reactive fixed-size circular queue that overwrites oldest elements when full
 */
class CircularQueue<T> extends Queue<T> {
	constructor(capacity: number) {
		super(capacity);
	}

	/**
	 * Adds an element to the end of the CircularQueue
	 * Overwrites oldest element if full
	 */
	public Enqueue(element: T): void {
		if (this.IsFull()) {
			// Overwrite the front element and move front pointer
			this.Front = (this.Front + 1) % this.Capacity;
			this.Size--; // Compensate for the size increase that will happen
		}

		this.Rear = (this.Rear + 1) % this.Capacity;
		this.Elements[this.Rear] = element;

		if (!this.IsFull()) {
			this.Size++;
		}
	}
}

/**
 * A reactive priority queue where elements are dequeued based on priority
 */
class PriorityQueue<T> {
	private Elements = $state<{ Value: T; Priority: number }[]>([]);
	private Comparator: (a: number, b: number) => number;

	constructor(comparator: (a: number, b: number) => number = (a, b) => a - b) {
		this.Comparator = comparator;
	}

	/**
	 * Adds an element with priority to the queue
	 */
	public Enqueue(value: T, priority: number): void {
		this.Elements = [...this.Elements, { Value: value, Priority: priority }];
		this.HeapifyUp();
	}

	/**
	 * Removes and returns the element with highest priority
	 */
	public Dequeue(): T | undefined {
		if (this.IsEmpty()) {
			return undefined;
		}

		const result = this.Elements[0].Value;
		const last = this.Elements[this.Elements.length - 1];

		if (this.Elements.length === 1) {
			this.Elements = [];
		} else {
			this.Elements = [last, ...this.Elements.slice(1, -1)];
			this.HeapifyDown();
		}

		return result;
	}

	/**
	 * Returns the element with highest priority without removing it
	 */
	public Peek(): T | undefined {
		return this.IsEmpty() ? undefined : this.Elements[0].Value;
	}

	/**
	 * Returns the priority of the highest priority element
	 */
	public PeekPriority(): number | undefined {
		return this.IsEmpty() ? undefined : this.Elements[0].Priority;
	}

	/**
	 * Checks if the queue is empty
	 */
	public IsEmpty(): boolean {
		return this.Elements.length === 0;
	}

	/**
	 * Returns the number of elements in the queue
	 */
	public GetSize(): number {
		return this.Elements.length;
	}

	/**
	 * Returns the number of elements in the queue
	 * Alias for GetSize() for compatibility with List interface
	 */
	public Count(): number {
		return this.Elements.length;
	}

	/**
	 * Removes the first occurrence of a specific element from the PriorityQueue
	 * Note: This is less efficient for PriorityQueue as it requires searching
	 */
	public Remove(element: T): boolean {
		const index = this.Elements.findIndex((item) => item.Value === element);
		if (index === -1) {
			return false;
		}

		// Create new array without the element
		const newElements = [...this.Elements];
		newElements[index] = newElements[newElements.length - 1];
		newElements.pop();

		this.Elements = newElements;

		// Re-heapify if we removed an element that wasn't the last
		if (index < this.Elements.length) {
			this.HeapifyDownFrom(index);
			this.HeapifyUpFrom(index);
		}

		return true;
	}

	/**
	 * Removes all elements that match the conditions defined by the specified predicate
	 */
	public RemoveAll(
		predicate: (value: T, index: number, queue: PriorityQueue<T>) => boolean,
	): PriorityQueue<T> {
		const removedQueue = new PriorityQueue<T>();
		const keptElements: { Value: T; Priority: number }[] = [];
		let index = 0;

		for (const item of this.Elements) {
			if (predicate(item.Value, index, this)) {
				removedQueue.Enqueue(item.Value, item.Priority);
			} else {
				keptElements.push(item);
			}
			index++;
		}

		this.Elements = keptElements;
		// Rebuild the heap
		for (let i = Math.floor(this.Elements.length / 2); i >= 0; i--) {
			this.HeapifyDownFrom(i);
		}

		return removedQueue;
	}

	/**
	 * Clears the queue
	 */
	public Clear(): void {
		this.Elements = [];
	}

	/**
	 * Converts the queue to an array
	 */
	public ToArray(): T[] {
		return this.Elements.map((item) => item.Value);
	}

	/**
	 * Internal method to maintain heap property after insertion
	 */
	private HeapifyUp(): void {
		let index = this.Elements.length - 1;
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);
			if (this.Compare(index, parentIndex) >= 0) break;

			this.Swap(index, parentIndex);
			index = parentIndex;
		}
	}

	/**
	 * Internal method to maintain heap property from a specific index
	 */
	private HeapifyUpFrom(index: number): void {
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);
			if (this.Compare(index, parentIndex) >= 0) break;

			this.Swap(index, parentIndex);
			index = parentIndex;
		}
	}

	/**
	 * Internal method to maintain heap property after removal
	 */
	private HeapifyDown(): void {
		let index = 0;
		const length = this.Elements.length;

		while (true) {
			const leftChild = 2 * index + 1;
			const rightChild = 2 * index + 2;
			let swapCandidate = index;

			if (leftChild < length && this.Compare(leftChild, swapCandidate) < 0) {
				swapCandidate = leftChild;
			}

			if (rightChild < length && this.Compare(rightChild, swapCandidate) < 0) {
				swapCandidate = rightChild;
			}

			if (swapCandidate === index) break;

			this.Swap(index, swapCandidate);
			index = swapCandidate;
		}
	}

	/**
	 * Internal method to maintain heap property from a specific index
	 */
	private HeapifyDownFrom(index: number): void {
		const length = this.Elements.length;

		while (true) {
			const leftChild = 2 * index + 1;
			const rightChild = 2 * index + 2;
			let swapCandidate = index;

			if (leftChild < length && this.Compare(leftChild, swapCandidate) < 0) {
				swapCandidate = leftChild;
			}

			if (rightChild < length && this.Compare(rightChild, swapCandidate) < 0) {
				swapCandidate = rightChild;
			}

			if (swapCandidate === index) break;

			this.Swap(index, swapCandidate);
			index = swapCandidate;
		}
	}

	/**
	 * Internal method to compare two elements by index
	 */
	private Compare(i: number, j: number): number {
		return this.Comparator(
			this.Elements[i].Priority,
			this.Elements[j].Priority,
		);
	}

	/**
	 * Internal method to swap two elements (with reactivity)
	 */
	private Swap(i: number, j: number): void {
		const newElements = [...this.Elements];
		[newElements[i], newElements[j]] = [newElements[j], newElements[i]];
		this.Elements = newElements;
	}
}

/**
 * A reactive double-ended queue (deque) that allows adding/removing from both ends
 */
class Deque<T> extends Queue<T> {
	constructor(capacity: number = 10) {
		super(capacity);
	}

	/**
	 * Adds an element to the front of the Deque
	 */
	public AddFront(element: T): void {
		if (this.IsFull()) {
			this.Resize(this.Capacity * 2);
		}

		this.Front = (this.Front - 1 + this.Capacity) % this.Capacity;
		this.Elements[this.Front] = element;
		this.Size++;
	}

	/**
	 * Removes and returns the element from the rear of the Deque
	 */
	public RemoveRear(): T | undefined {
		if (this.IsEmpty()) {
			return undefined;
		}

		const element = this.Elements[this.Rear];
		this.Elements[this.Rear] = undefined as T;
		this.Rear = (this.Rear - 1 + this.Capacity) % this.Capacity;
		this.Size--;

		// Shrink if too empty
		if (this.Size > 0 && this.Size <= Math.floor(this.Capacity / 4)) {
			this.Resize(Math.max(10, Math.floor(this.Capacity / 2)));
		}

		return element;
	}
}

export { Queue, CircularQueue, PriorityQueue, Deque };
export default Queue;
