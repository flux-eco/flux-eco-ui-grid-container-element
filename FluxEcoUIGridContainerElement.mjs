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
     * @type {FluxEcoUiGridContainerElementAttributes|null}
     */
    #attributes;
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
     * @param {FluxEcoUiGridContainerElementConfig} validatedConfig
     */
    constructor(validatedConfig) {
        super();

        if (validatedConfig.hasOwnProperty("id")) {
            this.#id = validatedConfig.id;
        }
        this.#settings = validatedConfig.settings;
        if (validatedConfig.hasOwnProperty("initialState")) {
            this.#attributes = validatedConfig.initialState;
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
        if (this.#attributes) {
            this.#applyAttributesChanged(this.#attributes)
        }
    }

    changeAttributes(attributes) {
        //todo validate
        this.#applyAttributesChanged(attributes);
    }

    async #applyAttributesChanged(validatedAttributes) {
        const {gridContainerElementItems} = validatedAttributes
        if (this.#contentContainer !== undefined) {
            this.#contentContainer.innerHTML = "";
        }
        if (gridContainerElementItems !== undefined) {
            /**
             * @param {GridContainerElementItem} item
             */
            for (const [key, gridContainerElementItem] of Object.entries(gridContainerElementItems)) {
                const element = await this.#outbounds.createUiElement(gridContainerElementItem.uiElementDefinition, gridContainerElementItem.readAttributesAction);
                console.log(element);

                element.classList.add("grid-item");
                this.#contentContainer.appendChild(element)
            }
        }

        this.#attributes = validatedAttributes;
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
