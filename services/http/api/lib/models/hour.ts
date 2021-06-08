// import { Integer, Time } from "neo4j-driver";
import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementValueModel, UserMeasurementModel } from "./measurement";

export type HourProperties = {
    time: number
}

export type HourRelatedNodeI = {
    Value: ModelRelatedNodesI<UserMeasurementModel, MeasurementValueModel>
}

export type HourInstance = NeogmaInstance<HourProperties, HourRelatedNodeI>;

export type HourModel = NeogmaModel<HourProperties, HourRelatedNodeI>;