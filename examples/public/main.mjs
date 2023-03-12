import "./flux-eco-ui-map-element/types/FluxEcoUiMapElementConfig.mjs";
import {FluxEcoUiMapElement} from "./flux-eco-ui-map-element/FluxEcoUiMapElement.mjs";
import {
    FluxEcoUiGridContainerElementOutboundsAdapter
} from "./flux-eco-ui-grid-container-element/config/FluxEcoUiGridContainerElementOutboundsAdapter.mjs";
import {FluxEcoUiGridContainerElement} from "./flux-eco-ui-grid-container-element/FluxEcoUIGridContainerElement.mjs";

const parentElement = document.createElement("div");
document.body.appendChild(parentElement);

const gridElementSettings = await (await fetch("settings/flux-eco-ui-grid-container-element-settings.json")).json();
const uiMapElementSettings = await (await fetch("settings/flux-eco-ui-map-element-settings.json")).json();
const id = "some/id-path";

const gridContainerElementInitialState =  /** @type {FluxEcoUiGridContainerElementState} */  {
    gridContainerElementItems: [
        {
        tagName: FluxEcoUiMapElement.tagName,
        config: /** @type FluxEcoUiMapElementConfig */ {
            id: "mapElement",
            settings: uiMapElementSettings,
            initialState: {
                mapElementView: {
                    center: {
                        lat: 10.238972,
                        lng: -23.433449
                    },
                    zoom: 13
                },
                mapElementMarkers: []
            }
        }
    },
        {
            tagName: FluxEcoUiMapElement.tagName,
            config: /** @type FluxEcoUiMapElementConfig */ {
                id: "mapElement",
                settings: uiMapElementSettings,
                initialState: {
                    mapElementView: {
                        center: {
                            lat: 60.238972,
                            lng: 50.433449
                        },
                        zoom: 13
                    },
                    mapElementMarkers: []
                }
            }
        },
    ]
}
const gridContainerElementOutbounds = FluxEcoUiGridContainerElementOutboundsAdapter.new();
gridContainerElementOutbounds.registerCreateElementCallable(FluxEcoUiMapElement.tagName, (config) => {
   return FluxEcoUiMapElement.new(config)
})

const mapElement = FluxEcoUiGridContainerElement.new({
    id: id,
    settings: gridElementSettings,
    initialState: gridContainerElementInitialState,
    outbounds: gridContainerElementOutbounds
})
parentElement.appendChild(mapElement);