import { Container, Sprite } from "pixi.js";
import Entity from "./Entity";
import Tile from "./Tile";
import Logger from "../../utils/Logger";
import Game from "../Game";

// TODO: Should be moved into World settings
export const TILE_SIZE = 24;

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

    public moveEntity(entity: Entity, x: number, y: number) {
        // TODO: Should be looks some better
        entity.properties.physics.position.x = x;
        entity.properties.physics.position.y = y;
 
        if (entity.properties.sprite.fliped) {
            entity.scale.x = -1;
            entity.x = TILE_SIZE * (entity.properties.physics.position.x + 1);
            entity.y = TILE_SIZE * (entity.properties.physics.position.y);
        } else {
            entity.scale.x = 1;
            entity.x = TILE_SIZE * entity.properties.physics.position.x;
            entity.y = TILE_SIZE * entity.properties.physics.position.y;
        }
  
        this.game.emitter.emit('onEntityMoved', this.game, this, entity);
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

      // Add entity to the world
      this.entities.addChild(entity);

      this.logger.info('Created entity ' + entity.id);
      this.game.emitter.emit('onEntityCreated', this.game, this, entity);

      return entity;
    }

    /**
     * Destroy local entity
     * @param entity entity
     */
    public destroyEntity(entity: Entity) {
        this.entities.removeChild(entity);
        this.game.emitter.emit('onEntityDestroyed', this.game, this, entity);
    }

    /**
     * Destory local entity by his id
     * @param id entity what should be deleted
     */
    public destroyEntityById(id: number) {
        let entity = this.findEntityById(id);
        if (entity != null)
            this.destroyEntity(entity);
    }

    /**
     * Try to get entity but with his id
     * @param id entity id
     * @returns entity or null
     */
    public findEntityById(id: number): Entity | null {
        let result = null;
        this.entities.children.forEach(child => {
            const entity = child as Entity;
            if (entity.id == id)
                result = entity;
        })
        return result;
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

      // Add tile to the world
      this.tiles.addChild(tile);

      this.logger.info('Created tile ' + tile.id);
      this.game.emitter.emit('onTileCreated', this.game, this, tile);

      return tile;
    }

    /**
     * Destroy local tile
     * @param tile tile
     */
    public destroyTile(tile: Tile) {
        this.tiles.removeChild(tile);
        this.game.emitter.emit('onTileDestroyed', this.game, this, tile);
    }

    /**
     * Destory local tile by his id
     * @param id tile what should be deleted
     */
    public destroyTileById(id: number) {
        let tile = this.findTileById(id);
        if (tile != null)
            this.destroyTile(tile);
    }

    /**
     * Try to get tile but with his id
     * @param id tile id
     * @returns tile or null
     */
    public findTileById(id: number): Tile | null {
        let result = null;
        this.tiles.children.forEach(child => {
            const tile = child as Tile;
            if (tile.id == id)
                result = tile;
        })
        return result;
    }
}

export default World;