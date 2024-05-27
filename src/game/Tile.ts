import { Container } from "pixi.js";

class Tile extends Container {
    public id: number;
    public properties: any;

    constructor() {
        super();
        this.id = -1;
        this.properties = {};
    }
}

export default Tile;