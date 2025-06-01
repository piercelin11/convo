import { describe, expect, test, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Dropdown from "../Dropdown";
import { DropdownItem } from "../DropdownItem";

describe("Dropdown 元件基礎測試", () => {
	beforeEach(() => {
		render(
			<Dropdown trigger={<button>trigger</button>}>
				<li>option 1</li>
				<li>option 2</li>
			</Dropdown>
		);
	});

	test("元件初渲染時選單是關閉的", () => {
		const dropdownElement = screen.queryByRole("menu");
		expect(dropdownElement).not.toBeInTheDocument();
	});

	test("點擊觸發器後選單會打開", async () => {
		const buttonElement = screen.getByRole("button", { name: "trigger" });
		await userEvent.click(buttonElement);

		const dropdownElement = screen.queryByRole("menu");

		expect(dropdownElement).toBeInTheDocument();
	});

	test("點擊選單外部時選單會關閉", async () => {
		const buttonElement = screen.getByRole("button", { name: "trigger" });
		await userEvent.click(buttonElement);

		const dropdownElement = screen.queryByRole("menu");

		expect(dropdownElement).toBeInTheDocument();

		await userEvent.click(document.body);
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	test("點擊選單本身時選單會關閉", async () => {
		const buttonElement = screen.getByRole("button", { name: "trigger" });
		await userEvent.click(buttonElement);

		const dropdownElement = screen.getByRole("menu");
		expect(dropdownElement).toBeInTheDocument();

		await userEvent.click(dropdownElement);

		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});
});

describe("Dropdown 與 DropdownItem 元件以及 useDropdown 的整合測試", () => {
	let option1Fn: Mock;
	let option2Fn: Mock;

	beforeEach(() => {
		option1Fn = vi.fn();
		option2Fn = vi.fn();
		render(
			<Dropdown trigger={<button>trigger</button>}>
				<DropdownItem onClick={option1Fn}>option 1</DropdownItem>
				<DropdownItem onClick={option2Fn}>option 2</DropdownItem>
			</Dropdown>
		);
	});

	test("點擊觸發器打開選單後，聚焦在下拉選單上，且選項皆有正確的 'tabIndex' 屬性", async () => {
		const triggerElement = screen.getByRole("button", { name: "trigger" });
		await userEvent.click(triggerElement);

		const dropdownElement = screen.queryByRole("menu");
		expect(dropdownElement).toBeInTheDocument();
		expect(dropdownElement).toHaveFocus();

		const option1Element = screen.getByRole("menuitem", { name: "option 1" });
		const option2Element = screen.getByRole("menuitem", { name: "option 2" });
		expect(option1Element).toHaveAttribute("tabIndex", "-1");
		expect(option2Element).toHaveAttribute("tabIndex", "-1");
	});

	test("點擊觸發器打開選單後，按下 'ArrowDown' 與 'Enter' 按鍵會觸發第一個選項", async () => {
		const triggerElement = screen.getByRole("button", { name: "trigger" });
		await userEvent.click(triggerElement);

		const dropdownElement = screen.queryByRole("menu");
		expect(dropdownElement).toBeInTheDocument();

		await userEvent.keyboard("{ArrowDown}");
		const option1Element = screen.getByRole("menuitem", { name: "option 1" });
		expect(option1Element).toHaveAttribute("tabIndex", "0");
		expect(option1Element).toHaveFocus();

		await userEvent.keyboard("{Enter}");
		expect(option1Fn).toBeCalledTimes(1);
		expect(option2Fn).toBeCalledTimes(0);
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	test("點擊觸發器打開選單後，按下 'ArrowUp' 與 'Enter' 按鍵會觸發最後一個選項", async () => {
		const triggerElement = screen.getByRole("button", { name: "trigger" });
		await userEvent.click(triggerElement);

		const dropdownElement = screen.queryByRole("menu");
		expect(dropdownElement).toBeInTheDocument();

		await userEvent.keyboard("{ArrowUp}");
		const option2Element = screen.getByRole("menuitem", { name: "option 2" });
		expect(option2Element).toHaveAttribute("tabIndex", "0");
		expect(option2Element).toHaveFocus();

		await userEvent.keyboard("{Enter}");
		expect(option1Fn).toBeCalledTimes(0);
		expect(option2Fn).toBeCalledTimes(1);
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	test("點擊觸發器打開選單後，按下 'Esc' 會關閉選單並聚焦觸發器", async () => {
		const triggerElement = screen.getByRole("button", { name: "trigger" });
		await userEvent.click(triggerElement);

		const dropdownElement = screen.queryByRole("menu");
		expect(dropdownElement).toBeInTheDocument();

		await userEvent.keyboard("{Esc}");
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "trigger" })).toHaveFocus();
	});
});
