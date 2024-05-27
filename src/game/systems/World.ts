import Game from "../Game";
import Logger from "../../utils/Logger";

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

// Export function for creating system and place events
export function create(game: Game) {
    game.emitter.on('onInit', onInit);
    game.emitter.on('onRender', onRender);
}