import { Sprite, Texture } from "pixi.js";
import { IDynamicGameObject, IGlobalPosition, IFieldPosition, ICell, IDynamicGameObjectType, DynamicGameObjectState } from "../common";
import { GameConfig } from "../config/Config";
import { positionToPixels } from "./Utils";
import GameEvents from "./GameEvents";
import { DynamicGameObject } from "./DynamicGameObject";
import { Minion } from "./Minion";

export class Dude extends DynamicGameObject implements IDynamicGameObject {

    public readonly uuid: string = this.constructor.name + '_' + crypto.randomUUID();

    private readonly crew: Array<Minion> = [];

    public get group() {
        return this.crew;
    }

    public override get type() {
        return IDynamicGameObjectType.DUDE;
    }

    public override get delta() {
        return GameConfig.DUDE.DELTA;
    }

    constructor(texture: Texture) {
        super(texture);
        this.redraw();
    }

    public redraw = () => {
        this.x += this.size / 2;
        this.y += this.size / 2;
        this.anchor.set(0.5, 0.5);
    }

    public override move = (d: IGlobalPosition): number => {
        this.x += d.x;
        this.y += d.y;
        const r = Math.sqrt(d.x * d.x + d.y * d.y);
        this.rotation += (Math.sign(d.x) * r) / (this.delta * this.delta);
        return r;
    }
}

