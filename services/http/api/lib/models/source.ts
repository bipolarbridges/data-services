import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementTypeInstance, MeasurementTypeModel } from "./measurement";

export type SourceProperties = {
    name: string
}

export type SourceRelatedNodes = {
    MeasurementType: ModelRelatedNodesI<MeasurementTypeModel, MeasurementTypeInstance>
}

export type SourceInstance = NeogmaInstance<SourceProperties, SourceRelatedNodes>;

export type SourceModel = NeogmaModel<SourceProperties, SourceRelatedNodes>;
