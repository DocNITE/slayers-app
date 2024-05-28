import Game from "../Game";
import Logger from "../../utils/Logger";
import World from "../World";
import Tile from "../Tile";
import { Sprite } from "pixi.js";
import Entity from "../Entity";

const logger = new Logger("Sprite");

/**
 * Initialization of system
 * @param game game context
 */
function onInit(game: Game) {
    logger.info('Initialized');
}

/**
 * Render event
 * @param game game context
 */
function onRender(game: Game) {
}

function onTileCreated(game: Game, world: World, tile: Tile) {
    if (game.sheet == null)
        return;

    // Take texture
    let texture = game.sheet?.textures[tile.properties.texture];

    // Create tile sprite
    let sprite = new Sprite(texture);
    tile.addChild(sprite);
}

function onEntityCreated(game: Game, world: World, entity: Entity) {
    logger.info('Apply sprite on entity ' + entity.id);

    if (game.sheet == null)
        return;
    if (!('sprite' in entity.properties))
        return;
    if (!('source' in entity.properties.sprite))
        return;

    // Take texture
    let texture = game.sheet?.textures[entity.properties.sprite.source];

    // Create entity sprite
    let sprite = new Sprite(texture);
    entity.addChild(sprite);

    logger.info('Sprite has been added on the entity ' + entity.id);
}

// Export function for creating system and place events
export function create(game: Game) {
    game.emitter.on('onInit', onInit);
    game.emitter.on('onRender', onRender);
    game.emitter.on('onEntityCreated', onEntityCreated);
    game.emitter.on('onTileCreated', onTileCreated);
}