import * as React from 'react';
import './Login.css';
import App from './App';

interface LoginProps {
    app: App;
}

interface LoginState {
    username: string;
    password: string;
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: 'Player',
      password: '',
    };
  }

  handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.app.onLogin(this.state.username, '');
  };

  render() {
    return (
        <form className="Form" onSubmit={this.handleSubmit}>
            <div className="Hint">
                Try to login into exist game account!
            </div>
        <label>
          Username: 
          <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
        </label>
            <div className="Button-Group">
                <button type="submit">Play</button>
            </div>
      </form>
    );
  }
}

export default Login;