/**
 * @type {FluxEcoUiGridContainerElementOutbounds}
 */
export class FluxEcoUiGridContainerElementOutboundsAdapter {

    #createElementCallables = {};

    constructor() {
    }

    /**
     * @returns {FluxEcoUiGridContainerElementOutboundsAdapter}
     */
    static new() {
        return new FluxEcoUiGridContainerElementOutboundsAdapter();
    }

    registerCreateElementCallable(tagName, callable) {
        this.#createElementCallables[tagName] = callable;
    }


    createElement(tagName, config) {
        console.log(tagName);
        console.log(this.#createElementCallables);
        const element =  this.#createElementCallables[tagName](config);
        console.log(element)
        return element;
    }
}
