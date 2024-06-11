import Game from "../Game";
import Logger from "../../utils/Logger";
import World, { TILE_SIZE } from "../components/World";
import Tile from "../components/Tile";
import { Sprite } from "pixi.js";
import Entity from "../components/Entity";

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
    if (game.session == null || game.session.attachedEntity == null)
        return;

    let entId = game.session.attachedEntity;
    let playerEnt = game.world.findEntityById(entId)
    if (playerEnt == null)
        return;

    let px = playerEnt.properties.physics.position.x;
    let py = playerEnt.properties.physics.position.y;
    game.world.position.x = ((window.innerWidth / 2) - (TILE_SIZE * px * 4) - (TILE_SIZE/2))
    game.world.position.y = ((window.innerHeight / 2) - (TILE_SIZE * py * 4) - (TILE_SIZE/2))
}

function onDelaySprite(game: Game) {
    if (game.sheet == null)
        return;

    const sheet = game.sheet;

    game.world.entities.children.forEach(child => {
        const entity = child as Entity;
        if ('secondSource' in entity.properties.sprite) {
            if (entity.texture == sheet.textures[entity.properties.sprite.source]) {
                entity.texture = sheet.textures[entity.properties.sprite.secondSource];
            } else {
                entity.texture = sheet.textures[entity.properties.sprite.source]
            }
        }
    })
}

function onTileCreated(game: Game, world: World, tile: Tile) {
    if (game.sheet == null)
        return;

    // Take texture
    let texture = game.sheet?.textures[tile.properties.texture];

    // Create tile sprite
    tile.texture = texture;
    tile.x = TILE_SIZE * tile.properties.x;
    tile.y = TILE_SIZE * tile.properties.y;
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
    entity.texture = texture;
    entity.x = TILE_SIZE * entity.properties.physics.position.x;
    entity.y = TILE_SIZE * entity.properties.physics.position.y;

    logger.info('Sprite has been added on the entity ' + entity.id);
}

// Export function for creating system and place events
export function create(game: Game) {
    game.emitter.on('onInit', onInit);
    game.emitter.on('onRender', onRender);
    game.emitter.on('onEntityCreated', onEntityCreated);
    game.emitter.on('onTileCreated', onTileCreated);
    game.emitter.on('onDelaySprite', onDelaySprite);
}
