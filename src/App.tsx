import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import "antd/dist/reset.css";
import { ICity } from "./interfaces";
import { StyledApp } from "./styles/styles";
import { Route, Routes } from "react-router-dom";
import Start from "./views/Start";
import Result from "./views/Result";

function App() {
  const [data, setData] = useState<ICity[]>();

  const getCity = async () => {
    try {
      const { data } = await axios.get<ICity[]>("http://localhost:3010/cities");
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCity();
  }, []);
  return (
    <StyledApp bg={require("./assets/imgs/road.jpg")} className="App">
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/results" element={<Result />} />
      </Routes>
    </StyledApp>
  );
}

export default App;
