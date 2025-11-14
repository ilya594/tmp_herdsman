import { Assets, Container } from "pixi.js";
import { IFieldPosition, IGameRenderer } from "../common";
import { RendererConfig } from "../config/Config";
import UIComponents from "../view/UIComponents";
import Dude from "./Dude";
import Endpoint from "./Endpoint";
import Field from "./Field";
import GameEvents from "./GameEvents";
import GameField, { FieldData } from "./FieldData";
import MinionFabric from "./MinionFabric";
import PathFinder from "./PathFinder";
import { pixelsToPosition } from "./Utils";

export class GameController {

    private renderer: IGameRenderer;
    private fieldData: FieldData;
    private entities: any;

    constructor(renderer: IGameRenderer, fieldData: FieldData) {

        this.renderer = renderer;

        this.fieldData = fieldData;

        this.initialize();

    }

    private initialize = async () => {

        const minionFabric: MinionFabric = await (new MinionFabric(this.fieldData)).initialize();

        this.entities = new Map();
        this.entities.set('field', new Field(this.fieldData));
        this.entities.set('dude', new Dude());
        this.entities.set('endpoint', new Endpoint());
        this.entities.set('minions', minionFabric.getMinions());
        
        this.renderer.setGameEntities(this.entities);

        GameEvents.addEventListener(GameEvents.GAMEFIELD_POINTER_DOWN_EVENT, this.onFieldPointerDown);
    }

    private onFieldPointerDown = ({ x, y }: { x: number, y: number }): void => {

        this.entities.get('endpoint').place({ x, y });

        const newPosition: IFieldPosition = pixelsToPosition({ x, y }, RendererConfig.TILE_SIZE);
        const currentPosition: IFieldPosition = pixelsToPosition(this.entities.get('dude').position, RendererConfig.TILE_SIZE);

        const path = (new PathFinder()).findPath(this.fieldData.grid, currentPosition, newPosition, true);

        path ? this.entities.get('dude').setPath(path) : UIComponents.matrixEffect();
    }
}

export default GameController;