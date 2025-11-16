import { ObservablePoint, Polygon } from "pixi.js";
import { ICell, IDynamicGameObject, IDynamicGameObjectType, IFieldPosition, IGlobalPosition } from "../common";
import { GameConfig } from "../config/Config";
import GameEvents from "./GameEvents";
import { getRandomWithin, pixelsToPosition, positionToPixels } from "./Utils";
import 𓃠PathFinder from "./PathFinder";

export class FieldData {

    private pathFinder: 𓃠PathFinder;
    private gridData: Array<Uint8Array>;
    private locations: Map<string, ICell> = new Map();

    constructor() {
        this.createGrid();
        this.pathFinder = new 𓃠PathFinder();
        GameEvents.addEventListener(GameEvents.GAMEOBJECT_FIELD_POSITION_CHANGED, this.updateDisposition);
    }

    private updateDisposition = (data: any): void => {
        const lastFieldPosition: IFieldPosition = this.getTypedFieldPositions(data.type)?.shift();
        const newFieldPosition: IFieldPosition = pixelsToPosition(data.position);

        if (!lastFieldPosition) {
            debugger;
        }

        this.gridData[newFieldPosition.y][newFieldPosition.x] = data.type;
        if (lastFieldPosition) {
            this.gridData[lastFieldPosition.y][lastFieldPosition.x] = IDynamicGameObjectType.EMPTY;
        }

        if (data.type === IDynamicGameObjectType.MINION) {
            debugger;
        }

       if (data.type === IDynamicGameObjectType.DUDE) {
        let objects = this.getPositionsNearby(newFieldPosition, IDynamicGameObjectType.MINION, 2);
        if (objects.length) {
        //    debugger;
            GameEvents.dispatchEvent(GameEvents.GAMEOBJECT_AROUND_POSITION_SPOTTED, { objects });
        }
       }



        //console.log('[updateDisposition] moved distance dispath [ ' + newFieldPosition.x + ', ' + newFieldPosition.y + ' ]');

    }

    public findPath = (
        currentPosition: IFieldPosition,
        newPosition: IFieldPosition,
        smoothPath: boolean = true,
        toPixels: boolean = true): Array<IFieldPosition> => 
    {
        let result = this.pathFinder.findPath(this.gridData, currentPosition, newPosition, smoothPath);
        return toPixels ? result?.map((point: IFieldPosition) => positionToPixels(point)) : result;
    }

    public getLocationType = (i: number, j: number): IDynamicGameObjectType => {
        return this.gridData[i][j] as IDynamicGameObjectType;
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

    private createGrid = () => {
        this.gridData = new Array();
        for (let i = 0; i < GameConfig.FIELD_HEIGHT; i++) {
            const chunk = new Uint8Array(GameConfig.FIELD_WIDTH);
            for (let j = 0; j < GameConfig.FIELD_WIDTH; j++) {
                chunk[j] = 0;
                const cell: ICell = {
                    position: { x: j, y: i },
                    globalPosition: positionToPixels({ x: j, y: i }),
                    type: IDynamicGameObjectType.EMPTY,
                    id: JSON.stringify({ x: j, y: i })
                };
                this.locations.set(cell.id, cell);
            }
            this.gridData.push(chunk);
        }
        this.createDude();
        this.createObstacles();
        this.createMinions();
    }

    private createDude = () => {
        this.gridData[0][0] = IDynamicGameObjectType.DUDE;
    }

    public getCellsCountByType = (type: IDynamicGameObjectType): number => {
        return [...this.locations.values()].filter((cell: ICell) => cell.type === type).length;
    }

    public getCellByPosition = (position: IFieldPosition | IGlobalPosition, isGlobalPosition: boolean = false): ICell => {
        return this.locations.get(JSON.stringify(isGlobalPosition ? pixelsToPosition(position) : position));
    }

    public getCellsByType = (type: IDynamicGameObjectType): Array<ICell> => {
        const result = [];
        for (let i = 0; i < this.gridData.length; i++) {
            for (let j = 0; j < this.gridData[i].length; j++) {
                if (this.gridData[i][j] === type) {
                    result.push(this.locations.get(JSON.stringify({ x: j, y: i })));
                }
            }
        }
        return result;
    }

    public getTypedFieldPositions = (type: IDynamicGameObjectType): Array<IFieldPosition> => {
        const result = [];
        for (let i = 0; i < this.gridData.length; i++) {
            for (let j = 0; j < this.gridData[i].length; j++) {
                if (this.gridData[i][j] === type) {
                    result.push({ x: j, y: i });
                }
            }
        }
        return result;
    }

    private getPositionsNearby = (position: IFieldPosition, type: number, radius: number): Array<IFieldPosition> => {
        const result: IFieldPosition[] = [];
        const minX = Math.max(0, position.x - radius);
        const maxX = Math.min(this.gridData[0].length - 1, position.x + radius);
        const minY = Math.max(0, position.y - radius);
        const maxY = Math.min(this.gridData.length - 1, position.y + radius);

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const distance = Math.abs(x - position.x) + Math.abs(y - position.y);

                if (distance <= radius && this.gridData[y][x] === type) {
                    result.push({ x, y });
                }
            }
        }

