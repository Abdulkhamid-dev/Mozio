import { Moment } from "moment";

export interface ICity {
  name: string;
  label: string;
  lat: number;
  lan: number;
}
export interface ISelectOpt {
  label: string;
  value: string;
}
export interface IinputValues {
  start: string;
  end: string;
  intermediates: string[];
  passengers: string | number | null;
  date: Moment | null;
}
