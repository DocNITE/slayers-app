import React from 'react';
import axios from 'axios';
import './App.css';
import GameScreen from './game/GameScreen';
import Login from './Login';
import Registration from './Registration';
import { ADDRESS, PORT } from '../game/Game';
import { Pool } from 'pg';

interface AppProps {
  mode: 'menu' | 'game';
}

interface AppState {
  mode: 'menu' | 'game';
  menu: string;
  nickname: string;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = { mode: props.mode, menu: 'login', nickname: 'Player' };
  }

  changeMode(state: 'menu' | 'game') {
    this.setState({ mode: state });
  }

  changeMenu(state: string) {
    this.setState({ menu: state });
  }

  changeNickname(state: string) {
    this.setState({nickname: state})
  }

  async onLogin(username: string, password: string) {
    try {

      this.changeNickname(username);
      this.changeMode('game');

      } catch (error) {
        alert('Error occuried');
      }
  }

  onRegister(username: string, password: string, confirmPassword: string) {

  }

  render(): React.ReactNode { 
    if (this.state.mode == 'menu') {
    return <div className="App">
      <header className="App-header">
        <div className="Title">Treasure Hunt</div>
        {this.state.menu === 'login' && (
          <Login app={this}></Login>
        )}
        {this.state.menu === 'reg' && (
          <Registration app={this}></Registration>
        )}
      </header>
    </div> 
    } else if (this.state.mode == 'game') {
    return <div className="App">
      <GameScreen app={this} nickname={this.state.nickname} />

    </div>
    }
  }
}


//<button onClick={() => {this.changeMode('game')}}>Join</button>

export default App;
