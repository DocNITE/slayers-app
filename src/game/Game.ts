import { Application, Assets, Container, Sprite, Spritesheet, Texture } from 'pixi.js';
import { Socket, io } from 'socket.io-client';
import Logger from '../utils/Logger';
import Entity from './Entity';
import EventEmitter from 'events';

/* Main game context. Should be created once. */
class Game {
    // PIXI.js application instance. Contains all render logic
    public pixiApp: Application;
    // Main game world data. Using pixi's container for rendering
    public world: Container;

    // Local client socket for accept/sending net messages
    public socket?: Socket;

    // Texture atlas of game sprite data
    public textureAtlas?: Texture;
    // Contains JSON data of texture atlas
    public sheet?: Spritesheet;

    public emitter: EventEmitter;

    private logger: Logger;

    constructor() {
      this.pixiApp = new Application();
      this.world = new Container();

      this.emitter = new EventEmitter();

      this.logger = new Logger('Game');

      this.pixiApp.stage.addChild(this.world);
    }

    public createEntity(): Entity {
      let entity = new Entity();
      
      this.world.addChild(entity);

      return entity;
    }

    /**
     * Initialize PIXI.js 
     * TODO: Need make better error handling and another shit
     */
    public async initPixi() {
      // TODO: Should be accept server's config with connection info
      const port = 11000;
      const address = 'localhost';

      await this.pixiApp.init({
        canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
        resizeTo: window,
        background: '#000000'
      });

      this.pixiApp.resize();
      this.pixiApp.start();

      // Load generated texture data from the server
      this.textureAtlas = await Assets.load(`http://${address}:${port}/spritesheet.png`);
      if (this.textureAtlas) {
        this.textureAtlas.source.scaleMode = 'nearest';
        this.logger.info('Loaded texture atlas');
      } else {
        this.logger.info('Can not load texture atlas');
      }

      // Load generated json file of texture spritesheet
      const sheetJSON = await Assets.load(`http://${address}:${port}/spritesheet.json`);
      if (sheetJSON)
        this.sheet = new Spritesheet(this.textureAtlas, sheetJSON.data);

      if (this.sheet != null)
        this.logger.info('Loaded spritesheet data');
      else 
        this.logger.warn('Can not load spritesheet data');

      // wtf?
      if (this.sheet != null)
        await this.sheet.parse();
    }

    /**
     * Initialize networking
     */
    public initNetwork() {
      if (this.socket != null)
        return;

      // TODO: Should be accept server's config with connection info
      const port = 11000;
      const address = 'localhost';
      const protocol = 'ws'; // 'http' or 'ws'

      // Try connect to server with connection type
      this.socket = io(`${protocol}://${address}:${port}`);

      // Emit event, if connection is succesful
      this.socket.on('connect', () => {
        this.logger.info('Connection is succesful');
        this.emitter.emit('onConnect', this, this.socket)
      });

      // Emit event, if connection was disconnect
      this.socket.on('disconnect', () => {
        this.logger.info('Disconnect from the server');
      });

      // Or... Emit if socket was fucked up 
      this.socket.on('connect_error', (err: { message: any; }) => {
        // TODO: Need make better error handling and reconnect logic
        // ...       

        // The reason of the error, for example "xhr poll error"
        this.logger.error(err.message);
        // Disconnect socket. Fuck it...
        this.socket?.disconnect()
      });
    }

    /**
     * Start game client logic
     */
    public start() {
      // Emit initialization for systems
      this.emitter.emit('onInit', this);

        // Emit... Maybe start? Why not /shrug
      this.emitter.emit('onStart', this);

      this.world.onRender = () => {
        this.emitter.emit('onRender', this);
      };
    }

    /**
     * Should be called outside. Deinitialize pixi application
     */
    public destroyPixi() {
      this.pixiApp.destroy();
    }

    /**
     * Should be called outside. Deinitialize game connection for server understanding 
     */
    public destroyNetwork() {
      this.socket?.disconnect();
    }

    private render() {
    } 
}

export default Game;
