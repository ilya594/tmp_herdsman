import { IFieldPosition, GameConfig } from "../common";

class GameConfigClass extends GameConfig {

    public FIELD_WIDTH: number = 100;
    public FIELD_HEIGHT: number = 100;
    public FRAME_INTERVAL: number = 30;
    public readonly CELL_SIZE: number = 25;
    public CANVAS: HTMLCanvasElement;

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
        SIZE: this.CELL_SIZE,
        COLOR: 'gold',
        DELTA: Math.PI ** Math.E,
    };

    public readonly DUDE: any = {
        SPAWN: { x: 0, y: 0 } as IFieldPosition,
        SIZE: this.CELL_SIZE,
        COLOR: 'green',
        DELTA: Math.PI,
        TEXTURES: [
            { alias: 'dude_default', src: './dude_default.png' },       
        ],
        TEXTURE_DEFAULT: 'dude_default',
    };

    public readonly MINION: any = {
        DELTA: Math.E,
        SIZE: this.CELL_SIZE,
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

    public readonly ALL_TEXTURES: Array<any> = this.DUDE.TEXTURES.concat(this.MINION.TEXTURES);


    public readonly updateSize = (w: number, h: number) => {
        this.FIELD_WIDTH = w;
        this.FIELD_HEIGHT = h;
    }
}

let gameConfig: GameConfig = new GameConfigClass();

export const replaceConfig = (config: GameConfig)  => {
    if (config instanceof GameConfig) {
        gameConfig = config;
    }
}


export { gameConfig as GameConfig };
