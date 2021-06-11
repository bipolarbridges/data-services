import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { DateInstance, DateModel } from "./date";
import { HourInstance, HourModel } from "./hour";
import { SourceInstance, SourceModel } from "./source";
import { UserInstance, UserModel } from "./user";

export type MeasurementTypeProperties = {
    name: string,
}

export type MeasurementTypeRelatedNodesI = {
    Measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>,
    Source: ModelRelatedNodesI<SourceModel, SourceInstance>;
};

export type MeasurementTypeInstance = NeogmaInstance<MeasurementTypeProperties, MeasurementTypeRelatedNodesI>;

export type MeasurementTypeModel = NeogmaModel<MeasurementTypeProperties, MeasurementTypeRelatedNodesI>;

// ----------------------------------------------------------------------------------------------------------

export type MeasurementProperties = {
    value: number,
}

export type MeasurementRelatedNodeI = {
    User: ModelRelatedNodesI<UserModel, UserInstance>,
    Date: ModelRelatedNodesI<DateModel, DateInstance>;
    Hour: ModelRelatedNodesI<HourModel, HourInstance>;
}


export type MeasurementModel = NeogmaModel<MeasurementProperties, MeasurementRelatedNodeI>;

export type MeasurementInstance = NeogmaInstance<MeasurementProperties, MeasurementRelatedNodeI>;
