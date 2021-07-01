// import { Integer, Time } from "neo4j-driver";
import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from 'neogma';
// import { MeasurementInstance, MeasurementModel } from './measurement';

export type HourProperties = {
  hour: number
};

export type HourRelatedNodes = unknown;

export type HourInstance = NeogmaInstance<HourProperties, HourRelatedNodes>;

export type HourModel = NeogmaModel<HourProperties, HourRelatedNodes>;

// ======================================================================================

export type TimestampProperties = {
  time: number
};

export type TimestampRelatedNodes = unknown;

export type TimestampInstance = NeogmaInstance<TimestampProperties, TimestampRelatedNodes>;

export type TimestampModel = NeogmaModel<TimestampProperties, TimestampRelatedNodes>;

// ======================================================================================

export type DayProperties = {
  day: number
};

export type DayRelatedNodes = unknown;

export type DayInstance = NeogmaInstance<DayProperties, DayRelatedNodes>;

export type DayModel = NeogmaModel<DayProperties, DayRelatedNodes>;

// =======================================================================================

export type MonthProperties = {
  month: number
};

export type MonthRelatedNodes = {
  Day: ModelRelatedNodesI<DayModel, DayInstance>,
};

export type MonthInstance = NeogmaInstance<MonthProperties, MonthRelatedNodes>;

export type MonthModel = NeogmaModel<MonthProperties, MonthRelatedNodes>;

// =======================================================================================

export type YearProperties = {
  year: number
};

export type YearRelatedNodes = unknown;

export type YearInstance = NeogmaInstance<YearProperties, YearRelatedNodes>;

export type YearModel = NeogmaModel<YearProperties, YearRelatedNodes>;

// =======================================================================================
