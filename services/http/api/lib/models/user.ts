import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementTypeInstance, MeasurementTypeModel } from "./measurement";
import { ResourceInstance, ResourceModel } from "./resource";

export type UserProperties = {
    uid: string,
    name?: string
}

export type UserRelatedNode = {
    measurementType: ModelRelatedNodesI<MeasurementTypeModel, MeasurementTypeInstance>,
    resource: ModelRelatedNodesI<ResourceModel, ResourceInstance>
}

export type UserInstance = NeogmaInstance<UserProperties, UserRelatedNode>;

export type UserModel = NeogmaModel<UserProperties,UserRelatedNode>;

