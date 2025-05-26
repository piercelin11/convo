import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Dropdown from "../Dropdown";

describe("Dropdown 元件測試", () => {
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
