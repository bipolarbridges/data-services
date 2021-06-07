import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { UserMeasurementInstance, UserMeasurementModel } from "./measurement";
import { ResourceInstance, ResourceModel } from "./resource";

export type UserProperties = {
    uid: string,
    name?: string
}

export type UserRelatedNode = {
    UserMeasurement: ModelRelatedNodesI<UserMeasurementModel, UserMeasurementInstance>,
    Resource: ModelRelatedNodesI<ResourceModel, ResourceInstance>
}

export type UserInstance = NeogmaInstance<UserProperties, UserRelatedNode>;

export type UserModel = NeogmaModel<UserProperties,UserRelatedNode>;

