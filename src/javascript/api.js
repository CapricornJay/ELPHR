let patientListDemo = require("./patientDemoData.json");
let observationDemo = require("./observationDemoData.json");

const SERVER_URL = "https://fhir-ai.azurewebsites.net/fhir/get_patients"

const moment = require("moment");

const getPatientDemo = () => {
  return combinePatientsBundle(patientListDemo);
};

const getObservationDemo = () => {
  return combinePatientsBundle(observationDemo);
};

function combinePatientsBundle(json) {
  return json.results;
}

function requestObservation(id) {
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + "Observation/" + id)
      .then(async res => {
        let json = await res.json();
        console.log(json);
        json = combinePatientsBundle(json);
        resolve(json);
      })
      .catch(e => {
        reject(e);
        console.log(e);
      });
  });
}

function requestPatientList() {
  return new Promise((resolve, reject) => {
    let localCache = localStorage.getItem("patients");
    if (localCache) {
      setTimeout(() => {
        resolve(JSON.parse(localCache));
      }, 1000);
    } else {
      let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');
      fetch(SERVER_URL).then(async res => {
          let json = await res.json();
          console.log(json);
          json = combinePatientsBundle(json);
          localStorage.setItem("patients", JSON.stringify(json));
          resolve(json);
        })
        .catch(e => {
          reject(e);
          console.log(e);
        });
    }
  });
}

function getPatientList(message) {
  return new Promise(async resolve => {
    let json = null;
    if (window.$globalPatients) {
      json = window.$globalPatients;
    } else {
      // start load api, show loading
      const hideLoading = message.loading("Please wait, fetching patient data...", 0);
      try {
        json = await requestPatientList();
        message.success({ content: "Patient data loaded!", duration: 2 });
      } catch (e) {
        json = getPatientDemo();
        message.warn({
          content: "Network Error, the server might be down. Local demo data is loaded.",
          duration: 5
        });
      }
      window.$globalPatients = json;
      hideLoading();
    }
    resolve(json);
  });
}

function parseAllPatientData(patients) {
  const tableData = [];
  patients.forEach(elementRaw => {
    if (!elementRaw) {
      return null;
    }

    let element = elementRaw;
    let patient = new Object();
    patient.name = element.name;
    patient.gender = element.gender;
    patient.id = element.id;
    patient.phoneNumber = element.phoneNumber;
    patient.phoneType = element.phoneType;
    patient.birthDate = element.birthDate;
    tableData.push(patient);
  });

  return tableData;
}

export {
  requestPatientList,
  requestObservation,
  getPatientDemo,
  getObservationDemo,
  parseAllPatientData,
  getPatientList
};
