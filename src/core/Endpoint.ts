import { Assets, Graphics, Sprite } from "pixi.js";
import { IDynamicGameObject, IFieldPosition, IGlobalPosition } from "../common";
import { GameConfig } from "../config/Config";

export class Endpoint extends Sprite implements IDynamicGameObject {


    constructor() {

        super();

        this.redraw();
    }

    public redraw = async () => {

        this.texture = await Assets.load('./destination-marker.png');

        this.pivot.set(this.width/2, this.height/2);

    }

    public place = (position: IGlobalPosition): void => {
        this.position = position;
        this.alpha = 0.8;
        this.scale.set(1.8, 1);
    }

    public update = (delta: number = GameConfig.ENDPOINT.DELTA): void => {
        if (Boolean(this.position.x + this.position.y) == false) return;
        if (this.alpha > 0) {
            this.alpha -= 0.5 / delta;
        }
        if (this.scale.y > 0) {
            this.scale.x -= ((this.scale.x) / delta);
            this.scale.y -= ((this.scale.y) / delta);
        }
       // this.rotation -= Math.PI/(10 + this.rotation);
    }
}

export default Endpoint;