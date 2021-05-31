import { database } from "../db";
import { ModelFactory, ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { ResourceInstance, ResourceModel } from "./resource";

type IdentityProperties = {
    type: string,
    name: string,
    check: string
}

type IdentityRelatedNode = {
    Resource: ModelRelatedNodesI<typeof ResourceModel, ResourceInstance>
}

export type IdentityInstance = NeogmaInstance<IdentityProperties, IdentityRelatedNode>

export const IdentityModel: NeogmaModel<IdentityProperties, IdentityRelatedNode> = ModelFactory<IdentityProperties, IdentityRelatedNode>(
    {
        label: 'Identity',
        schema: {
            type: {
                type: 'string',
                required: true
            },
            name: {
                type: 'string',
                required: true
            },
            check: {
                type: 'string',
                required: true
            },
        },
        relationships: {
            Resource: {
                model: ResourceModel,
                direction: 'out',
                name: 'Can',
                properties: {
                    method: {
                        property: 'method',
                        schema: {
                            type: 'string'
                        }
                    }
                }
                
            }
        }
    },
    database().neogma
)