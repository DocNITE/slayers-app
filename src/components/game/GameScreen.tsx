import React from "react";
import './GameScreen.css';
import Game from '../../game/Game';
import App from "../App";

interface GameProps {
  app: App
}

interface GameState {
  mode: 'menu' | 'game'
}

class GameScreen extends React.Component<GameProps, GameState> {
    private game: Game;

    constructor(props: GameProps) {
        super(props);
	      this.game = new Game();
        this.state = { mode: 'game' };
    }

    changeMode(state: 'menu' | 'game') {
      this.setState({ mode: state });
    }

    componentDidMount(): void {
      // Initialize PIXI.js intance and some staff
      this.game.initPixi();
      // Initialize game networking
      this.game.initNetwork();
      // Start game
      this.game.start();
    }

    componentClossed() {
      // DeInitialize PIXI.js instance and WebGL ctx
      this.game.destroyPixi();
      // DeInitialize game networking
      this.game.destroyNetwork();
    }

    render(): React.ReactNode {
      return <div>
	      <canvas className="Canvas" id="game-canvas" >
        </canvas>
        <div className="ToMenu">
        <button className="ToMen" onClick={() => {
          // Deinitialize game context
          this.componentClossed();
          // Switch to menu widget
          this.props.app.changeMode('menu');
        }}>ToMenu</button>
        <button className="ToMenu2" onClick={() => {
          // Switch to menu widget
          if (this.state.mode == 'menu')
            this.changeMode('game');
          else 
            this.changeMode('menu');
        }}>Mode</button>
        {this.state.mode === 'game' && (
          <h1 className="ToMenu" style={{color: 'red'}}>Bro</h1>
        )}
        </div>
      </div>
    }
}

export default GameScreen;
