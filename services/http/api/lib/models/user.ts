import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementModel, MeasurementInstance } from "./measurement";
import { ResourceInstance, ResourceModel } from "./resource";

export type UserProperties = {
    uid: string,
    name?: string
}

export type UserRelatedNode = {
    Measurement: ModelRelatedNodesI<MeasurementModel, MeasurementInstance>,
    Resource: ModelRelatedNodesI<ResourceModel, ResourceInstance>
}

export type UserInstance = NeogmaInstance<UserProperties, UserRelatedNode>;

export type UserModel = NeogmaModel<UserProperties,UserRelatedNode>;

