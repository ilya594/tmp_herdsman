import { IFieldPosition, IGlobalPosition } from "../common";

export const pixelsToPosition = (position: IGlobalPosition, size: number): IFieldPosition => {
    return {
        x: Math.floor(position.x / size) ,
        y: Math.floor(position.y / size),
    };
}

export const positionToPixels = (position: IFieldPosition, size: number): IGlobalPosition => {
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

export const getPositionsNearby = (field: Array<Uint8Array>, position: IFieldPosition, type: number, radius: number = 2): Array<IFieldPosition> => {
    const result: Array<IFieldPosition> = [];
    const maxRadius = Math.min(radius, position.x, position.y, field[0].length - 1 - position.x, field.length - 1 - position.y);
    for (let r = 0; r <= maxRadius; r++) {
        for (let dx = -r; dx <= r; dx++) {
            const dyMax = Math.floor(Math.sqrt(r * r - dx * dx));
            for (let dy = -dyMax; dy <= dyMax; dy++) {
                const x = position.x + dx;
                const y = position.y + dy;
                if (field[y][x] === type) {
                    result.push({ x, y });
                }
            }
        }
    }
    return result;
};