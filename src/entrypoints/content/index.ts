import { handleLeetCodeContentScript } from "./leetcodeHandler";

export default defineContentScript({
	matches: ["https://leetcode.com/*"],
	main: handleLeetCodeContentScript,
});
