import React from "react";
import './GameScreen.css';
import Game from '../../game/Game';
import App from "../App";

interface GameProps {
  app: App;
  nickname: string;
}

interface GameState {
  mode: 'menu' | 'game';
  coinsText: string;
  winnerText: string;
}

class GameScreen extends React.Component<GameProps, GameState> {
    private game: Game;

    constructor(props: GameProps) {
        super(props);
	      this.game = new Game(this, "lol", 11100);
        this.state = { mode: 'game', coinsText: 'Coins: 0' , winnerText: ''};
    }

    changeMode(state: 'menu' | 'game') {
      this.setState({ mode: state });
    }
  
    changeCoinsText(state: string) {
      this.setState({coinsText: state})
    }

    changeWinnerText(state: string) {
      this.setState({winnerText: state})
    }

    async componentDidMount(): Promise<void> {
      // Initialize PIXI.js intance and some staff
      await this.game.initPixi();
      // Initialize game networking
      this.game.initNetwork(this.props.nickname);
      // Initialize client-side systems
      this.game.initSystems();
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
        <label className="Coins">{this.state.coinsText}</label>
        <label className="Winner">{ this.state.winnerText }</label>
      </div>
    }
}

/**
 * 
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
 */

export default GameScreen;
