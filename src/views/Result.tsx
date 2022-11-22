import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { StyledResult } from "../styles/styles";
import { message, Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Result() {
  const queries: any = queryString.parse(window.location.search);
  const navigate = useNavigate();
  const [allLocation, setAllLocation] = useState<string[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { start, end, passengers, date, cities } = queries;

  useEffect(() => {
    checkUrl();
    earnCities();
    calcAllDist();
  }, []);

  const earnCities = () => {
    setAllLocation([start, ...cities.split(","), end]);
  };

  useEffect(() => {
    calcAllDist();
  }, [allLocation]);

  console.log(distance);

  const calcAllDist = () => {
    setLoading(true);
    allLocation.forEach(async (item, index) => {
      if (allLocation[index + 1]) {
        const firstC: any = await getLonLat(allLocation[index]);
        const secondC: any = await getLonLat(allLocation[index + 1]);
        if (firstC && secondC) {
          let distRes = calcDistForm(
            firstC[0].lat,
            firstC[0].lan,
            secondC[0].lat,
            secondC[0].lan
          );
          setDistance(distance + distRes);
          setLoading(false);
        }
      }
      setLoading(false);
    });
  };
  const getLonLat = async (city: string) => {
    try {
      const { data } = await axios.get(
        `https://mozio-server.herokuapp.com/cities?name=${city}`
      );
      if (data) {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const calcDistForm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;
      dist.toFixed(1);
      return Math.floor(dist);
    }
  };
  const checkUrl = () => {
    if (start === "" || end === "" || passengers === "" || date === "") {
      navigate("/not-found");
    } else if (
      start?.includes("Dijon") ||
      end?.includes("Dijon") ||
      cities?.includes("Dijon")
    ) {
      message.error(
        "Please select another city Dijon city is on lockdown for coronavirus!"
      );
      navigate("/");
    }
  };

  return (
    <StyledResult>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="main">
          <h1>
            Date: <strong>{queries?.date}</strong>
          </h1>
          <h1>
            Distance: <strong>{distance} km</strong>
          </h1>
          <h1>
            Passengers: <strong>{queries.passengers}</strong>
          </h1>
        </div>
      )}
    </StyledResult>
  );
}

export default Result;
