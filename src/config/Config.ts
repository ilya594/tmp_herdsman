import { IFieldPosition } from "../common";

class RendererConfigClass {

    public FIELD_WIDTH: number = 40;
    public FIELD_HEIGHT: number = 40;
    public FRAME_INTERVAL: number = 30;
    public readonly TILE_SIZE: number = 25;
    public CANVAS: HTMLCanvasElement;
    public OBSTACLES_DENSITY: number = 0;

    public readonly COLORS: any = {
        BACKGROUND: 'black',
        GRID: 'green',
        DUDE: 'red',
        MINION: 'string',
        PATH: 'string',
        TARGET: 'yellow',
        TEXT: 'string',
    };

    public readonly OBSTACLES: any = {
        COLOR: 'blue'
    };

    public readonly ENDPOINT: any = {
        SIZE: this.TILE_SIZE,
        COLOR: 'gold',
        DELTA: Math.PI ** Math.E,
    };

    public readonly DUDE: any = {
        SPAWN: { x: 0, y: 0 } as IFieldPosition,
        SIZE: this.TILE_SIZE,
        COLOR: 'green',
        DELTA: Math.PI*4,
    };

    public readonly MINION: any = {
        SIZE: this.TILE_SIZE,
        COLOR: 'yellow',
        COLOR_SECONDARY: 'orange',
        TEXTURES: [
            './animal_001.png',
            './animal_002.png',
            './animal_003.png',
            './animal_004.png',
            './animal_005.png',
            './animal_006.png',
            './animal_007.png',
            './animal_008.png',
        ],
        DENSITY: Math.LOG10E**Math.LOG10E,

    };
}

const RendererConfig = new RendererConfigClass();


export { RendererConfig };
