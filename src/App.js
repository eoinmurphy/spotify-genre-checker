import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";
import { instance, SetAuthToken } from "./utils/axiosInstance";
import urlHandler from "./utils/urlHandler";
import urlType from "./utils/urlType";

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
      let displayName = response.data.display_name;
      this.setState({
        user: {
          name: displayName,
        },
      });
    });
  }
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    let url = this.state.value;
    let apiType = urlType(url);
    // TODO: Create getData(apiType) and separate out the logic for getting a track, artist or album
    /* == Get track == */
    instance.get("/" + apiType + "/" + urlHandler(url)).then((response) => {
      // TODO: Refactor this to be dynamic such that the state is set based on the apiType value
      this.setState({
        track: {
          artist: response.data.artists[0].name,
          name: response.data.name,
          artwork: response.data.album.images[0].url,
        },
      });
      /* == Get primary artist == */
      instance
        .get("/artists/" + response.data.artists[0].id)
        .then((response) => {
          this.setState({
            genres: response.data.genres,
          });
        });
    });
  };
  render() {
    if (this.state.genres === null) return null;
    return (
      <div className="App">
        <div className="container">
          {this.state.user ? (
            // render logged in state
            <div class="auth-parent">
              <div class="header">
                <h1>Spotify Genre Checker</h1>
                <h3>But <i>which</i> playlist?</h3>
              </div>
              <div class="body-left">
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="url" className="form-label">
                    Enter URL:
                  </label>
                  <input type="text" name="url" placeholder="e.g. https://spotify.com/track/..."
                    value={this.state.value} onChange={this.handleChange} />
                </form>
              </div>
              {this.state.genres ? (
                <div class="auth-submitted">
                  <div class="track-details">
                    <h1>{this.state.track.name}</h1>
                  </div>
                  <div class="sub-top-tracks"><h1>{this.state.track.name}</h1></div>
                  <div class="sub-related-artists"><h1>{this.state.track.name}</h1></div>
                  <div class="sub-featured-in"><h1>{this.state.track.name}</h1></div>
                </div>
              ) : (
                  <span>&#8203;</span>
                )}
            </div>
          ) : (
              <div className="unauth-parent">
                <h1 className="unauth-title">Spotify Genre Checker</h1>
                <p>
                  <span className="unauth-subtitle">But <i>which</i> playlist?</span>
                </p>
                <button className="unauth-login-btn" onClick={() => {
                  window.location = window.location.href.includes("localhost")
                    ? "http://localhost:8888/login"
                    : "https://spotify-genre-checker-backend.herokuapp.com/login";
                }}>
                  Sign in with Spotify
                </button>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default App;
