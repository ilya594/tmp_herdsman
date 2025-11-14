import { ObservablePoint, PointData } from "pixi.js";

export interface IGameRenderer {
    onEnterRenderCycle: Function;
    setGameEntities: Function;
   // renderFieldGrid?: Function;
};

export interface IGlobalPosition extends PointData {};

export interface IFieldPosition extends PointData {};

export interface IDynamicGameObject {
    id?: string;
    size?: number;
    cell?: ICell;
    type?: IDynamicGameObjectType;
    position: ObservablePoint;
    update: Function;
    redraw: Function;
};

export enum IDynamicGameObjectType {
    EMPTY = 0,
    DUDE = 1,
    OBSTACLE = 5,
    MINION = 7,
};

export enum DynamicGameObjectState {
    PENDING = 101,
    MOVING = 102,
    FRUSTRATING = 110,
}

export interface ICell {
    id: string;
    position: IFieldPosition;
    globalPosition: IGlobalPosition,
    type: IDynamicGameObjectType;
    object?: IDynamicGameObject;
};