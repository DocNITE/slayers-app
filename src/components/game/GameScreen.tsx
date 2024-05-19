import React from "react";
import './GameScreen.css';
import Game from '../../game/Game';
import App from "../App";

interface GameProps {
  app: App
}

class GameScreen extends React.Component<GameProps> {
    private game: Game;

    constructor(props: GameProps) {
        super(props);
	      this.game = new Game();
    }

    componentDidMount(): void {
      this.game.init();
    }

    render(): React.ReactNode {
      return <div>
	      <canvas className="Canvas" id="game-canvas" >
        </canvas>
        <button className="ToMenu" onClick={() => {this.props.app.changeMode('menu')}}>ToMenu</button>
      </div>
    }
}

export default GameScreen;
