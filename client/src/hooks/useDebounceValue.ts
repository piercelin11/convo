import { useState, useEffect } from "react";

/**
 * 一個用於防抖值的 React Custom Hook。
 * 它會接收一個值，並在該值停止變化一段時間後，才回傳最新的值。
 *
 * @param value - 需要防抖的原始值。
 * @param delay - 防抖的延遲時間 (單位：毫秒)。
 * @returns 返回經過防抖處理後的值。
 */
export function useDebounceValue<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
