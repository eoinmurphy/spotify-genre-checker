import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";
import { instance, SetAuthToken } from "./utils/axiosInstance";
import urlHandler from "./utils/urlHandler";
import urlType from "./utils/urlType";

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
    // TODO: Set a variable to call urlReducer function here to determine whether the URL is a track, artist or album
    // TODO: Refactor `instance.get` to `instance.get("/{urlType}/" + urlHandler(url))...
    /* == Get track == */
    instance.get("/" + apiType + "/" + urlHandler(url)).then((response) => {
      showTrack = true;
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
        {this.state.user ? (
          <div className="li-container">
            <div className="li-header">
              <h2 className="li-heading">Spotify Genre Checker</h2>
              <p>
                <span className="li-subtitle">
                  But <i>which</i> playlist?
                </span>
              </p>
            </div>
            <div className="li-body">
              <div className="li-body-left">
                <h2 className="li-how-to">How do I use this?</h2>
                <ul className="li-how-to-steps">
                  <li>Go to Spotify</li>
                  <li>Tap or right click a track</li>
                  <li>Copy the URL</li>
                  <li>Paste below</li>
                  <li>Et voila</li>
                </ul>
                <div className="li-form">
                  <form onSubmit={this.handleSubmit}>
                    <label for="url" className="li-form-label">
                      Enter URL:
                    </label>
                    <br />
                    <input
                      type="text"
                      name="url"
                      className="li-form-input"
                      placeholder="e.g. https://spotify.com/track/..."
                      value={this.state.value}
                      onChange={this.handleChange}
                    />
                    <br />
                    {/* <input type="submit" value="" /> */}
                  </form>
                </div>
                <div className="li-history">
                  <h2 className="li-history-heading">History</h2>
                  <p>
                    Coming soon! <i>(maybe)</i>
                  </p>
                </div>
              </div>
              {/* TODO: Float right correctly */}
              <div className="li-body-right">
                {this.state.genres ? (
                  <div>
                    {console.log("showTrack: " + showTrack)}
                    <h1>Track: {this.state.track.name}</h1>
                    <h1>Artist: {this.state.track.artist}</h1>
                    <div>
                      <h1>Genres:</h1>
                      <ul>
                        {this.state.genres.map((genre, index) => {
                          return (
                            <li key={index}>
                              {index}: {genre}
                            </li>
                          );
                        })}
                      </ul>
                      <h1>Artwork</h1>
                      <img src={this.state.track.artwork} />
                    </div>
                  </div>
                ) : (
                  <span>&#8203;</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lo-container">
            <h1 className="lo-heading">Spotify Genre Checker</h1>
            <p>
              <span className="lo-subtitle">
                But <i>which</i> playlist?
              </span>
            </p>
            <button
              className="lo-btn"
              onClick={() => {
                window.location = window.location.href.includes("localhost")
                  ? "http://localhost:8888/login"
                  : "https://spotify-genre-checker-backend.herokuapp.com/login";
              }}
            >
              Sign in with Spotify
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
