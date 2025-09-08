/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from "react";

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
 * 一個用於防抖函式呼叫的 React Custom Hook。
 *
 * @param callback - 需要進行防抖處理的函式。
 * @param delay - 防抖的延遲時間 (單位：毫秒)。
 * @returns 返回一個新的、經過防抖處理且在元件生命週期內穩定的函式。
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
): (...args: Parameters<T>) => void {
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	const debouncedCallback = useCallback(
		(...args: Parameters<T>) => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}

			timerRef.current = setTimeout(() => {
				callbackRef.current(...args);
			}, delay);
		},
		[delay]
	);

	return debouncedCallback;
}
