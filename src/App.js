import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";
import { instance, SetAuthToken } from "./utils/axiosInstance";
import urlHandler from "./utils/urlHandler";

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

    /* == Get track == */
    instance.get("/tracks/" + urlHandler(url)).then((response) => {
      showTrack = true;
      this.setState({
        track: {
          artist: response.data.artists[0].name,
          name: response.data.name,
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
    const genres = this.state.genres;
    {
      if (showTrack) {
        console.log(genres);
      }
    }
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
            {showTrack ? (
              <div>
                <h1>Track: {this.state.track.name}</h1>
                <h1>Artist: {this.state.track.artist}</h1>
                <p>{this.state.genres}</p>
                <div>
                  {/* <ul>
                  {this.state.genres.map((genre, index) => {
                    return (
                      <li>
                        {index}: {genre}
                      </li>
                    );
                  })}
                  </ul> */}
                </div>
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
