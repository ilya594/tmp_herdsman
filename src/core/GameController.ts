import { Assets, Container } from "pixi.js";
import { IFieldPosition, IGameRenderer } from "../common";
import { GameConfig } from "../config/Config";
import UIComponents from "../view/UIComponents";
import { Dude } from "./Dude";
import Endpoint from "./Endpoint";
import Field from "./Field";
import GameEvents from "./GameEvents";
import GameField, { FieldData } from "./FieldData";
import { MinionFabric } from "./MinionFabric";
import PathFinder from "./PathFinder";
import { pixelsToPosition } from "./Utils";
import { WarningType } from "../common";
import WebGLRenderer from "../view/WebGLRenderer";
import { Minion } from "./Minion";

export class GameController {

    private renderer: IGameRenderer;
    private fieldData: FieldData;
    private entities: any;

    constructor() {
        this.initialize();
    }

    private initialize = async () => {

        this.renderer = await WebGLRenderer.initialize();

        this.fieldData = new FieldData();

        this.entities = await this.initializeDynamicEntities();

        this.renderer.setGameEntities(this.entities);

        GameEvents.addEventListener(GameEvents.GAMEFIELD_POINTER_DOWN_EVENT, this.onFieldPointerDown);
        GameEvents.addEventListener(GameEvents.GAMEOBJECT_AROUND_POSITION_SPOTTED, this.onObjectsEngaged);
    }

    private initializeDynamicEntities = async () => {
        const minionFabric: MinionFabric = await (new MinionFabric(this.fieldData)).initialize();
        const entities = new Map();
        entities.set('field', new Field(this.fieldData));
        entities.set('dude', new Dude(Assets.get(GameConfig.DUDE.TEXTURE_DEFAULT)));
        entities.set('endpoint', new Endpoint());
        entities.set('minions', minionFabric.getMinions());
        return entities;
    }

    private onFieldPointerDown = (event: any): void => {

        this.entities.get('endpoint').place({ x: event.x, y: event.y });

        const newPosition: IFieldPosition = pixelsToPosition({ x: event.x, y: event.y });
        const currentPosition: IFieldPosition = pixelsToPosition(this.entities.get('dude').position);

        const path: Array<any> = this.fieldData.findPath(currentPosition, newPosition);

        path ? this.entities.get('dude').setPath(path) : UIComponents.showWarning(WarningType.LOCATION_UNAVAILABLE);
    }

    private onObjectsEngaged = (data: any): void => {

        const neighbors = data.objects.map((object: IFieldPosition) =>
            MinionFabric.getMinionByGridtag(this.entities.get('minions'), JSON.stringify(object)));

        const approximate: any = this.entities.get('dude').position;
        const target: IFieldPosition = pixelsToPosition(approximate);
        //debugger;
        

        neighbors.forEach((minion: Minion) => {
            if (!minion) {
                debugger;
            }
            const current: IFieldPosition = pixelsToPosition(minion.position);      
            const path: Array<any> = this.fieldData.findPath(current, target);            
            
         

            //onst rest: Array<any> = this.entities.get('dude').getPath();
            if (path?.length) {
                minion.setPath(path);
            }

        });
        

       // this.entities.get('minions').forEach((minion: Minion) => minion.setPath(this.entities.get('dude').path));
            

    }
}

export default GameController;