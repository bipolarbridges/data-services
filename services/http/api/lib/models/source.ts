import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementTypeInstance, MeasurementTypeModel } from "./measurement";

export type SourceProperties = {
    name: string
}

export type SourceRelatedNodeI = {
    MeasurementType: ModelRelatedNodesI<MeasurementTypeModel, MeasurementTypeInstance>
}

export type SourceInstance = NeogmaInstance<SourceProperties, SourceRelatedNodeI>;

export type SourceModel = NeogmaModel<SourceProperties, SourceRelatedNodeI>;
