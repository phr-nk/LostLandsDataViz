import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { artistIDs } from "./data/artistIDs";
import "./App.css";
import { Button } from "@material-ui/core";
import { green, purple } from "@material-ui/core/colors";
import Link from "@material-ui/core/Link";
import WordCloud from "./components/WordCloud";
import { Bar } from "react-chartjs-2";
import {
  createMuiTheme,
  withStyles,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { weightedGenres } from "./data/weightedGenres";
import { genres } from "./data/genres";

let local = "http://localhost:3000";
let production = "https://lostlandsdataviz.web.app/";
let endpoint = `https://accounts.spotify.com/authorize?client_id=f8931705be284baaa0e88d70102151a3&redirect_uri=${production}&scope=user-top-read&response_type=token&state=123&show_dialog=true`;

let footerImage =
  "https://www.lostlandsfestival.com/wp-content/uploads/2021/03/99-Footer-Foliage-2021.png";
var barData = {
  labels: [],
  datasets: [
    {
      label: "Genre count",
      data: [],
      borderWidth: 1,
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
    },
  ],
};
const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};
const styles = (theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: 110,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[500],
      contrastText: "#fff",
    },
    secondary: {
      main: purple[500],
    },
  },
});

function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,

      finishedLoadingGenres: false,
      token: null,
      name: "",
      image: "",
      artists: null,
      artists_genres: null,
      words: null,
      artistIDs: [],
      xy_data: null,
      artist: null,
      genre: null,
      genres: [],
    };
    // Binding this keyword
    this.login = this.login.bind(this);
  }
  calcGenreStrength(genres) {
    var strengthDic = {};
    var returnedList = [];
    genres.forEach((el) => {
      if (el in strengthDic) {
        strengthDic[el] += 1;
      } else {
        strengthDic[el] = 1;
      }
    });
    Object.keys(strengthDic).forEach((i) => {
      var genre = {};
      genre["text"] = i;
      genre["value"] = strengthDic[i];
      returnedList.push(genre);
    });

    return returnedList;
  }
  calcXYPlot(words) {
    for (var i in words) {
      barData["labels"].push(words[i].text);
      barData["datasets"][0].data.push(words[i].value);
    }
  }
  getUserData(access_token) {
    const options = {
      url: "https://api.spotify.com/v1/me",
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    };
    return axios(options);
  }
  getArtists(access_token, artistIDs) {
    let artistsIdString = artistIDs.toString();
    const options = {
      url: "https://api.spotify.com/v1/artists?ids=" + artistsIdString,
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    };
    return axios(options);
  }
  getArtist(access_token, artist) {
    const options = {
      url: "https://api.spotify.com/v1/search?q=" + artist + "&type=artist",
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    };
    return axios(options);
  }
  login() {
    //window.location.replace(endpoint);
    this.setState({ isLoggedIn: true });
  }
  logout() {
    window.location.replace("/");
    // window.location.reload(true);
  }
  componentDidMount() {
    //let params = getHashParams();
    /* 
    if (params.access_token !== undefined) {
      this.setState({ token: params.access_token });
      this.getUserData(params.access_token)
        .then((res) => {
          this.setState({ name: res.data.display_name });
          this.setState({ image: res.data.images[0].url });
          //window.history.replaceState({}, document.title, "/");
        })
        .catch((err) => {
          console.log(err);
          return;
        });
      */
    this.setState({ genres: genres });
    /* */

    var words = [];
    var xy_words = [];
    words = this.calcGenreStrength(genres);
    xy_words = this.calcXYPlot(weightedGenres);
    this.setState({ words: words });
    this.setState({ xy_data: xy_words });
    this.setState({ finishedLoadingGenres: true });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.isLoggedIn ? (
            <Fragment>
              <div className="textContainer">
                <h4>The Genres of Lost Lands 2021</h4>
                <p>
                  These are the genres that Spotify assigned each of the artists
                  on this years Lost Lands 2021 lineup.
                </p>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="textContainer">
                <h1>Welcome!</h1>
                <p>
                  This site uses the Spotify API to create data visualizations
                  relating to this years{" "}
                  <Link
                    href="https://www.lostlandsfestival.com/"
                    color="secondary"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Lost Lands
                  </Link>{" "}
                  lineup.
                </p>
              </div>
              <ThemeProvider theme={theme}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.login}
                >
                  Continue
                </Button>
              </ThemeProvider>
            </Fragment>
          )}
          {this.state.isLoggedIn && this.state.finishedLoadingGenres ? (
            <Fragment>
              <WordCloud words={this.state.words} />
              <Bar data={barData} options={options} />
            </Fragment>
          ) : (
            <p></p>
          )}
        </header>
        <footer className="App-footer">
          <Link
            color="inherit"
            href="https://phrank.me"
            rel="noopener noreferrer"
            target="_blank"
          >
            Made by Frank Lenoci
          </Link>
        </footer>
      </div>
    );
  }
}

export default withStyles(styles)(App);
