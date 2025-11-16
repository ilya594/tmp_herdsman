import { Assets } from "pixi.js";
import { Minion } from "./Minion";
import { GameConfig } from "../config/Config";
import { ICell, IDynamicGameObject, IDynamicGameObjectType, IFieldPosition } from "../common";
import FieldData from "./FieldData";
import GameEvents from "./GameEvents";
import { getRandomWithin, positionToPixels } from "./Utils";


export class MinionFabric {

    public static getMinionByGridtag = (minions: Array<Minion>, tag: string): Minion =>  {
        return minions.find(({gridtag}) => gridtag === tag);
    }

    private textures: Array<any>;
    private fieldData: FieldData;

    constructor(fieldData: FieldData) {
        this.fieldData = fieldData;
    }

    public initialize = async (): Promise<any> => {
        this.textures = Object.values(await Assets.load(GameConfig.MINION.TEXTURES));
        return this;
    }

    public getMinion = (): Minion => {
        return new Minion(this.textures[getRandomWithin(this.textures.length - 1)]);
    }

    public getMinions = (): Array<Minion> => {
        const positions: Array<IFieldPosition> = this.fieldData.getTypedFieldPositions(IDynamicGameObjectType.MINION);
        return positions.map((position: IFieldPosition) => {
                        const minion: Minion = this.getMinion();
                        minion.position = positionToPixels(position);
                        minion.gridtag = JSON.stringify(position);
                        return minion;
        });
    }
}
