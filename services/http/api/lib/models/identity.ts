import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { ResourceInstance, ResourceModel } from "./resource";

export type IdentityProperties = {
    type: string,
    name: string,
    check: string
}

export type IdentityRelatedNode = {
    resource: ModelRelatedNodesI<ResourceModel, ResourceInstance>
}

export type IdentityInstance = NeogmaInstance<IdentityProperties, IdentityRelatedNode>

export type IdentityModel = NeogmaModel<IdentityProperties, IdentityRelatedNode>;