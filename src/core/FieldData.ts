import { Polygon } from "pixi.js";
import { ICell, IDynamicGameObject, IDynamicGameObjectType, IFieldPosition, IGlobalPosition } from "../common";
import { RendererConfig } from "../config/Config";
import GameEvents from "./GameEvents";
import { getPositionsNearby, getRandomWithin, pixelsToPosition, positionToPixels } from "./Utils";

export class FieldData {

    private matrix: Array<Uint8Array>;
    private locations: Map<string, ICell> = new Map();

    public get grid() {
        return this.matrix;
    }

    public static bound = (object: IDynamicGameObject, cell: ICell): void => {
        object.cell = cell;
        cell.object = object;
        cell.type = object.type;
    }

    public static unbound = (object: IDynamicGameObject, cell?: ICell): void => {
        cell = cell || object.cell;
        if (object.cell && cell?.object) {
            cell.object = null;
            cell.type = IDynamicGameObjectType.EMPTY;
            object.cell = null;
        }
    }

    constructor() {
        this.createGrid();
        GameEvents.addEventListener(GameEvents.GAMEOBJECT_FIELD_POSITION_CHANGED, this.updateDisposition);
    }

    private createGrid = () => {

        this.matrix = new Array();
        for (let i = 0; i < RendererConfig.FIELD_HEIGHT; i++) {
            const chunk = new Uint8Array(RendererConfig.FIELD_WIDTH);
            for (let j = 0; j < RendererConfig.FIELD_WIDTH; j++) {
                chunk[j] = 0;
                const cell: ICell = {
                    position: { x: j, y: i },
                    globalPosition: positionToPixels({ x: j, y: i }, RendererConfig.TILE_SIZE),
                    type: IDynamicGameObjectType.EMPTY,
                    id: JSON.stringify({ x: j, y: i })
                };
                this.locations.set(cell.id, cell);
            }
            this.matrix.push(chunk);
        }

        this.createObstacles();
        this.createMinions();
    }

    public getCellsCountByType = (type: IDynamicGameObjectType): number => {
        return [...this.locations.values()].filter((cell: ICell) => cell.type === type).length;
    }

    public getCellByPosition = (position: IFieldPosition | IGlobalPosition, isGlobalPosition: boolean = false): ICell => {
        return this.locations.get(JSON.stringify(isGlobalPosition ? pixelsToPosition(position, RendererConfig.TILE_SIZE) : position));
    }

    public getCellsByType = (type: IDynamicGameObjectType): Array<ICell> => {
        const result = [];
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j] === type) {
                    result.push(this.locations.get(JSON.stringify({ x: j, y: i })));
                }
            }
        }
        return result;
    }

    public getTypedFieldPositions = (type: IDynamicGameObjectType): Array<IFieldPosition> => {
        const result = [];
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j] === type) {
                    result.push({ x: j, y: i });
                }
            }
        }
        return result;
    }



    public getRandomEmptyCell = (): ICell | null => {
        const list: Array<ICell> = [...this.locations.values()].filter(({ type }) => type === IDynamicGameObjectType.EMPTY);
        return list.length ? list[getRandomWithin(list.length - 1)] : null;
    }

    private updateDisposition = ({ object, position, cell, searchObjectType }:
        { object: IDynamicGameObject, position?: IFieldPosition, cell?: ICell, searchObjectType?: IDynamicGameObjectType }): void => {

        FieldData.unbound(object);
        FieldData.bound(object, cell ? cell : this.getCellByPosition(position));

        if (!isNaN(searchObjectType)) {
            const objects: any = getPositionsNearby(this.grid, position, searchObjectType);
            let result = [];
            for (let i = position.x - 1; i <= position.x + 1; i++) {
                for (let j = position.y - 1; j <= position.y + 1; j++) {
                    let id = JSON.stringify({ x: i, y: j });
                    if (this.locations.has(id)) {
                        let location = this.locations.get(id);
                        if (location.type === searchObjectType) {
                            result.push(location)
                        }

                    }
                }
            }
            if (result.length) {
                result.forEach((entity: any) => {
                    entity.setPath()
                });
            }
        }
    };

    /*private createObstacles = (): void => {
        let result = [];
        for (let i = 0; i < this.matrix.length - 10; i = i + 10) {
            for (let j = 0; j < this.matrix[i].length - 10; j = j + 10) {
                if (Math.random() < 0.3) {
                    let polygon = [];
                    const size = getRandomWithin(10);
                    for (let p = 0; p < size; p++) {
                        polygon.push({ x: getRandomWithin(j, j + 10), y: getRandomWithin(i, i + 10)});
                    }
                    result.push(polygon);
                }
            }
        }

    }*/

    private createMinions = (): void => {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j] === IDynamicGameObjectType.EMPTY) {
                    if (Math.random() < 0.1) {
                        this.matrix[i][j] = IDynamicGameObjectType.MINION;
                    }
                }
            }
        }
    }

    private createObstacles = (type: IDynamicGameObjectType = IDynamicGameObjectType.OBSTACLE): void => {
        let result = [];
        const area: number = 12;

        for (let i = 0; i < this.matrix.length - area; i = i + area) {
            for (let j = 0; j < this.matrix[i].length - area; j = j + area) {
                if (Math.random() < 0.3) {
                    let polygon = [];
                    // Big polygons: 25-50 points
                    const size = getRandomWithin(25, 50);

                    for (let p = 0; p < size; p++) {
                        const x = getRandomWithin(j, Math.min(j + area, this.matrix[0].length - 1));
                        const y = getRandomWithin(i, Math.min(i + area, this.matrix.length - 1));
                        polygon.push({ x, y });
                    }
                    result.push(polygon);
                }
            }
        }
        result.map((points: any, index: number) => {
            result[index] = new Polygon(points);
        })

        result.forEach((polygon: any) => {
            for (let i = 0; i < polygon.points.length - 2; i = i + 2) {
                const y = polygon.points[i];
                const x = polygon.points[i + 1];

                if (y >= 0 && y < this.matrix.length &&
                    x >= 0 && x < this.matrix[0].length) {
                    this.matrix[y][x] = type;
                }
            }
        })
    }

}

export default FieldData;