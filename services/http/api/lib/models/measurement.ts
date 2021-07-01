/* eslint-disable import/no-cycle */
import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from 'neogma';
import {
  DayInstance, DayModel,
  HourInstance, HourModel,
  MonthInstance, MonthModel,
  TimestampInstance, TimestampModel,
  YearInstance, YearModel,
} from './time';
import { SourceInstance, SourceModel } from './source';
import { UserInstance, UserModel } from './user';

export type MeasurementTypeProperties = {
  name: string,
};

export type MeasurementTypeRelatedNodesI = {
  Measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>,
  Source: ModelRelatedNodesI<SourceModel, SourceInstance>;
};

export type MeasurementTypeInstance =
NeogmaInstance<MeasurementTypeProperties, MeasurementTypeRelatedNodesI>;

export type MeasurementTypeModel =
NeogmaModel<MeasurementTypeProperties, MeasurementTypeRelatedNodesI>;

// -------------------------------------------------------------------------------------------------

export type MeasurementProperties = {
  value: number,
};

export type MeasurementRelatedNodes = {
  User: ModelRelatedNodesI<UserModel, UserInstance>,
  Hour: ModelRelatedNodesI<HourModel, HourInstance>;
  Day: ModelRelatedNodesI<DayModel, DayInstance>;
  Month: ModelRelatedNodesI<MonthModel, MonthInstance>;
  Year: ModelRelatedNodesI<YearModel, YearInstance>;
  Timestamp: ModelRelatedNodesI<TimestampModel, TimestampInstance>;
  MeasurementType: ModelRelatedNodesI<MeasurementTypeModel, MeasurementTypeInstance>;
};

export type MeasurementInstance = NeogmaInstance<MeasurementProperties, MeasurementRelatedNodes>;

export type MeasurementModel = NeogmaModel<MeasurementProperties, MeasurementRelatedNodes>;
