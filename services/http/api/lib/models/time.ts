import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from 'neogma';

export type HourProperties = {
  hour: number
};

export type HourRelatedNodes = unknown;

export type HourInstance = NeogmaInstance<HourProperties, HourRelatedNodes>;

export type HourModel = NeogmaModel<HourProperties, HourRelatedNodes>;

/*
 * Timestamp
 */

export type TimestampProperties = {
  time: number
};

export type TimestampRelatedNodes = unknown;

export type TimestampInstance = NeogmaInstance<TimestampProperties, TimestampRelatedNodes>;

export type TimestampModel = NeogmaModel<TimestampProperties, TimestampRelatedNodes>;

/*
 * Day
 */
export type DayProperties = {
  day: number
};

export type DayRelatedNodes = unknown;

export type DayInstance = NeogmaInstance<DayProperties, DayRelatedNodes>;

export type DayModel = NeogmaModel<DayProperties, DayRelatedNodes>;

/*
 * Month
 */
export type MonthProperties = {
  month: number
};

export type MonthRelatedNodes = {
  Day: ModelRelatedNodesI<DayModel, DayInstance>,
};

export type MonthInstance = NeogmaInstance<MonthProperties, MonthRelatedNodes>;

export type MonthModel = NeogmaModel<MonthProperties, MonthRelatedNodes>;

/*
 * Year
 */
export type YearProperties = {
  year: number
};

export type YearRelatedNodes = unknown;

export type YearInstance = NeogmaInstance<YearProperties, YearRelatedNodes>;

export type YearModel = NeogmaModel<YearProperties, YearRelatedNodes>;
