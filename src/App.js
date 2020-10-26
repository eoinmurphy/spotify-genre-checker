import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";
import { instance, SetAuthToken } from "./axiosInstance";

let showTrack = false;
class App extends Component {
  constructor() {
    super();
    this.state = {};
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
    // TODO: Add urlHandler() call here for another file (e.g. urlHandler.js)
    let path = "spotify" + new URL(this.state.value).pathname;
    let uri = path.split("/")[2];
    let showTrack = true;
    // TODO: Try to figure out a cleaner way of handling .setState
    instance.get("/tracks/" + uri).then((response) => {
      this.setState({
        track: {
          artist: response.data.artists[0].name,
          name: response.data.name,
        },
      });
      instance.get("/artists/" + response.data.artists[0].id).then((response) => {
        this.setState({
          genres: response.data.genres,
        })
      })
    });
  };
  render() {
    // const genres = this.state.genres;
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
            {/* // TODO: Update to conditional check for `showTrack` instead of calling `this.state` */}
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
