import { Graphics, Sprite } from "pixi.js";
import { ICell, IDynamicGameObject, IDynamicGameObjectType, IFieldPosition, IGlobalPosition } from "../common";
import { pixelsToPosition, positionToPixels } from "./Utils";
import { RendererConfig } from "../config/Config";
import Events from "./GameEvents";

export class Minion extends Sprite implements IDynamicGameObject {

    private uuid: string = crypto.randomUUID();
    private target: IFieldPosition | null;
    private speed: number = Math.PI;
    private path: Array<IFieldPosition> = [];
    private config: any;
    private location: ICell;


    public get cell(): ICell | null {
        return this.location;
    }

    public set cell(cell: ICell | null) {
        this.location = cell;
    }

    public get id() {
        return this.constructor.name + this.uuid;
    }

    public get size() {
        return RendererConfig.MINION.SIZE;
    }

    public get type() {
        return IDynamicGameObjectType.MINION;
    }

    constructor(texture: any) {
        super(texture);
        this.redraw();
    }

    public redraw = () => {
        this.x += this.size / 2;
        this.y += this.size / 2;
        this.anchor.set(0.5, 0.5);
        this.scale.set(0.25, 0.25);    
    }

    public update = () => {

    }
}