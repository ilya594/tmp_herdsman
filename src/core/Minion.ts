
import { ICell, IDynamicGameObject, IDynamicGameObjectType, IFieldPosition, IGlobalPosition } from "../common";

import { GameConfig } from "../config/Config";
import { DynamicGameObject } from "./DynamicGameObject";

export class Minion extends DynamicGameObject implements IDynamicGameObject {

    public uuid: string = crypto.randomUUID();

    public gridtag: string;

    public override get type() {
        return IDynamicGameObjectType.MINION;
    }

    public override get delta() {
        return GameConfig.MINION.DELTA;
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

    public override move = (d: IGlobalPosition): number => {
        this.x += d.x;
        this.y += d.y;
        const r = Math.sqrt(d.x * d.x + d.y * d.y);
        return r;
    }

}