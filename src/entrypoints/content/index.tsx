import React from "react";
import ReactDOM from "react-dom/client";
import { handleLeetCodeContentScript } from "./leetcodeHandler";

export default defineContentScript({
	matches: ["https://leetcode.com/*"],
	cssInjectionMode: "ui",
	async main(ctx) {
    handleLeetCodeContentScript();

		const container = document.createElement("div");
		container.id = "leetcrack-extension";

		container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        width: 300px;
        height: auto;
        background-color: red;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        visibility: visible;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        font-family: Arial, sans-serif;
    `;

		document.body.appendChild(container);

		const shadowRoot = container.attachShadow({ mode: "open" });

		const app = document.createElement("div");
		shadowRoot.appendChild(app);

		const root = ReactDOM.createRoot(app);
		root.render(
			<React.StrictMode>
				<div style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>
					🔥 LEETCRACK IS WORKING! 🔥
				</div>
			</React.StrictMode>
		);

		console.log("React app rendered in shadow DOM");
	},
});
