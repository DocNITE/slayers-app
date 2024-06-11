import Logger from "../../utils/Logger";
import Game from "../Game";

/**
 * Logger for physics system 
 */ 
const logger: Logger = new Logger('Initial')

/**
 * Initialization of system
 * @param game game context
 */
function onInit(game: Game) {
    logger.info('Initialized');
}

/**
 * Update every fame render
 * @param game game context
 */
function onRender(game: Game) {
}

// Export function for creating system and place events
export function create(game: Game) {
    game.emitter.on('onInit', onInit);
    game.emitter.on('onRender', onRender);
}