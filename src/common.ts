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
    MINION_ACTIVE = 8,
};

export enum WarningType {
    LOCATION_UNAVAILABLE = 'location_unavailable',
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

export abstract class GameConfig {
    FIELD_WIDTH: number;
    FIELD_HEIGHT: number;
    CELL_SIZE: number;
    FRAME_INTERVAL: number;
    CANVAS: HTMLCanvasElement;
    COLORS: any;
    OBSTACLES: any;
    ENDPOINT: any;
    DUDE: any;
    MINION: any;
    ALL_TEXTURES: Array<any>;
    updateSize: any;
}