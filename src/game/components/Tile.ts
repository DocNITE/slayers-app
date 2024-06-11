import { Container, Sprite } from "pixi.js";

class Tile extends Sprite {
    public id: number;
    public properties: any;

    constructor() {
        super();
        this.id = -1;
        this.properties = {};
    }
}

export default Tile;