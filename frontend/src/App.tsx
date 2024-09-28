import React from "react";

import { BrowserRouter as Router } from "react-router-dom";

import ConfigRoutes from "./routes";

import "./App.css";
import './index.css'; // Ensure this import is present in your main file


const App: React.FC = () => {

  return (

    <Router>

      <ConfigRoutes />

    </Router>

  );

};


export default App;