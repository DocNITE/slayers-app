import { KeyboardEvent } from "react";
import Logger from "../../utils/Logger";
import Game from "../Game";

const logger = new Logger("Player");

/**
 * Initialization of system
 * @param game game context
 */
function onInit(game: Game) {
    logger.info('Initialized');
}

function onKeyDown(game: Game, ev: KeyboardEvent) {
    logger.info(`Pressed ${ev.key}`);
}

// Export function for creating system and place events
export function create(game: Game) {
    game.emitter.on('onInit', onInit);
    game.emitter.on('onKeyDown', onKeyDown);
}