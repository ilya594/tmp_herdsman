import { Assets, Sprite } from "pixi.js";
import { IDynamicGameObject, IGlobalPosition, IFieldPosition, ICell, IDynamicGameObjectType, DynamicGameObjectState } from "../common";
import { RendererConfig } from "../config/Config";
import { pixelsToPosition, positionToPixels } from "./Utils";
import GameEvents from "./GameEvents";

class Dude extends Sprite implements IDynamicGameObject {

    private uuid: string = crypto.randomUUID();
    private textures: any;
    private target: { fieldPosition: IFieldPosition, globalPosition: IGlobalPosition, movedDistance: number };
    private speed: number = Math.PI;
    private path: Array<IFieldPosition> = [];
    private location: ICell | null;

    public get cell(): ICell | null {
        return this.location;
    }

    public set cell(cell: ICell | null) {
        this.location = cell;
    }

    public get id(): string {
        return this.constructor.name + this.uuid;
    }

    public get size(): number {
        return RendererConfig.DUDE.SIZE;
    }

    public get type() {
        return IDynamicGameObjectType.DUDE;
    }

    private get delta() {
        return RendererConfig.DUDE.DELTA;
    }

    constructor() {
        super();
        this.redraw();
        //GameEvents.dispatchEvent(GameEvents.GAMEOBJECT_FIELD_POSITION_CHANGED, { object: this, position: { x: 0, y: 0 } });
    }

    public redraw = async () => {
        this.texture = await Assets.load('./dude_default1.png');
            
                this.x += this.size / 2;
       this.y += this.size / 2;
        this.anchor.set(0.5, 0.5);



              //  this.scale.set(0.25, 0.25);
    }

    private _state: DynamicGameObjectState;

    private setState = (state: DynamicGameObjectState) => {
        this._state = state;
    }

    public get state(): DynamicGameObjectState {
        return this.state;
    }

    private targetData: any;
    public moveTo = (position: IGlobalPosition): void => {     
        const px: number = position.x - this.x;
        const py: number = position.y - this.y;
        const distance: number = Math.sqrt(px * px + py * py);
        const point = { x: (px / distance) * this.delta, y: (py / distance) * this.delta };

        this.targetData = {
            target: { position: position, distance },
            moved: { distance: 0 },
            delta: { position: point, distance: this.delta}
        };
        this.setState(DynamicGameObjectState.MOVING);
    }

    private move = (d: IGlobalPosition): number => {
        this.x += d.x;
        this.y += d.y;
        const r =  Math.sqrt(d.x * d.x + d.y * d.y);
        this.rotation += (Math.sign(d.x) * r) / (this.delta * this.delta);
        return r;
    }
    
    public update = () => {
        if (this._state !== DynamicGameObjectState.MOVING) return;

        const { target, moved, delta } = this.targetData;

        if (target.distance - moved.distance > delta.distance) {
            moved.distance += this.move(delta.position);
        } else {
            this.position = target.position;
            this.rotation = 0;
            if (this.path.length) {
                this.moveTo(this.path.shift());
            } else {
                this.setState(DynamicGameObjectState.PENDING);
            }
        }
    }

    public setPath = (path: Array<IFieldPosition> = []): void => {   
        this.path = path.map((value: IFieldPosition) => positionToPixels(value, this.size));
        this.moveTo(this.path.shift());
    }
}

export default Dude;