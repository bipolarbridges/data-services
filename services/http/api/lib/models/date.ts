import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementInstance, MeasurementModel } from "./measurement";

export type DateProperties = {
    day: number,
    month: number,
    year: number,
    id: string
}

export type DateRelatedNode = {
    Measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>;
}

export type DateInstance = NeogmaInstance<DateProperties, DateRelatedNode>;

export type DateModel = NeogmaModel<DateProperties, DateRelatedNode>;