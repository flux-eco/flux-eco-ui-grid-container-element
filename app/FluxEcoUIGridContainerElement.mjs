/**
 * @type {FluxEcoUiGridContainerElement}
 */
export class FluxEcoUiGridContainerElement extends HTMLElement {
    /**
     * @type {string|null}
     */
    #id = null;
    /**
     * @type {FluxEcoUiGridContainerElementSettings}
     */
    #settings;
    /**
     * @type {FluxEcoUiGridContainerElementState|null}
     */
    #state;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {FluxEcoUiGridContainerElementOutbounds}
     */
    #outbounds;
    /**
     * @type {HTMLElement}
     */
    #contentContainer;

    /**
     * @returns {string[]}
     */
    static get observedAttributes() {
        return ["state"];
    }

    /**
     * @param {FluxEcoUiGridContainerElementConfig} validatedConfig
     */
    constructor(validatedConfig) {
        super();

        if (validatedConfig.hasOwnProperty("id")) {
            this.#id = validatedConfig.id;
        }
        this.#settings = validatedConfig.settings;
        if (validatedConfig.hasOwnProperty("initialState")) {
            this.#state = validatedConfig.initialState;
        }
        this.#outbounds = validatedConfig.outbounds;

        this.#shadow = this.attachShadow({mode: 'closed'});

        const style = document.createElement('style');

        const {numberOfColumns, gridGapInPx, itemBackgroundColor, itemPaddingInPx} = this.#settings;

        style.textContent = `.grid-container {
                                display: grid;
                                grid-template-columns: repeat(${numberOfColumns}, 1fr);
                                grid-gap: ${gridGapInPx}px;
                              }
                              .grid-item {
                                background-color: ${itemBackgroundColor};                            
                                padding: ${itemPaddingInPx}px;
                                height: 500px;           
                              }
                            `;

        this.#shadow.appendChild(style);

    }

    static get tagName() {
        return 'flux-eco-ui-grid-container-element'
    }

    /**
     * @param {FluxEcoUiGridContainerElementConfig} validatedConfig
     * @returns {FluxEcoUiGridContainerElement}
     */
    static new(validatedConfig) {
        return new FluxEcoUiGridContainerElement(validatedConfig);
    }

    connectedCallback() {
        if (this.#id === null) {
            this.#id = [this.parentElement.id, FluxEcoUiGridContainerElement.tagName].join("/");
        }
        this.setAttribute("id", this.#id);
        this.#contentContainer = this.#createContentContainerElement(this.#id)
        this.#shadow.appendChild(this.#contentContainer);
        if (this.#state) {
            this.#applyStateChanged(this.#state)
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "state":
                this.changeState(JSON.parse(newValue));
                break;
            default:
                break;
        }
    }

    changeState(newState) {
        //todo validate
        this.#applyStateChanged(newState);
    }

    #applyStateChanged(validatedState) {
        const {gridContainerElementItems} = validatedState

        this.#contentContainer.innerHTML = "";

        gridContainerElementItems.forEach((item) => {
            const element = this.#outbounds.createElement(item.tagName, item.config);
            element.classList.add("grid-item");
            this.#contentContainer.appendChild(element)
        });

        this.#state = validatedState;
        const stateStringified = JSON.stringify(this.#state)
        if (this.getAttribute("state") !== stateStringified) {
            this.setAttribute("state", stateStringified);
        }
    }

    /**
     * @returns {HTMLElement}
     */
    #createContentContainerElement(id) {
        const contentContainerId = [id, 'content'].join("/");
        const contentContainer = document.createElement("div");
        contentContainer.classList.add('grid-container');
        contentContainer.id = contentContainerId;
        return contentContainer;
    }
}

customElements.define(FluxEcoUiGridContainerElement.tagName, FluxEcoUiGridContainerElement);
