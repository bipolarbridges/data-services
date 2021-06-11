// import { Integer, Time } from "neo4j-driver";
import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementModel, MeasurementTypeModel } from "./measurement";

export type HourProperties = {
    time: number
}

export type HourRelatedNodeI = {
    Value: ModelRelatedNodesI<MeasurementTypeModel, MeasurementModel>
}

export type HourInstance = NeogmaInstance<HourProperties, HourRelatedNodeI>;

export type HourModel = NeogmaModel<HourProperties, HourRelatedNodeI>;