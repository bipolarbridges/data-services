import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementInstance, MeasurementModel } from "./measurement";

export type AppUserProperties = {
    uid: string,
    name?: string
}

export type AppUserRelatedNodes = {
    Measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>,
}

export type AppUserInstance = NeogmaInstance<AppUserProperties, AppUserRelatedNodes>;

export type AppUserModel = NeogmaModel<AppUserProperties,AppUserRelatedNodes>;

