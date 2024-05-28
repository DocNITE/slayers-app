import React from 'react';
import './App.css';
import GameScreen from './game/GameScreen';

interface AppProps {
  mode: 'menu' | 'game'
}

interface AppState {
  mode: 'menu' | 'game'
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = { mode: props.mode };
  }

  changeMode(state: 'menu' | 'game') {
    this.setState({ mode: state });
  }

  render(): React.ReactNode { 
    if (this.state.mode == 'menu') {
    return <div className="App">
      <header className="App-header">
          Multiplayer Game
          <button onClick={() => {this.changeMode('game')}}>Join</button>
      </header>
    </div>
    } else if (this.state.mode == 'game') {
    return <div className="App">
	      <GameScreen app={this} />
    </div>
    }
  }
}

export default App;
