import { describe, expect, test, vi, type Mock } from "vitest";
import { debounce, throttle } from "../performance.utils";

describe("throttle function", () => {
	let mockFunction: Mock;
	let throttledFn: (...args: unknown[]) => unknown;
	const delay = 100;

	beforeEach(() => {
		mockFunction = vi.fn();
		vi.useFakeTimers();
		throttledFn = throttle(mockFunction, delay);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllTimers();
	});

	test("mockFunction should be called immediately", () => {
		const args = [100, 50];
		throttledFn(...args);

		expect(mockFunction).toHaveBeenCalledTimes(1);
		expect(mockFunction).toHaveBeenCalledWith(...args);
	});

	test("mockFunction shouldn't be called during the delay", async () => {
		const args1 = ["first call"];
		const args2 = ["second call"];

		throttledFn(...args1);
		expect(mockFunction).toHaveBeenCalledTimes(1);
		expect(mockFunction).toHaveBeenCalledWith(...args1);

		vi.advanceTimersByTime(delay - 1);

		throttledFn(...args2);
		expect(mockFunction).toHaveBeenCalledTimes(1);
		expect(mockFunction).toHaveBeenCalledWith(...args1);
		expect(mockFunction).not.toHaveBeenCalledWith(...args2);
	});

	test("mockFunction should be called after the delay if the throttledFn is called again", async () => {
		const args1 = ["first call"];
		const args2 = ["second call"];

		throttledFn(...args1);
		expect(mockFunction).toHaveBeenCalledTimes(1);
		expect(mockFunction).toHaveBeenCalledWith(...args1);

		vi.advanceTimersByTime(delay);

		throttledFn(...args2);
		expect(mockFunction).toHaveBeenCalledTimes(2);
		expect(mockFunction).toHaveBeenCalledWith(...args2);
	});
});

describe("debounce function", () => {
	let mockFunction: Mock;
	let debouncedFn: (...args: unknown[]) => unknown;
	const delay = 100;

	beforeEach(() => {
		mockFunction = vi.fn();
		vi.useFakeTimers();
		debouncedFn = debounce(mockFunction, delay);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllTimers();
	});

	test("mockFunction shouldn't be called immediately", () => {
		const args = [100, 50];

		debouncedFn(...args);

		expect(mockFunction).not.toHaveBeenCalled();
		expect(mockFunction).not.toHaveBeenCalledWith(...args);
	});

	test("mockFunction shouldn't be called during the delay", async () => {
		const args = [100, 50];

		debouncedFn(...args);

		vi.advanceTimersByTime(delay - 1);

		expect(mockFunction).not.toHaveBeenCalled();
		expect(mockFunction).not.toHaveBeenCalledWith(...args);
	});

	test("mockFunction should be called after the delay if the debouncedFn isn't called again", async () => {
		const args = [100, 50];

		debouncedFn(...args);

		vi.advanceTimersByTime(delay + 1);

		expect(mockFunction).toHaveBeenCalledTimes(1);
		expect(mockFunction).toHaveBeenCalledWith(...args);
	});

	test("mockFunction shouldn't be called after the delay if the debouncedFn is called again before the delay", async () => {
		const args = [100, 50];

		debouncedFn(...args);

		vi.advanceTimersByTime(delay - 1);
		debouncedFn(...args);
		vi.advanceTimersByTime(1);

		expect(mockFunction).not.toHaveBeenCalled();
		expect(mockFunction).not.toHaveBeenCalledWith(...args);

		vi.advanceTimersByTime(delay);
		expect(mockFunction).toHaveBeenCalledTimes(1);
		expect(mockFunction).toHaveBeenCalledWith(...args);
	});
});
