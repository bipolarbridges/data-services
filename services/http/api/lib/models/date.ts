import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementValueInstance, MeasurementValueModel } from "./measurement";

export type DateProperties = {
    day: number,
    month: number,
    year: number,
    id: string
}

export type DateRelatedNode = {
    MeasurementValue: ModelRelatedNodesI<MeasurementValueModel, MeasurementValueInstance>;
}

export type DateInstance = NeogmaInstance<DateProperties, DateRelatedNode>;

export type DateModel = NeogmaModel<DateProperties, DateRelatedNode>;