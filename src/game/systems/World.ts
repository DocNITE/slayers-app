import Game from "../Game";
import Logger from "../../utils/Logger";
import NetSession from "../../utils/NetSession";

const logger = new Logger("World");

/**
 * Initialization of system
 * @param game game context
 */
function onInit(game: Game) {
    logger.info('Initialized');
}

/**
 * Start system
 * @param game game context
 */
function onStart(game: Game) {
    logger.info('Started');
}

/**
 * Render event
 * @param game game context
 */
function onRender(game: Game) {
}

function onSync(game: Game, data: any) {
    if (data) {
        // Create tiles...
        if ('tiles' in data) {
            data.tiles.forEach((tile: any) => {
                let localTile = game.world.findEntityById(tile.id);
                if (localTile == null)
                    game.world.createTile(tile);
            });
        }
        // Create entities...
        if ('entities' in data) {
            data.entities.forEach((entity: any) => {
                let localEnt = game.world.findEntityById(entity.id)
                if (localEnt == null) {
                    let ent = game.world.createEntity(entity);
                    game.world.moveEntity(ent, ent.properties.physics.position.x, ent.properties.physics.position.y)
                }
            });
        }
    }
}

/**
 * Try to get the world from the server after connecting
 * @param game game context
 * @param session player network session
 */
function onConnect(game: Game, session: NetSession) {
    logger.info("Player connected. Trying sync to server...");

    if (session) {
        // Listen net messages for synchonization world on client
        session.socket.on('World_onSync', (data: any) => {
            onSync(game, data);
        });

        // Send world synchonization message
        session.socket.emit('World_sync')
    }
}

// Export function for creating system and place events
export function create(game: Game) {
    game.emitter.on('onInit', onInit);
    game.emitter.on('onRender', onRender);
    game.emitter.on('onConnect', onConnect);
}
