import { describe, expect, test, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Button from "../Button";

describe("Button 元件測試", () => {
	let mockedClick: Mock;

	beforeEach(() => {
		mockedClick = vi.fn();
	});

	test("按鈕元件點擊時會成功觸發點擊事件", async () => {
		render(<Button onClick={mockedClick}>Click</Button>);

		const buttonElemet = screen.getByRole("button", { name: "Click" });

		await userEvent.click(buttonElemet);

		expect(mockedClick).toBeCalledTimes(1);
	});

	test("按鈕元件 disabled 不會觸發點擊事件", async () => {
		render(
			<Button onClick={mockedClick} disabled>
				Click
			</Button>
		);

		const buttonElemet = screen.getByRole("button", { name: "Click" });

		await userEvent.click(buttonElemet);

		expect(mockedClick).not.toBeCalled();
	});
});
