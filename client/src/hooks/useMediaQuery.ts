import { useCallback, useEffect, useState } from "react";
import { throttle } from "@/utils";

type MediaQuery = "min" | "max";

/**
 * 一個 React Hook，用於根據指定的查詢類型和斷點寬度來檢查當前視窗寬度是否滿足媒體查詢條件。
 * 它會在視窗大小調整時動態更新結果 (帶有節流)。
 *
 * @param queryType - 媒體查詢的比較類型。預期為 "min" (最小寬度) 或 "max" (最大寬度，即當 queryType 不為 "min" 時的行為)。
 * @param breackpoint - 用於比較的斷點寬度值 (單位：像素)。
 * @returns 如果當前視窗寬度滿足指定的媒體查詢條件，則返回 true，否則返回 false。
 */
export default function useMediaQuery(
	queryType: MediaQuery,
	breackpoint: number
) {
	const [result, setResult] = useState<boolean>(false);

	const checkWidth = useCallback(() => {
		const currentWidth = window.innerWidth;

		if (queryType === "min") {
			setResult(currentWidth >= breackpoint);
		} else {
			setResult(currentWidth <= breackpoint);
		}
	}, [queryType, breackpoint]);

	useEffect(() => {
		checkWidth();
		const throttleCheck = throttle(checkWidth, 200);
		window.addEventListener("resize", throttleCheck);

		return () => window.removeEventListener("resize", throttleCheck);
	}, [checkWidth]);

	return result;
}
