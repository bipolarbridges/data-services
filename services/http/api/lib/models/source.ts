import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { UserMeasurementInstance, UserMeasurementModel } from "./measurement";

export type SourceProperties = {
    type: string
}

export type SourceRelatedNodeI = {
    UserMeasurement: ModelRelatedNodesI<UserMeasurementModel, UserMeasurementInstance>
}

export type SourceInstance = NeogmaInstance<SourceProperties, SourceRelatedNodeI>;

export type SourceModel = NeogmaModel<SourceProperties, SourceRelatedNodeI>;
