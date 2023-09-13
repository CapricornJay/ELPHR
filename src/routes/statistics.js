import React from "react";
import Header from "../components/Header";
import Overlay from "../components/Overlay";
import { getPatientList, parseAllPatientData } from "../javascript/api";
import { Result, Button, Row, Col, Card, message, Skeleton } from "antd";

import { Doughnut, Bar, Pie, Polar, HorizontalBar } from "react-chartjs-2";

const DisplayCard = ({ children, title }) => {
  return (
    <Card style={{ width: "auto", margin: "10px" }} title={title} hoverable>
      {children}
    </Card>
  );
};

const patientData = {
  medications: {
    medication1: 2,
    medication2: 1,
    medication3: 3,
  },
  allergies: {
    allergy1: 1,
    allergy2: 2,
  },
  vaccinations: {
    vaccine1: 2,
    vaccine2: 1,
  },
  diagnoses: {
    diagnosis1: 3,
    diagnosis2: 1,
  },
};

const medicationData = {
  labels: Object.keys(patientData.medications),
  datasets: [
    {
      label: 'Medications',
      data: Object.values(patientData.medications),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
};

const allergyData = {
  labels: Object.keys(patientData.allergies),
  datasets: [
    {
      label: 'Allergies',
      data: Object.values(patientData.allergies),
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    },
  ],
};

const vaccinationData = {
  labels: Object.keys(patientData.vaccinations),
  datasets: [
    {
      label: 'Vaccinations',
      data: Object.values(patientData.vaccinations),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    },
  ],
};

const diagnosisData = {
  labels: Object.keys(patientData.diagnoses),
  datasets: [
    {
      label: 'Diagnoses',
      data: Object.values(patientData.diagnoses),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    },
  ],
}; 

class StatisticsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: null
    };
  }

  async componentDidMount() {
    let json = await getPatientList(message);
    json = parseAllPatientData(json);

    this.setState({
      patients: json
    });
  }


  render() {
    return (
      <div>
        <Overlay show={!this.state.patients}></Overlay>
        <Header title=""></Header>
        {this.state.patients ? (
          <div>
            <Row className="statPadding">
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <DisplayCard children={      <div className="chart">
        <Pie data={allergyData} />
      </div>} title="Allergies"></DisplayCard>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <DisplayCard children={      <div className="chart">
        <Bar data={medicationData} />
      </div>} title="Number of Medications"></DisplayCard>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <DisplayCard children={      <div className="chart">
        <Bar data={vaccinationData} />
      </div>} title="Vaccinations"></DisplayCard>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <DisplayCard
                  children={      <div className="chart">
                  <Pie data={diagnosisData} />
                </div>}
                  title="Diagnoses"
                ></DisplayCard>
              </Col>
            </Row>
          </div>
        ) : (
          <div className="statPadding">
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        )}
      </div>
    );
  }
}

export default StatisticsPage;
