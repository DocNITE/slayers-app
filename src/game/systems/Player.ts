import { KeyboardEvent } from "react";
import Logger from "../../utils/Logger";
import Game from "../Game";
import NetSession from "../../utils/NetSession";
import { Point, Text } from "pixi.js";

const logger = new Logger("Player");

/**
 * Initialization of system
 * @param game game context
 */
function onInit(game: Game) {
    logger.info('Initialized');
}

function onRender(game: Game) {
    if (game.session == null)
        return;

    const attachedEntity = game.session.attachedEntity;
    if (attachedEntity == null)
        return;

    const entity = game.world.findEntityById(attachedEntity);
    if (entity == null)
        return;

    const worldTransform = entity.worldTransform;
    const globalPosition = new Point();
    globalPosition.x = worldTransform.tx
    globalPosition.y = worldTransform.ty;
}

function onKeyDown(game: Game, ev: KeyboardEvent) {
    if (game.session == null)
        return;

    game.session.socket.emit('Player_move', ev.key);
}

function onConnect(game: Game, session: NetSession) {
    if (session) {
        // Listen net messages for synchonization world on client
        session.socket.on('Player_attachEntity', (id: number) => {
            session.attachedEntity = id;
            logger.info('Attached on entity ' + session.attachedEntity);
        });
        session.socket.on('Player_move', (entId: number, x: number, y: number) => {
            let entity = game.world.findEntityById(entId);
            if (entity) {
                game.world.moveEntity(entity, x, y);
            }
        });
        session.socket.on('Player_createEntity', (data: any) => {
            if (game.world.findEntityById(data.id) == null) {
                let entity = game.world.createEntity(data);
            }
        })
        session.socket.on('Player_destroyEntity', (data: any) => {
            game.world.destroyEntityById(data.id)
        })

        session.socket.on('Player_setName', (id: number, name: string) => {
            let entity = game.world.findEntityById(id);
            if (entity)
                entity.properties.name = name;
        })
    }
}

// Export function for creating system and place events
export function create(game: Game) {
    game.emitter.on('onInit', onInit);
    game.emitter.on('onRender', onRender);
    game.emitter.on('onKeyDown', onKeyDown);
    game.emitter.on('onConnect', onConnect);
}