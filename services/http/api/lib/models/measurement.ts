import { database } from "db/*";
import { ModelFactory, ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { ClientModel, ClientInstance } from "./client";

type MeasurementProperties = {
    date: number,
    uid: string,
    type: string,
    value: number
}

type MeasurementRelatedNode = {
    Client: ModelRelatedNodesI<
        typeof ClientModel,
        ClientInstance
    >
}

export type MeasurementInstance = NeogmaInstance<MeasurementProperties, MeasurementRelatedNode>;

export const MeasurementModel: NeogmaModel<MeasurementProperties, MeasurementRelatedNode> = ModelFactory<MeasurementProperties, MeasurementRelatedNode>(
    {
        label: 'Measurement',
        schema: {
            date: {
                type: 'number',
                required: true
            },
            uid: {
                type: 'string',
                required: true
            },
            type: {
                type: 'string',
                required: true
            },
            value: {
                type: 'number',
                required: true
            }
        },
        relationships: {
            Client: {
                model: ClientModel,
                direction: 'in',
                name: '',
            }
        }
    },
    database().neogma
)