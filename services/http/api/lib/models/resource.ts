import { database } from "../db";
import { ModelFactory, ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma"
import { UserInstance, UserModel } from "./user"

type ResourceProperties = {
    path: string
}

type ResourceRelatedNode = {
    User: ModelRelatedNodesI<typeof UserModel,UserInstance>
}

export type ResourceInstance = NeogmaInstance<ResourceProperties, ResourceRelatedNode>;

export const ResourceModel: NeogmaModel<
    ResourceProperties,
    ResourceRelatedNode> = ModelFactory<
    ResourceProperties,
    ResourceRelatedNode>(
        {
            label: 'Resource',
            schema: {
                path: {
                    type: 'string',
                    required: true
                }
            },
            relationships: {}
        },
        database().neogma
    )