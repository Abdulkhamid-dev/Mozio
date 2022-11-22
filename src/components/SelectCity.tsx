import { Select, Form } from "antd";
import React, { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import { ICity, ISelectOpt } from "../interfaces";
import axios from "axios";

function SelectCity(props: any) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [cities, setCities] = useState<ICity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectOption, setSelectOption] = useState<ISelectOpt[]>([]);
  const getCities = async () => {
    try {
      const { data } = await axios.get<ICity[]>("https://mozio-server.herokuapp.com/cities");
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
          `https://mozio-server.herokuapp.com/cities?name=${debouncedSearch}`
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
    filter();
  }, [cities]);

  useEffect(() => {
    getCities();
    filter();
  }, []);

  const filter = () => {
    let filtered = cities.map((c) => ({
      label: c.name,
      value: c.name,
    }));
    setSelectOption(filtered);
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const onChange = (value: string) => {
    props.callBack(value);
  };
  return (
    <Form.Item label={props.InpLabel}   rules={[{required: true, message: 'Please fill the gap'}]}>
      <Select
        size="large"
        showSearch
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={false}
        options={selectOption}
        loading={loading}
      />
    </Form.Item>
  );
}

export default SelectCity;
