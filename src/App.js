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
    // TODO: Create getData(apiType) and separate out the logic for getting a track, artist or album
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
        {/* TODO: Convert each of the "sections" below to their own components and call them in */}
        {this.state.user ? (
          <div className="li-container">
            {/* TODO: Figure out why this doubles in height once a track is submitted */}
            <div className="div1">
              <div className="li-header">
                <h1 className="li-heading">Spotify Genre Checker</h1>
                <p>
                  <span className="li-subtitle">
                    But <i>which</i> playlist?
                  </span>
                </p>
              </div>
            </div>
            <div className="div2">
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
                  <label htmlFor="url" className="li-form-label">
                    Enter URL:
                  </label>
                  <br />
                  {/* TODO: Add validation here for URL check and URL type check 
                  (e.g. if .pathname !== track/artist then change CSS state to red) */}
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
            {/* TODO: Refactor such that the parents of div3 and 4 are outside the conditional, but that both of their 
                      bodies are contained within it.
                      
                      Having the parents inside the conditional seems to cause the CSS grid to break.
             */}
            <div className="div3">
              {this.state.genres ? (
                <div>
                  <h1>{this.state.track.name}</h1>
                  <h1>{this.state.track.artist}</h1>
                  <div className="li-artwork-container">
                    <img
                      className="li-artwork"
                      src={this.state.track.artwork}
                    />
                  </div>
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
                  </div>
                </div>
              ) : (
                <span>&#8203;</span>
              )}
            </div>
            <div className="div4">
              <div className="li-sub-container">
                {/* TODO: Move mapped <ul> from above here */}
                <div className="div5">
                  <h2>Genres</h2>
                </div>
                {/* TODO: get/v1/artists/{id}/top-tracks and return to state */}
                <div className="div6">
                  <h2>Top tracks</h2>
                </div>
                {/* TODO: get/v1/artists/{id}/related-artists and return to state */}
                <div className="div7">
                  <h2>Related artists</h2>
                </div>
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
