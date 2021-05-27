import { database } from "../db";
import { ModelFactory, ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementModel, MeasurementInstance } from "./measurement";
import { ResourceInstance, ResourceModel } from "./resource";

type UserProperties = {
    uid: string,
    name?: string
}

type UserRelatedNode = {
    Measurement: ModelRelatedNodesI<typeof MeasurementModel, MeasurementInstance>,
    Resource: ModelRelatedNodesI<typeof ResourceModel, ResourceInstance>
}

export type UserInstance = NeogmaInstance<UserProperties, UserRelatedNode>;

export const UserModel: NeogmaModel<
    UserProperties,
    UserRelatedNode> = ModelFactory<
    UserProperties, 
    UserRelatedNode>(
        {
            label: 'User',
            schema: {
                uid: {
                    type: 'string',
                    required: true,
                },
                name: {
                    type: 'string',
                }
            },
            relationships: {
                Measurement: {
                    model: MeasurementModel,
                    direction: 'out',
                    name: '',
                    properties: {
    
                    }
                },
                Resource: {
                    model: ResourceModel,
                    direction: 'out',
                    name: '',
                    properties: {
    
                    }
                }
            },
            primaryKeyField: 'uid',
        },
        database().neogma
);
