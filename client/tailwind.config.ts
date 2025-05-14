import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
	content: ["./index/html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		fontFamily: {
			sans: "var(--font-poppins)",
			serif: "var(--font-geist-mono)",
			numeric: "var(--font-raleway)",
		},
		container: {
			center: true,
		},
		extend: {
			colors: {
				primary: {
					50: "#F2FFE1",
					100: "#E0FFBF",
					200: "#C9FF94",
					300: "#A9F56C",
					400: "#83E845",
					500: "#C3F75F",
					600: "#9FC040",
					700: "#7C972E",
					800: "#5E7022",
					900: "#3B4511",
				},
				neutral: colors.zinc,
				success: colors.green,
				warning: colors.yellow,
				danger: colors.red,
			},
		},
	},
} satisfies Config;
