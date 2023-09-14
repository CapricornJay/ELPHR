import React, { Component } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Button, Form } from 'react-bootstrap';

class PatientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientData: null,
      isLoading: true,
      error: null,
      summaryData: null,
      question: '',     // For holding the question input
      answer: null      // For holding the API response based on the question
    };
  }

  componentDidMount() {
    const { patientId } = this.props;

    const summaryAPI = `https://fhir-ai.azurewebsites.net/fhir/get_patient_summary?patient_id=${patientId}`;

    // Replace 'apiUrl' with the actual URL of your API
    const apiUrl = `https://fhir-ai.azurewebsites.net/fhir/specifc_patient?patient_id=${patientId}`;

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
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          patientData: null,
          error: error
        });
      });

      fetch(summaryAPI)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);  
        this.setState({
          summaryData: data,
          isLoading: false
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

  handleQuestionChange = (e) => {
    this.setState({
      question: e.target.value
    });
  }

  fetchAnswer = (event) => {
    event.preventDefault();
    const { patientId } = this.props;
    const questionAPI = `https://fhir-ai.azurewebsites.net/fhir/get_patient_summary?patient_id=${patientId}&question=${this.state.question}`;
    
    fetch(questionAPI)
      .then(response => response.text())
      .then(data => {
        console.log(data);
        this.setState({ answer: data });
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  render() {
    const { patientData, summaryData, isLoading, error, answer } = this.state;

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
        <Card>
          <Card.Body>
            <Card.Title>{patientData.name}</Card.Title>
            <Card.Text>
              <p>Birth Date: {patientData.birthDate}</p>
            </Card.Text>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title>{'Summary'}</Card.Title>
            <Card.Text>
              <p>{summaryData}</p>
            </Card.Text>
          </Card.Body>
        </Card>

        <h2>Conditions:</h2>
        <ListGroup>
          {patientData.conditions.map((condition) => (
            <ListGroupItem key={condition.id}>{condition.code}</ListGroupItem>
          ))}
        </ListGroup>

        <h2>Medications:</h2>
        <ListGroup>
          {patientData.medications.map((medication) => (
            <ListGroupItem key={medication.id}>{medication.code}</ListGroupItem>
          ))}
        </ListGroup>

        <h2>Encounters:</h2>
        <ListGroup>
          {patientData.encounters.map((encounter) => (
            <ListGroupItem key={encounter.id}>{encounter.type}</ListGroupItem>
          ))}
        </ListGroup>

        <h2>Procedures:</h2>
        <ListGroup>
          {patientData.procedures.map((procedure) => (
            <ListGroupItem key={procedure.id}>{procedure.name}</ListGroupItem>
          ))}
        </ListGroup>

        <h2>Allergies:</h2>
        <ListGroup>
          {patientData.allergies.map((allergy) => (
            <ListGroupItem key={allergy.id}>{allergy.substance}</ListGroupItem>
          ))}
        </ListGroup>

        <div>
          <h2>Ask a Question:</h2>
          <Form onSubmit={this.fetchAnswer}>
            <Form.Group>
              <Form.Control type="text" placeholder="Enter your question here" onChange={this.handleQuestionChange} />
            </Form.Group>
            <Button type="submit">Get Answer</Button>
          </Form>
          {answer && <div><h3>Answer:</h3><p>{answer}</p></div>}
        </div>
      </div>
    );
  }
}

export default PatientInfo;