        return result;
    };

    /*private getPositionsNearby = (position: IFieldPosition, type: number, radius: number): Array<IFieldPosition> => {
        const result: Array<IFieldPosition> = [];
        const maxRadius = Math.min(radius, position.x, position.y, this.gridData[0].length - 1 - position.x, this.gridData.length - 1 - position.y);
        for (let r = 0; r <= maxRadius; r++) {
            for (let dx = -r; dx <= r; dx++) {
                const dyMax = Math.floor(Math.sqrt(r * r - dx * dx));
                for (let dy = -dyMax; dy <= dyMax; dy++) {
                    const x = position.x + dx;
                    const y = position.y + dy;
                    if (this.gridData[y][x] === type) {
                        result.push({ x, y });
                    }
                }
            }
        }
        return result;
    };*/



    public getRandomEmptyCell = (): ICell | null => {
        const list: Array<ICell> = [...this.locations.values()].filter(({ type }) => type === IDynamicGameObjectType.EMPTY);
        return list.length ? list[getRandomWithin(list.length - 1)] : null;
    }

    /*private updateDisposition = ({ object, position, cell, searchObjectType }:
        { object: IDynamicGameObject, position?: IFieldPosition, cell?: ICell, searchObjectType?: IDynamicGameObjectType }): void => {
        FieldData.unbound(object);
        FieldData.bound(object, cell ? cell : this.getCellByPosition(position));

        if (!isNaN(searchObjectType)) {
            const objects: any = getPositionsNearby(this.gridData, position, searchObjectType);
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
    };*/

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
        for (let i = 0; i < this.gridData.length; i++) {
            for (let j = 0; j < this.gridData[i].length; j++) {
                if (this.gridData[i][j] === IDynamicGameObjectType.EMPTY) {
                    if (Math.random() < 0.05) {
                        this.gridData[i][j] = IDynamicGameObjectType.MINION;
                    }
                }
            }
        }
    }

    private createObstacles = (type: IDynamicGameObjectType = IDynamicGameObjectType.OBSTACLE): void => {
        let result = [];
        const area: number = 12;

        for (let i = 0; i < this.gridData.length - area; i = i + area) {
            for (let j = 0; j < this.gridData[i].length - area; j = j + area) {
                if (Math.random() < 0.3) {
                    let polygon = [];
                    // Big polygons: 25-50 points
                    const size = getRandomWithin(25, 50);

                    for (let p = 0; p < size; p++) {
                        const x = getRandomWithin(j, Math.min(j + area, this.gridData[0].length - 1));
                        const y = getRandomWithin(i, Math.min(i + area, this.gridData.length - 1));
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

                if (y >= 0 && y < this.gridData.length &&
                    x >= 0 && x < this.gridData[0].length) {
                    this.gridData[y][x] = type;
                }
            }
        })
    }

}

export default FieldData;