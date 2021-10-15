import React, { Component } from "react";
import ReactWordCloud from "react-wordcloud";
import { isMobile } from "react-device-detect";
import { Button } from "@material-ui/core";
import { green, purple } from "@material-ui/core/colors";
import { TextField } from "@material-ui/core";
import "./WordCloud.css";
const tooltip = { theme: "#ffff" };
const options = {
  colors: [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#fe664e",
    "#9467bd",
    "#29c9a5",
    "#cdf52e",
  ],
  enableTooltip: true,
  deterministic: false, //enable if want to keep same pattern
  fontFamily: "impact",
  fontSizes: isMobile ? [15, 70] : [15, 90], //lower size to fix count problem, see console
  fontStyle: "normal",
  fontWeight: "normal",
  rotations: 0,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000,
  tooltipOptions: tooltip,
};

class WordCloud extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reload: true,
      options: {
        colors: [
          "#1f77b4",
          "#ff7f0e",
          "#2ca02c",
          "#fe664e",
          "#9467bd",
          "#29c9a5",
          "#cdf52e",
        ],
        enableTooltip: true,
        deterministic: false, //enable if want to keep same pattern
        fontFamily: "impact",
        fontSizes: isMobile ? [15, 70] : [15, 90], //lower size to fix count problem, see console
        fontStyle: "normal",
        fontWeight: "normal",
        rotations: 0,
        rotationAngles: [0, 90],
        scale: "sqrt",
        spiral: "archimedean",
        transitionDuration: 1000,
        tooltipOptions: tooltip,
      },
    };
    this.reload = this.reload.bind(this);
    this.onRotationInputchange = this.onRotationInputchange.bind(this);
    this.onRotationAngleInputchange = this.onRotationAngleInputchange.bind(
      this
    );
  }
  reload() {
    this.setState({ reload: !this.state.reload });
  }
  onRotationInputchange(value) {
    var property = { ...this.state.options };
    if (value >= 15) {
      property.rotations = 15;
    } else if (value <= 0) {
      property.rotations = 0;
    } else {
      property.rotations = value;
    }

    this.setState({ options: property });
  }
  onRotationAngleInputchange(value) {
    var property = { ...this.state.options };
    var values = value.split(",");
    property.rotationAngles = values;
    this.setState({ options: property });
  }
  render() {
    return (
      <div id="wordCloud" className="wordCloud">
        <TextField
          id="filled-text"
          label="Rotations"
          color="primary"
          type="number"
          value={this.state.options.rotations}
          onChange={(e) => this.onRotationInputchange(e.target.value)}
          variant="filled"
          style={{ top: "-5vh", marginBottom: "1rem", background: "white" }}
        ></TextField>

        <div className="innerCloud">
          <ReactWordCloud
            id="svg-art"
            words={this.props.words}
            options={this.state.options}
          />
        </div>
        <Button
          className="reloadButton"
          variant="contained"
          color="primary"
          onClick={this.reload}
        >
          Reload Word Cloud
        </Button>
      </div>
    );
  }
}

export default WordCloud;
