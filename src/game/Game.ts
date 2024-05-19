import { Application, Container, Graphics } from 'pixi.js';
import { Socket, io } from 'socket.io-client';

/* Main game context. Should be created once. */
class Game {
    pixiApp: Application;

    constructor() {
      this.pixiApp = new Application();
    }

    // Initialize game content
    async init() {
      await this.pixiApp.init({
        canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
        resizeTo: window,
        background: '#1099bb'
      });
      // document.body.appendChild(this.pixiApp.canvas);
      this.pixiApp.resize();
      this.pixiApp.start();

      const graphics = new Graphics();

      // Draw a rectangle
      graphics.beginFill('green'); // Set the fill color to white
      graphics.drawRect(100, 100, 200, 200); // Draw a rectangle at position (100, 100) with width 200 and height 200
      graphics.endFill();

      const port = 11000;
      const socket = io('ws://localhost:11000');
      socket.on('connect', () => {
        console.log("Lol from client");
      })
      socket.on("connect_error", (err) => {
        // the reason of the error, for example "xhr poll error"
        console.log(err.message);
      });

      const container = new Container();
      container.addChild(graphics);

      this.pixiApp.stage.addChild(container);
    }

    // Render event
    onRender() {
    
    } 
}

export default Game;
