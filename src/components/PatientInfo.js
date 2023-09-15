import React, { Component } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  formatSummary(summaryText) {
    const majorSections = summaryText.split(': - ');
  
    const formattedSections = majorSections.map(section => {
      const [header, ...rest] = section.split('- ').map(s => s.trim());
  
      // if a section doesn't have items
      if (!rest.length) {
        return <h3 key={header}>{header}</h3>;
      }
  
      // Convert list items to JSX
      const items = rest.map((item, index) => {
        // Check if item is a key-value pair
        if (item.includes(': ')) {
          const [key, value] = item.split(': ');
          return <p key={`${key}-${index}`}><strong>{key}:</strong> {value}</p>;
        } else {
          return <p key={`${item}-${index}`}>&bull; {item}</p>;
        }
      });
  
      return (
        <div key={header}>
          <h3>{header}</h3>
          {items}
        </div>
      );
    });
  
    return formattedSections;
  }
  

  render() {
    const { patientData, summaryData, isLoading, error, answer } = this.state;

    if (isLoading) {
      return <div className="text-center m-4">Loading...</div>;
    }

    if (error) {
      return <div className="text-center text-danger m-4">Error: {error.message}</div>;
    }

    if (!patientData) {
      return <div className="text-center m-4">No patient data available</div>;
    }

    return (
      <div className="container mt-4">
        <h1 className="text-center mb-4">Patient Information</h1>
        
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>{patientData.name}</Card.Title>
            <Card.Text>Birth Date: {patientData.birthDate}</Card.Text>
          </Card.Body>
        </Card>

        <Card className="mb-3">
        <Card.Body>
          <div>{this.formatSummary(summaryData)}</div>
        </Card.Body>
      </Card>

        {this.renderInfoSection("Conditions", patientData.conditions, "code")}
        {this.renderInfoSection("Medications", patientData.medications, "code")}
        {this.renderInfoSection("Encounters", patientData.encounters, "type")}
        {this.renderInfoSection("Procedures", patientData.procedures, "code")}
        {this.renderInfoSection("Allergies", patientData.allergies, "substance")}

        <div className="mt-4">
          <h2 className="mb-3">Ask a Question:</h2>
          <Form onSubmit={this.fetchAnswer}>
            <Form.Group>
              <Form.Control type="text" placeholder="Enter your question here" onChange={this.handleQuestionChange} />
            </Form.Group>
            <Button type="submit" className="mt-2">Get Answer</Button> {/* Added margin-top class here */}
          </Form>
          {answer && <div className="mt-3"><h3>Answer:</h3><p>{answer}</p></div>}
        </div>
      </div>
    );
  }

  renderInfoSection(title, data, keyProperty) {
    return (
    <Card className="mb-3">
      <Card.Header className="bg-primary text-light">{title}</Card.Header>
      <ListGroup variant="flush">
        {data.length > 0 ? (
          data.map((item) => (
            <ListGroupItem key={item.id}>{item[keyProperty]}</ListGroupItem>
          ))
        ) : (
          <ListGroupItem>No data available</ListGroupItem>
        )}
      </ListGroup>
    </Card>
    );
  }
}

export default PatientInfo;
