import React, { Component, createRef } from "react";
import { GetAslModules, importASL } from "../utilities/utilities";
import { RESULT_SUCCESS } from "../globals/constants";

const TitledSelect = GetAslModules("TitledSelect");

var countryStateData = {};

export class StateSelecter extends Component {
  countryRef = createRef();
  stateRef = createRef();

  constructor(props) {
    super(props);
    this.state = { countries: [], allData: {}, states: [] };
  }

  async componentDidMount() {
    const { TOAST, POPUP } = await importASL();
    this.TOAST = TOAST;
    this.POPUP = POPUP;
    if (Object.keys(countryStateData).length > 0) {
      this.processData(countryStateData);
    } else {
      fetch("/service/locations/country/state")
        .then((res) => {
          if (!res.ok) { throw new Error("Error while getting record"); }
          return res.json();
        }).then(this.onSuccess).catch(this.onError);
    }
  }

  onSuccess = (d) => {
    const { result, data } = d;
    if (result === RESULT_SUCCESS && data) {
      countryStateData = data;
      this.processData(data);
    } else {
      this.setState({ countries: [], allData: {}, states: [] });
      this.TOAST.current.showWarning("Error", "Failed to load Country and other data");
    }
  };

  onError = (err) => {
    this.setState({ countries: [], allData: {}, states: [] });
    this.TOAST.current.showFailed("Error", "Unable to fetch country/state list");
  };

  processData = (data) => {
    this.setState({ allData: data, countries: Object.keys(data), states: [] });
  }

  onCountryChange = (value) => {
    const { allData } = this.state;
    if (value && allData[value]) {
      this.setState({ states: allData[value] });
    } else {
      this.setState({ states: [] });
    }
  };

  setValid = (key, valid) => {
    switch (key) {
      case "country":
        this.countryRef.current?.setValid(valid);
        break;
      case "state":
        this.stateRef.current?.setValid(valid);
        break;
    }
  };

  isValid = () => {
    return this.countryRef.current?.isValid() && this.stateRef.current?.isValid();
  };

  getValue = () => {
    return {
      country: this.countryRef.current?.getValue(),
      state: this.stateRef.current?.getValue(),
    };
  };

  render() {
    const { css = "", style = {} } = this.props;
    const { countries, states } = this.state;
    const countryProp = { placeholder: "Country", options: countries, onChange: this.onCountryChange };
    const stateProp = { placeholder: "State", options: states };
    return <div className={css} style={style}>
      <TitledSelect ref={this.countryRef} {...countryProp} />
      <TitledSelect ref={this.stateRef} {...stateProp} />
    </div>;
  }
}
