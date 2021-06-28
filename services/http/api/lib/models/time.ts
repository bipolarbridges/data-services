import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from 'neogma';
import { MeasurementInstance, MeasurementModel } from './measurement';

export type HourProperties = {
  hour: number
};

export type HourRelatedNodes = {
  measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>
};

export type HourInstance = NeogmaInstance<HourProperties, HourRelatedNodes>;

export type HourModel = NeogmaModel<HourProperties, HourRelatedNodes>;

/*
 * Timestamp
 */

export type TimestampProperties = {
  time: number
};

export type TimestampRelatedNodes = {
  Measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>
};

export type TimestampInstance = NeogmaInstance<TimestampProperties, TimestampRelatedNodes>;

export type TimestampModel = NeogmaModel<TimestampProperties, TimestampRelatedNodes>;

/*
 * Day
 */
export type DayProperties = {
  day: number
};

export type DayRelatedNodes = {
  Measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>
};

export type DayInstance = NeogmaInstance<DayProperties, DayRelatedNodes>;

export type DayModel = NeogmaModel<DayProperties, DayRelatedNodes>;

/*
 * Month
 */
export type MonthProperties = {
  month: number
};

export type MonthRelatedNodes = {
  Measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>;
  Day: ModelRelatedNodesI<DayModel, DayInstance>;
};

export type MonthInstance = NeogmaInstance<MonthProperties, MonthRelatedNodes>;

export type MonthModel = NeogmaModel<MonthProperties, MonthRelatedNodes>;

/*
 * Year
 */
export type YearProperties = {
  year: number
};

export type YearRelatedNodes = {
  Measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>
};

export type YearInstance = NeogmaInstance<YearProperties, YearRelatedNodes>;

export type YearModel = NeogmaModel<YearProperties, YearRelatedNodes>;
