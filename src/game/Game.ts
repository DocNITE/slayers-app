import { Application, Assets, Container, Sprite, Spritesheet, Texture } from 'pixi.js';
import { Socket, io } from 'socket.io-client';
import Logger from '../utils/Logger';
import EventEmitter from 'events';
import NetSession from '../utils/NetSession';
import GameScreen from '../components/game/GameScreen';
import World from './components/World';
// Systems
import * as WorldSystem from './systems/World'
import * as PlayerSystem from './systems/Player'
import * as SpriteSystem from './systems/Sprite'

// Constants
export const PORT = 11000
export const ADDRESS = 'localhost'

/* Main game context. Should be created once. */
class Game {
    // PIXI.js application instance. Contains all render logic
    public pixiApp: Application;
    // Main game world data. Using pixi's container for rendering
  public world: World;
  
  public nickname: string;

    // Server address
    public address: string;
    // Server port
    public port: number

    // Local client socket for accept/sending net messages
    public session: NetSession | null;

    // Texture atlas of game sprite data
    public textureAtlas?: Texture;
    // Contains JSON data of texture atlas
    public sheet?: Spritesheet;

    public emitter: EventEmitter;

    private logger: Logger;
    public gameScreen: GameScreen;

    constructor(gameScreen: GameScreen, address: string, port: number) {
      this.pixiApp = new Application();
      this.world = new World(this);

      this.address = address;
      this.port = port;

      this.nickname = 'Player';

      this.session = null;

      this.emitter = new EventEmitter();

      this.logger = new Logger('Game');
      this.gameScreen = gameScreen;

      this.pixiApp.stage.addChild(this.world);
    }

    /**
     * Initialize PIXI.js 
     * TODO: Need make better error handling and another shit
     */
    public async initPixi() {
      // TODO: Should be accept server's config with connection info
      const port = PORT;
      const address = ADDRESS;

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
    public initNetwork(nickname: string) {
      if (this.session != null)
        return;

      // TODO: Should be accept server's config with connection info
      const port = PORT;
      const address = ADDRESS;
      const protocol = 'ws'; // 'http' or 'ws'

      // Try connect to server with connection type
      let socket = io(`${protocol}://${address}:${port}`);

      // Set nickname
      this.nickname = nickname;

      // Create local network session
      this.session = new NetSession(socket);

      // Emit event, if connection is succesful
      this.session.socket.on('connect', () => {
        this.logger.info('Connection is succesful');
        this.emitter.emit('onConnect', this, this.session)
      });

      // Emit event, if connection was disconnect
      this.session.socket.on('disconnect', () => {
        this.logger.info('Disconnect from the server');
      });

      // Or... Emit if socket was fucked up 
      this.session.socket.on('connect_error', (err: { message: any; }) => {
        // TODO: Need make better error handling and reconnect logic
        // ...       

        // The reason of the error, for example "xhr poll error"
        this.logger.error(err.message);
        // Disconnect socket. Fuck it...
        this.session?.socket.disconnect()
      });
    }

    /**
     * Initialize systems and other staff
     */
    public initSystems() {
      WorldSystem.create(this);
      PlayerSystem.create(this);
      SpriteSystem.create(this);
    }

    /**
     * Start game client logic
     */
    public start() {
      // Emit initialization for systems
      this.emitter.emit('onInit', this);

      // Emit... Maybe start? Why not /shrug
      this.emitter.emit('onStart', this);

      // Emit keyboard buttons
      document.addEventListener('keydown', (ev) => {
        this.emitter.emit('onKeyDown', this, ev);
      })

      this.world.onRender = () => {
        this.emitter.emit('onRender', this);
      };

      setInterval(() => {
        this.emitter.emit('onDelaySprite', this);
      }, 500)
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
      this.session?.socket.disconnect();
      this.session = null;
    }
}

export default Game;
