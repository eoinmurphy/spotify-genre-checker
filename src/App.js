import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import queryString from 'query-string';

class App extends Component {
  constructor() {
    super();
    this.state = {
      //serverData = {},
      //filterString = ''
    }
  }
  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if(!accessToken)
      return;
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))
  }
  render() {
    let userName = this.state.user;
    console.log(userName); 
    return (
      <div className="App">
        {this.state.user ?
        <div>
          <h1>{this.state.user.name}</h1>
        </div> : <button onClick={() => {
          window.location = window.location.href.includes('localhost')
          ? 'http://localhost:8888/login'
          : 'https://spotify-genre-checker-backend.herokuapp.com/login' } 
        }
        >Sign in with Spotify</button>
        }
      </div>
    );
  }
}

export default App;
