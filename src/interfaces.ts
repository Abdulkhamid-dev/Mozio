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
  origin: string;
  destination: string;
  intermediates: string[];
  passengers: string | number | null;
  date: Moment | null;
}
