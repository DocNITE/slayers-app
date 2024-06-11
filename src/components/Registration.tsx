import * as React from 'react';
import './Registration.css';
import App from './App';

interface RegistrationProps {
    app: App;
}

interface RegistrationState {
    username: string;
    password: string;
    confirmPassword: string;
}

class Registration extends React.Component<RegistrationProps, RegistrationState> {
  constructor(props: RegistrationProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
    };
  }

  handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ confirmPassword: event.target.value });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.state.password === this.state.confirmPassword) {
      this.props.app.onRegister(this.state.username, this.state.password, this.state.confirmPassword);
    } else {
      alert('Passwords do not match');
    }
  };

  render() {
    return (
        <form className="Form" onSubmit={this.handleSubmit}>
            <div className="Hint">
                Don't have account? Create it!
            </div>
        <label className="Label">
          Username:
          <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
        </label>
        <label className="Label">
          Password:
          <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </label>
        <label className="Label">
          Confirm Password:
          <input type="password" value={this.state.confirmPassword} onChange={this.handleConfirmPasswordChange} />
            </label>
            <div className="Button-Group">
                <button type="submit">Create Account</button>
                <button onClick={() => {this.props.app.changeMenu('login')}}>Sign In</button>
            </div>
      </form>
    );
  }
}

export default Registration;