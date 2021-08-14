export class AsyncUtils {
	public static waitAllTasksInEventLoop(): Promise<void> {
		return new Promise<void>(resolve => setTimeout(resolve));
	}

	public static waitTime(ms: number): Promise<void> {
		return new Promise<void>(resolve => setTimeout(resolve, ms));
	}
}
