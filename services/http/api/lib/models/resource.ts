import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma"
import { UserInstance, UserModel } from "./user"

export type ResourceProperties = {
    path: string
}

export type ResourceRelatedNode = {
    User: ModelRelatedNodesI<UserModel, UserInstance>
}

export type ResourceInstance = NeogmaInstance<ResourceProperties, ResourceRelatedNode>;

export type ResourceModel = NeogmaModel<ResourceProperties,ResourceRelatedNode>;

