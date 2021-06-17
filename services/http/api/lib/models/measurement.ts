import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
// import { DateInstance, DateModel } from "./date";
import { DayInstance, DayModel, HourInstance, HourModel, MonthInstance, MonthModel, TimestampInstance, TimestampModel, YearInstance, YearModel } from "./time";
import { SourceInstance, SourceModel } from "./source";
import { UserInstance, UserModel } from "./user";

export type MeasurementTypeProperties = {
    name: string,
}

export type MeasurementTypeRelatedNodesI = {
    measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>,
    source: ModelRelatedNodesI<SourceModel, SourceInstance>;
};

export type MeasurementTypeInstance = NeogmaInstance<MeasurementTypeProperties, MeasurementTypeRelatedNodesI>;

export type MeasurementTypeModel = NeogmaModel<MeasurementTypeProperties, MeasurementTypeRelatedNodesI>;

// ----------------------------------------------------------------------------------------------------------

export type MeasurementProperties = {
    value: number,
}

export type MeasurementRelatedNodeI = {
    user: ModelRelatedNodesI<UserModel, UserInstance>,
    hour: ModelRelatedNodesI<HourModel, HourInstance>;
    day: ModelRelatedNodesI<DayModel, DayInstance>;
    month: ModelRelatedNodesI<MonthModel, MonthInstance>;
    year: ModelRelatedNodesI<YearModel, YearInstance>;
    timestamp: ModelRelatedNodesI<TimestampModel, TimestampInstance>;
}


export type MeasurementModel = NeogmaModel<MeasurementProperties, MeasurementRelatedNodeI>;

export type MeasurementInstance = NeogmaInstance<MeasurementProperties, MeasurementRelatedNodeI>;
