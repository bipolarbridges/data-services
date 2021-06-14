// import { Integer, Time } from "neo4j-driver";
import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementModel, MeasurementTypeModel } from "./measurement";


export type HourProperties = {
    hour: number
}

export type HourRelatedNodeI = {
    Value: ModelRelatedNodesI<MeasurementTypeModel, MeasurementModel>
}

export type HourInstance = NeogmaInstance<HourProperties, HourRelatedNodeI>;

export type HourModel = NeogmaModel<HourProperties, HourRelatedNodeI>;

// ======================================================================================

export type TimestampProperties = {
    time: number
}

export type TimestampRelatedNodeI = {
    Value: ModelRelatedNodesI<MeasurementTypeModel, MeasurementModel>
}

export type TimestampInstance = NeogmaInstance<TimestampProperties, TimestampRelatedNodeI>;

export type TimestampModel = NeogmaModel<TimestampProperties, TimestampRelatedNodeI>;

// ======================================================================================

export type DayProperties = {
    day: number
}

export type DayRelatedNodeI = {
    Value: ModelRelatedNodesI<MeasurementTypeModel, MeasurementModel>
}

export type DayInstance = NeogmaInstance<DayProperties, DayRelatedNodeI>;

export type DayModel = NeogmaModel<DayProperties, DayRelatedNodeI>;

// =======================================================================================

export type MonthProperties = {
    month: number
}

export type MonthRelatedNodeI = {
    Value: ModelRelatedNodesI<MeasurementTypeModel, MeasurementModel>
}

export type MonthInstance = NeogmaInstance<MonthProperties, MonthRelatedNodeI>;

export type MonthModel = NeogmaModel<MonthProperties, MonthRelatedNodeI>;

// =======================================================================================

export type YearProperties = {
    year: number
}

export type YearRelatedNodeI = {
    Value: ModelRelatedNodesI<MeasurementTypeModel, MeasurementModel>
}

export type YearInstance = NeogmaInstance<YearProperties, YearRelatedNodeI>;

export type YearModel = NeogmaModel<YearProperties, YearRelatedNodeI>;

// =======================================================================================

