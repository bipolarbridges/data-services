import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { DateInstance, DateModel } from "./date";
import { HourInstance, HourModel } from "./hour";
import { UserInstance, UserModel } from "./user";

export type UserMeasurementProperties = {
    type: string,
}

export type UserMeasurementRelatedNodesI = {
    MeasurementValue: ModelRelatedNodesI<MeasurementValueModel, MeasurementValueInstance>,
    User: ModelRelatedNodesI<UserModel, UserInstance>;
};

export type UserMeasurementInstance = NeogmaInstance<UserMeasurementProperties, UserMeasurementRelatedNodesI>;

export type UserMeasurementModel = NeogmaModel<UserMeasurementProperties, UserMeasurementRelatedNodesI>;

// ----------------------------------------------------------------------------------------------------------

export type ValueProperties = {
    value: number
}

export type ValueRelatedNodeI = {
    Date: ModelRelatedNodesI<DateModel, DateInstance>;
    Hour: ModelRelatedNodesI<HourModel, HourInstance>;
}


export type MeasurementValueModel = NeogmaModel<ValueProperties, ValueRelatedNodeI>;

export type MeasurementValueInstance = NeogmaInstance<ValueProperties, ValueRelatedNodeI>;
