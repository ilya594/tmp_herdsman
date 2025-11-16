import { Texture, TextureSource } from "pixi.js";
import { IDynamicGameObject } from "../common";
import { DynamicGameObject } from "./DynamicGameObject";

export class Destination extends DynamicGameObject implements IDynamicGameObject {

    constructor(texture: Texture<TextureSource<any>>) {
        super(texture);        
        this.redraw();
    }
}