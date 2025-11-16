import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { GameConfig } from "../config/Config";
import FieldData from "./FieldData";
import { IDynamicGameObjectType } from "../common";

export class Field extends Sprite {

    private data: FieldData;
    constructor(data: FieldData) {
        super();
        this.interactive = true;
        this.data = data;
        this.redraw();
    }

    public redraw = () => {
        const graphics = new Graphics();
        const size = GameConfig.CELL_SIZE;

        for (let i = 0; i < GameConfig.FIELD_HEIGHT; i++) {
            for (let j = 0; j < GameConfig.FIELD_WIDTH; j++) {
                graphics.filletRect(j * size, i * size, size, size, 0).stroke({ width: 1, color: GameConfig.COLORS.GRID, alpha: 0 });
                if (this.data.getLocationType(i, j) === IDynamicGameObjectType.OBSTACLE) {
                    //graphics.circle(j * size + size/2, i * size + size/2, size / Math.E).fill({ color: GameConfig.OBSTACLES.COLOR });
                    const sprite: Sprite = new Sprite(Assets.get('obstacle_default'));
                    sprite.position.set(j * size, i * size);
                    this.addChild(sprite);
                }
             //   if (this.data.grid[i][j] === 7) {                 
               //     graphics.circle(j * size + size/2, i * size + size/2, size / Math.E).fill({ color: RendererConfig.MINION.COLOR });
               // }
            }
        }
        this.addChild(graphics);
    }
    
}
export default Field;