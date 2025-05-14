import sum from "./sum";

describe("sum function", () => {
	it.each([
		[5, 2, 7],
		[1, 2, 3],
		[9, 5, 14],
	])(
		"should return the sum of '%s' and '%s', whitch is '%s'",
		(a, b, output) => {
			expect(sum(a, b)).toBe(output);
		}
	);
});
