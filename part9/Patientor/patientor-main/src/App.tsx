//import { useEffect } from "react";
//import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';
//import { apiBaseUrl } from "./constants";
//import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import Patientor from "./components/Patientor";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route path="/patients/:id" element={<Patientor />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
