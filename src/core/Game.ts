import { IGameRenderer } from '../common';
import CanvasRenderer from '../view/CanvasRenderer';
import WebGLRenderer from '../view/WebGLRenderer';

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

      //  this.renderer = 

      //  this.field = new FieldData();

        this.controller = new GameController();



    }


}

export default new Game();