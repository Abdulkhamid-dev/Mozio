import React from "react";
import "./App.css";
import "antd/dist/reset.css";
import { ICity } from "./interfaces";
import { StyledApp } from "./styles/styles";
import { Route, Routes } from "react-router-dom";
import Start from "./views/Start";
import Result from "./views/Result";

function App() {
  return (
    <StyledApp bg={require("./assets/imgs/road.jpg")} className="App">
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/results" element={<Result />} />
        <Route path="*" element={<Start />} />
      </Routes>
    </StyledApp>
  );
}

export default App;
