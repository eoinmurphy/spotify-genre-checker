import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";
import { instance, SetAuthToken } from "./axiosInstance";

let showTrack = false;
class App extends Component {
  constructor() {
    super();
    this.state = {
      //serverData = {},
      //filterString = ''
    };
  }
  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    SetAuthToken(accessToken);
    if (!accessToken) return;
    instance.get("/me").then((response) => {
      this.setState({
        user: {
          name: response.data.display_name,
        },
      });
    });
  }
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    let path = "spotify" + new URL(this.state.value).pathname;
    let uri = path.split("/")[2];
    let showTrack = true;
    console.log("uri: " + uri);
    instance.get("/tracks/" + uri).then((response) => {
      this.setState({
        track: {
          artist: response.data.artists[0].name,
          name: response.data.name,
        },
      });
      console.log('artist: ' + this.state.track.artist)
      console.log('name: ' + this.state.track.name);
      instance.get("/artists/" + response.data.artists[0].id).then((response) => {
        this.setState({
          genres: response.data.genres,
        })
        console.log('genres: ' + this.state.genres);
      })
      console.log(response.data);
    });
  };
  render() {
    // let userName = this.state.user;
    console.log(this.state.user)
    // let trackName = this.state.track;
    const genres = this.state.genres;
    console.log(genres);
    return (
      <div className="App">
        {this.state.user ? (
          <div>
            <h1>Username: {this.state.user.name}</h1>
            <form onSubmit={this.handleSubmit}>
              <label>
                URL:
                <input
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </label>
              <br />
              <input type="submit" value="Submit" />
            </form>
            {this.state.track ? (
              <div>
                <h1>Track: {this.state.track.name}</h1>
                <h1>Artist: {this.state.track.artist}</h1>
                <h1>{this.state.genres}</h1>
              </div>
            ) : (
              <span>&#8203;</span> 
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              window.location = window.location.href.includes("localhost")
                ? "http://localhost:8888/login"
                : "https://spotify-genre-checker-backend.herokuapp.com/login";
            }}
          >
            Sign in with Spotify
          </button>
        )}
      </div>
    );
  }
}

export default App;
