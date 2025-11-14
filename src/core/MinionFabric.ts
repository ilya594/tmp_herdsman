import { Assets } from "pixi.js";
import { Minion } from "./Minion";
import { RendererConfig } from "../config/Config";
import { ICell, IDynamicGameObject, IDynamicGameObjectType, IFieldPosition } from "../common";
import FieldData from "./FieldData";
import GameEvents from "./GameEvents";
import { getRandomWithin, positionToPixels } from "./Utils";

export class MinionFabric {

    private textures: Array<any>;
    private fieldData: FieldData;

    constructor(fieldData: FieldData) {
        this.fieldData = fieldData;
    }

    public initialize = async (): Promise<any> => {
        this.textures = Object.values(await Assets.load(RendererConfig.MINION.TEXTURES));
        return this;
    }

    public getMinion = (): Minion => {
        return new Minion(this.textures[getRandomWithin(this.textures.length - 1)]);
    }

    public getMinions = (): Array<Minion> => {
        const positions: Array<IFieldPosition> = this.fieldData.getTypedFieldPositions(IDynamicGameObjectType.MINION);
        return positions.map((position: IFieldPosition) => {
                        const minion: Minion = this.getMinion();
                        minion.position = positionToPixels(position, RendererConfig.TILE_SIZE);
                        return minion;
        });
        
        /*const cells: Array<ICell> = this.fieldData.getCellsByType(IDynamicGameObjectType.MINION);
        let result = cells.map((cell: ICell) => {
            const minion: Minion = this.getMinion();
            minion.position = cell.globalPosition;//positionToPixels({ x: cell.position.x, y: cell.position.y }, minion.size);
          GameEvents.dispatchEvent(GameEvents.GAMEOBJECT_FIELD_POSITION_CHANGED, { object: minion, position: cell.position });
            return minion;
        });
       // debugger;
        return result;
        /*const count: number = this.fieldData.getCellsCountByType(IDynamicGameObjectType.EMPTY);
        const result = [];
        for (let i = 0; i < count; i++) {
            if (Math.random() < 0.01) {
                const cell: ICell = this.fieldData.getRandomEmptyCell();
                const minion: Minion = this.getMinion();
                minion.position = positionToPixels(cell.position, minion.size);
                               GameEvents.dispatchEvent(GameEvents.GAMEOBJECT_FIELD_POSITION_CHANGED, { object: minion, position: cell.position });
                result.push(minion);
            } 
        }
        return result;*/
    }
}
export default MinionFabric;