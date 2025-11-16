
import { Application, Assets, Container, Graphics, Sprite } from 'pixi.js';
import {  GameConfig, replaceConfig } from '../config/Config';
import { IGlobalPosition, IFieldPosition, IDynamicGameObject, ICell, IDynamicGameObjectType } from '../common';
import PathFinder from '../core/PathFinder';


import Endpoint from '../core/Endpoint';
import GameField from '../core/FieldData';
import UIComponents from './UIComponents';
import Events from '../core/GameEvents';
import { Minion } from '../core/Minion';
import GameEvents from '../core/GameEvents';
import { MinionFabric } from '../core/MinionFabric';
import Game from '../core/Game';

interface IRendererConfig {
    FIELD_WIDTH: number;
    FIELD_HEIGHT: number;
    FRAME_INTERVAL: number;
    CANVAS: HTMLCanvasElement | HTMLElement;
    TILE_SIZE: number;
    COLORS: {
        MINION: string;
        DUDE: string;
        GRID: string;
        BACKGROUND: string;
        PATH: string;
        TARGET: string;
        TEXT: string;
    };
    ENDPOINT: any;
    OBSTACLES: any;
    DUDE: any;
    MINION: any;
}

class WebGLRenderer {

    private canvas: HTMLCanvasElement | HTMLElement;

    private container: Container;

    private application: Application;

    private entities: Map<string, any>;

    public get proxy() {
        return this.application;
    }

    constructor() {}

    public initialize = async () => {

        this.application = new Application();

        await this.application.init({ background: GameConfig.COLORS.BACKGROUND, resizeTo: window });

        this.canvas = document.getElementById("canvas");
        this.canvas.appendChild(this.application.canvas);   
        this.canvas.onpointerdown = (event) => this.handleCanvasClick(event);

        this.container = new Container({ isRenderGroup: true, eventMode: 'static' });        
        this.application.stage.addChild(this.container);

        GameConfig.updateSize(
            Math.floor(this.application.screen.width / GameConfig.CELL_SIZE),
            Math.floor(this.application.screen.height / GameConfig.CELL_SIZE));

        replaceConfig(GameConfig);

        await Assets.load(GameConfig.ALL_TEXTURES);
        
        return this;
    }

    public onEnterRenderCycle = (time: any) => {

        this.entities.get('minions').forEach((minion: Minion) => minion.update());
        this.entities.get('dude').update(time);
        this.entities.get('endpoint').update();
    }

    public setGameEntities = (entities: Map<string, any>): void => {      
        this.entities = entities;       

        this.container.addChild(this.entities.get('field'));
        this.container.addChild(this.entities.get('dude'));
        this.container.addChild(this.entities.get('endpoint'));

        this.entities.get('minions').forEach((minion: any) => this.container.addChild(minion));
        
        this.application.ticker.add(this.onEnterRenderCycle);
    }

    private handleCanvasClick = (event: MouseEvent | PointerEvent): void => {

        const rectangle: DOMRect = this.canvas.getBoundingClientRect();
        const x: number = event.clientX - rectangle.left;
        const y: number = event.clientY - rectangle.top;

        GameEvents.dispatchEvent(GameEvents.GAMEFIELD_POINTER_DOWN_EVENT, { x, y });
    }
}

export default new WebGLRenderer();