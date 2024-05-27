import { Container } from 'pixi.js';

class Entity extends Container {
    public id: number;
    public properties: any;

    // It shouldn't do something instead of 
    // initialize object. Because we should set id
    // of entity from another manager.
    constructor() {
        super();
        this.id = -1;
        this.properties = {};
    }
}

export default Entity;