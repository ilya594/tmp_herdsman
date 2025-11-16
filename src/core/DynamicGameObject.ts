import { Sprite, Texture } from "pixi.js";
import { IDynamicGameObject, IGlobalPosition, IFieldPosition, ICell, DynamicGameObjectState, IDynamicGameObjectType } from "../common";
import { GameConfig } from "../config/Config";
import { positionToPixels } from "./Utils";
import GameEvents from "./GameEvents";


export class DynamicGameObject extends Sprite implements IDynamicGameObject {

    public readonly uuid: string = this.constructor.name + '_' + crypto.randomUUID();
    public cell: ICell | null;

    private rawpath: Array<IFieldPosition> = [];
    private path: Array<IGlobalPosition> = [];
    private dislocation: DislocationData; 
    private _state: DynamicGameObjectState;

    private setState = (state: DynamicGameObjectState) => {
        this._state = state;
    }

    public get state(): DynamicGameObjectState {
        return this.state;
    }

    public get size(): number {
        return GameConfig.CELL_SIZE;
    }

    public get delta() {
        return 0;
    }

    public get type() {
        return IDynamicGameObjectType.EMPTY;
    }
    
    constructor(texture: Texture) {
        super(texture);
        this.redraw();
    }

    public redraw = () => {}

    public moveTo = (position: IGlobalPosition): void => {
        const px: number = position.x - this.x;
        const py: number = position.y - this.y;
        const distance: number = Math.sqrt(px * px + py * py);
        const point = { x: (px / distance) * this.delta, y: (py / distance) * this.delta };

        this.dislocation = new DislocationData({
            target: { position, distance },
            moved: { distance: 0, gap: 0 },
            delta: { position: point, distance: this.delta },
            self: { position: this.position, gapsize: this.size, dispatch: this.type },            
        });
        this.setState(DynamicGameObjectState.MOVING);
    }

    public move = (d: IGlobalPosition): number => {        
        return 0;
    }

    public update = () => {
        if (this._state !== DynamicGameObjectState.MOVING) return;

        const { target, moved, delta } = this.dislocation;

        if (target.distance - moved.distance > delta.distance) {
            this.dislocation.update(this.move(delta.position));
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

    public setPath(path: Array<IFieldPosition> = []): void {
        
        this.path = path;//path.map((value: IFieldPosition) => positionToPixels(value, this.size));
        this.moveTo(this.path.shift());
    }

    public getPath = (): Array<IFieldPosition> => {
        return this.path;
    }
}

export class DislocationData {

    public target: any;
    public moved: any;
    public delta: any;
    public self: any;

    public update(value: number) {
        this.moved.distance += value;
        this.moved.gap += value;

        if (this.moved.gap > this.self.gapsize && this.self.dispatch) {
        //    debugger;
            GameEvents.dispatchEvent(GameEvents.GAMEOBJECT_FIELD_POSITION_CHANGED,
                { position: this.self.position, type: this.self.dispatch });
            this.moved.gap = 0;
        }
    }

    constructor(data: any) {
        this.target = data.target;
        this.moved = data.moved;
        this.delta = data.delta;
        this.self = data.self;
    }
}

