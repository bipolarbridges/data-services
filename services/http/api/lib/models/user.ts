import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementInstance, MeasurementModel } from "./measurement";

export type UserProperties = {
    uid: string,
    name?: string
}

export type UserRelatedNodes = {
    Measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>,
}

export type UserInstance = NeogmaInstance<UserProperties, UserRelatedNodes>;

export type UserModel = NeogmaModel<UserProperties,UserRelatedNodes>;

