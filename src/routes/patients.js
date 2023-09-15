import React, { Component } from "react";
import PatientsListDisplay from "../components/PatientsListDisplay";
import { getPatientList } from "../javascript/api";
import Header from "../components/Header";
import Overlay from "../components/Overlay";
import { message } from "antd";

const moment = require("moment");

class PatientsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      awaitingData: true,
      patients: null,
      page: 0
    };
  }

  async componentDidMount() {
    let json = await getPatientList(message);

    this.setState({
      awaitingData: false,
      patients: json
    });
  }

  render() {
    let patientData = this.state.patients;
    if (this.props.filter && this.state.patients) {
      patientData = doFilter(this.state.patients, this.props.filter);
      if (patientData.length > 0) {
        message.success({ content: `Found ${patientData.length} matching records`, duration: 3 });
      } else {
        message.warn({ content: `No records found`, duration: 3 });
      }
    }
    console.log(patientData);
    return (
      <div>
        <Overlay show={this.state.awaitingData}></Overlay>
        {!this.props.filter && <Header title=""></Header>}
        <PatientsListDisplay patients={patientData} loading={this.state.awaitingData} />
      </div>
    );
  }
}

function recursiveFind(obj, value, exact) {
  let json = JSON.stringify(obj);
  const regex = exact
    ? new RegExp('"' + value.toLowerCase() + '"', "g")
    : new RegExp(".*" + value.toLowerCase() + ".*", "g");
  return json.toLowerCase().search(regex) !== -1;
}

function doFilter(patients, filter) {

  return patients;
}

export default PatientsPage;
