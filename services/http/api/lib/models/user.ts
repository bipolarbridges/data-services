import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { UserMeasurementInstance, UserMeasurementModel } from "./measurement";

export type UserProperties = {
    uid: string,
    name?: string
}

export type UserRelatedNode = {
    UserMeasurement: ModelRelatedNodesI<UserMeasurementModel, UserMeasurementInstance>,
}

export type UserInstance = NeogmaInstance<UserProperties, UserRelatedNode>;

export type UserModel = NeogmaModel<UserProperties,UserRelatedNode>;

