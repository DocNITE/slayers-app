import { Container, Sprite } from "pixi.js";
import Entity from "./Entity";
import Tile from "./Tile";
import Logger from "../utils/Logger";
import Game from "./Game";

// TODO: Should be moved into World settings
const TILE_SIZE = 16;

class World extends Container {
    private game: Game;

    // All local world tile data
    public tiles: Container;
    // All local entities data like players, walls, objects
    public entities: Container;

    private logger: Logger;

    constructor(game: Game) {
        super();
        this.game = game;

        this.tiles = new Container();
        this.tiles.zIndex = 0;
        this.addChild(this.tiles);

        this.entities = new Container();
        this.entities.zIndex = 1;
        this.addChild(this.entities);

        // TODO: It should be zoomed by mouse or touch screen.
        this.scale = 4;

        this.logger = new Logger('World');
    }


    /**
     * Create local entity
     * @returns entity
     */
    public createEntity(data?: any): Entity {
      let entity = new Entity();
      
      if (data) {
        if ('id' in data)
            entity.id = data.id;
        if ('properties' in data)
            entity.properties = data.properties;
      } 

      // Update entity position
      entity.x = TILE_SIZE * entity.properties.physics.position.x;
      entity.y = TILE_SIZE * entity.properties.physics.position.y;

      // Add entity to the world
      this.entities.addChild(entity);

      this.logger.info('Created entity ' + entity.id);
      this.game.emitter.emit('onEntityCreated', this.game, this, entity);

      return entity;
    }

    /**
     * Create local tile
     * @returns tile
     */
    public createTile(data?: any): Tile {
      let tile = new Tile();
      
      if (data) {
        if ('id' in data)
            tile.id = data.id;
        if ('properties' in data) {
            tile.properties = data.properties;
        }
      } 

      // Update tile position
      tile.x = TILE_SIZE * tile.properties.x;
      tile.y = TILE_SIZE * tile.properties.y;

      // Add tile to the world
      this.tiles.addChild(tile);

      this.logger.info('Created tile ' + tile.id);
      this.game.emitter.emit('onTileCreated', this.game, this, tile);

      return tile;
    }
}

export default World;