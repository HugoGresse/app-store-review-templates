import browser from "webextension-polyfill";

export default async function renderContent(
    cssPaths,
    container,
    render = (_appRoot) => {}
) {
    const appContainer = container
    const shadowRoot = appContainer.attachShadow({
        mode: import.meta.env.DEV ? "open" : "closed",
    });
    const appRoot = document.createElement("div");

    if (import.meta.hot) {
        // @ts-expect-error - for HMR, styles need to be rendered inside shadow root
        const { addViteStyleTarget } = await import("@samrum/vite-plugin-web-extension/client");

        addViteStyleTarget(shadowRoot);
    } else {
        cssPaths.forEach((cssPath) => {
            const styleEl = document.createElement("link");
            styleEl.setAttribute("rel", "stylesheet");
            styleEl.setAttribute("href", browser.runtime.getURL(cssPath));
            shadowRoot.appendChild(styleEl);
        });
    }

    shadowRoot.appendChild(appRoot);

    render(appRoot);
}
