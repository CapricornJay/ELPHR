import React, { Component } from 'react';

class PatientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientData: null,
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    const { patientId } = this.props;
    console.log(patientId);

    // Replace 'apiUrl' with the actual URL of your API
    const apiUrl = `http://20.236.205.31:48/fhir/specifc_patient?patient_id=${patientId}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          patientData: data,
          isLoading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          patientData: null,
          isLoading: false,
          error: error,
        });
      });
  }

  render() {
    const { patientData, isLoading, error } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (!patientData) {
      return <div>No patient data available</div>;
    }

    return (
      <div>
        <h1>Patient Information</h1>
        <p>Name: {patientData.name}</p>
        <p>Birth Date: {patientData.birthDate}</p>

        <h2>Conditions:</h2>
        <ul>
          {patientData.conditions.map((condition) => (
            <li key={condition.id}>{condition.code}</li>
          ))}
        </ul>

        <h2>Medications:</h2>
        <ul>
          {patientData.medications.map((medication) => (
            <li key={medication.id}>{medication.code}</li>
          ))}
        </ul>

        <h2>Encounters:</h2>
        <ul>
          {patientData.encounters.map((encounter) => (
            <li key={encounter.id}>{encounter.type}</li>
          ))}
        </ul>

        <h2>Procedures:</h2>
        <ul>
          {patientData.procedures.map((procedure) => (
            <li key={procedure.id}>{procedure.name}</li>
          ))}
        </ul>

        <h2>Allergies:</h2>
        <ul>
          {patientData.allergies.map((allergy) => (
            <li key={allergy.id}>{allergy.substance}</li>
          ))}
        </ul>

      </div>
    );
  }
}

export default PatientInfo;
