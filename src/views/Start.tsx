import React, { useEffect, useState } from "react";
import { StyledStart } from "../styles/styles";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { ICity, IinputValues, ISelectOpt } from "../interfaces";
import axios from "axios";
import moment from "moment";
import { DatePickerProps, InputNumber } from "antd";
import { Button, Col, DatePicker, Form, Row, Select } from "antd";
import SelectCity from "../components/SelectCity";

function Start() {
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 500);
  const [pesseng, setPesseng] = useState<string | number | null>("1");
  const [inputValues, setInputValues] = useState<IinputValues>({
    origin: "",
    destination: "",
    intermediates: [],
    passengers: 1,
    date: moment(new Date()),
  });
  const [disabledSave, setDisabledSave] = useState(true);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectOption, setSelectOption] = useState<ISelectOpt[]>([]);

  const getCities = async () => {
    try {
      const { data } = await axios.get<ICity[]>("http://localhost:3010/cities");
      setCities(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function getSearch() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:3010/cities?name=${debouncedSearch}`
        );
        setCities(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    if (debouncedSearch) {
      getSearch();
    } else {
      getCities();
    }
  }, [debouncedSearch]);

  useEffect(() => {
    getCities();
    filter();
  }, []);

  useEffect(() => {
    filter();
  }, [cities]);

  const filter = () => {
    let filtered = cities.map((c) => ({
      label: c.name,
      value: c.name,
    }));
    setSelectOption(filtered);
  };
  const setOriginCity = (value: string) => {
    setInputValues({ ...inputValues, origin: value });
    isValid();
  };
  const setDestinationCity = (value: string) => {
    setInputValues({ ...inputValues, destination: value });
    isValid();
  };

  const handleChange = (value: string[]) => {
    setInputValues({ ...inputValues, intermediates: value });
    getCities();
    isValid();
  };
  const handlePassenger = (e: { target: { value: any } }) => {
    setInputValues({ ...inputValues, passengers: e.target.value });
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };
  const handleDate: DatePickerProps["onChange"] = (
    dateObject,
    dateString
  ): void => {
    setInputValues({ ...inputValues, date: moment(dateString) });
    isValid();
  };

  const isValid = () => {
    const { origin, destination, date, passengers } = inputValues;
    if (
      origin === "" ||
      destination === "" ||
      date === null ||
      passengers === undefined
    ) {
      setDisabledSave(true);
    } else {
      setDisabledSave(false);
    }
  };
  const handleSubmit = () => {
    const { origin, destination, passengers, date, intermediates } =
      inputValues;
    navigate({
      pathname: "/results",
      search: `?start=${origin}&end=${destination}&date=${moment(date).format(
        "YYYY-MM-DD"
      )}&passengers=${passengers}&cities=${intermediates}`,
    });
  };

  return (
    <StyledStart>
      <h1 className="title">Travel around the Italy</h1>
      <div className="main">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={20}>
            <Col span={12}>
              <SelectCity
                InpLabel="Select City origin"
                callBack={setOriginCity}
              />
            </Col>
            <Col span={12}>
              <SelectCity
                InpLabel="Select City destination"
                callBack={setDestinationCity}
              />
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                label="Intermediate cities"
                rules={[{ required: false, message: "Please input" }]}
              >
                <Select
                  size="large"
                  mode="multiple"
                  showSearch
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  onSearch={onSearch}
                  onChange={handleChange}
                  loading={loading}
                  options={selectOption}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label="Date"
                rules={[{ required: true, message: "Please input Date" }]}
              >
                <DatePicker
                  size="large"
                  onChange={handleDate}
                  format="YYYY/MM/DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Passengers"
                rules={[{ required: true, message: "Please input passengers" }]}
              >
                <InputNumber
                  size="large"
                  min={1}
                  value={pesseng}
                  onChange={setPesseng}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            disabled={disabledSave}
            size="large"
            type="primary"
            htmlType="submit"
          >
            Travel
          </Button>
        </Form>
      </div>
    </StyledStart>
  );
}

export default Start;
