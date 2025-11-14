import { Graphics, Sprite } from "pixi.js";
import { RendererConfig } from "../config/Config";
import FieldData from "./FieldData";

export class Field extends Sprite {

    private data: FieldData;
    constructor(data: FieldData) {
        super();
        this.data = data;
        this.redraw();
    }

    public redraw = () => {
        const graphics = new Graphics();
        const size = RendererConfig.TILE_SIZE;

        for (let i = 0; i < RendererConfig.FIELD_HEIGHT; i++) {
            for (let j = 0; j < RendererConfig.FIELD_WIDTH; j++) {
                graphics.filletRect(j * size, i * size, size, size, 0).stroke({ width: 1, color: RendererConfig.COLORS.GRID, alpha: 0.1 });
                if (this.data.grid[i][j] === 5) {                 
                    graphics.circle(j * size + size/2, i * size + size/2, size / Math.E).fill({ color: RendererConfig.OBSTACLES.COLOR });
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