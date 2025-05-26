/**
 * 建立一個節流函式 (throttle function)。
 * 當重複調用此節流函式時，它會確保原始函式在指定的時間延遲內最多只會被執行一次。
 *
 * @param fn - 需要進行節流處理的原始函式。
 * @param delay - 節流的時間間隔 (單位：毫秒)。預設值為 500 毫秒。
 * @returns 返回一個新的、經過節流處理的函式。
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay: number = 500
): (...args: Parameters<T>) => void {
	let timer: null | NodeJS.Timeout = null;
	return function (...args: Parameters<T>) {
		if (!timer) {
			fn(...args);
			timer = setTimeout(() => {
				timer = null;
			}, delay);
		}
	};
}

/**
 * 建立一個防抖函式 (debounce function)。
 * 當重複調用此防抖函式時，它會延遲原始函式的執行，直到距離上一次調用已經過了一段指定的時間延遲。
 * 也就是說，如果在延遲時間內再次調用，則會重新開始計時。
 *
 * @param fn - 需要進行防抖處理的原始函式。
 * @param delay - 防抖的延遲時間 (單位：毫秒)。預設值為 500 毫秒。
 * @returns 返回一個新的、經過防抖處理的函式。
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay: number = 500
): (...args: Parameters<T>) => void {
	let timer: undefined | NodeJS.Timeout;

	return function (...args: Parameters<T>) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}
