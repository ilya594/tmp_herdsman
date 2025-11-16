import { IFieldPosition, IGlobalPosition } from "../common";
import { GameConfig } from "../config/Config";

export const pixelsToPosition = (position: IGlobalPosition, size: number = GameConfig.CELL_SIZE): IFieldPosition => {
    return {
        x: Math.floor(position.x / size) ,
        y: Math.floor(position.y / size),
    };
}

export const positionToPixels = (position: IFieldPosition, size: number = GameConfig.CELL_SIZE): IGlobalPosition => {
    return {
        x: position.x * size + size / 2,
        y: position.y * size + size / 2,
    };
}

export const getRandomWithin = (max: number, min: number = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getUniquePositions = (n: number, m: number, count: number, points: Array<IFieldPosition> = []): Array<IFieldPosition> => {
    if (points.length === count) return points;
    const x = Math.floor(Math.random() * (n - 2)) + 1;
    const y = Math.floor(Math.random() * (m - 2)) + 1;
    const exists = points.some(p => p.x === x && p.y === y);
    return getUniquePositions(n, m, count, exists ? points : [...points, { x, y }]);
};

