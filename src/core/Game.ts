import { IGameRenderer } from '../common';
import CanvasRenderer from '../view/CanvasRenderer';
import WebGLRenderer from '../view/WebGLRenderer';
import Dude from './Dude';
import Events from './GameEvents';
import GameController from './GameController';
import { FieldData } from './FieldData';

export class Game {


    private renderer: IGameRenderer;

    private field: FieldData;

    private controller: GameController;



    constructor() {
        this.initialize();
    }

    public initialize = async () => {        

        this.renderer = await WebGLRenderer.initialize();

        this.field = new FieldData();

        this.controller = new GameController(this.renderer, this.field);



    }


}

export default new Game();