import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { DateInstance, DateModel } from "./date";
import { HourInstance, HourModel } from "./hour";
import { SourceInstance, SourceModel } from "./source";
import { UserInstance, UserModel } from "./user";

export type UserMeasurementProperties = {
    type: string,
}

export type UserMeasurementRelatedNodesI = {
    MeasurementValue: ModelRelatedNodesI<MeasurementValueModel, MeasurementValueInstance>,
    User: ModelRelatedNodesI<UserModel, UserInstance>,
    Source: ModelRelatedNodesI<SourceModel, SourceInstance>;
};

export type UserMeasurementInstance = NeogmaInstance<UserMeasurementProperties, UserMeasurementRelatedNodesI>;

export type UserMeasurementModel = NeogmaModel<UserMeasurementProperties, UserMeasurementRelatedNodesI>;

// ----------------------------------------------------------------------------------------------------------

export type ValueProperties = {
    value: number,
    subtype: string,
}

export type ValueRelatedNodeI = {
    Date: ModelRelatedNodesI<DateModel, DateInstance>;
    Hour: ModelRelatedNodesI<HourModel, HourInstance>;
}


export type MeasurementValueModel = NeogmaModel<ValueProperties, ValueRelatedNodeI>;

export type MeasurementValueInstance = NeogmaInstance<ValueProperties, ValueRelatedNodeI>;
