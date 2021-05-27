import { database } from "db/*";
import { ModelFactory, ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementModel, MeasurementInstance } from "./measurement";

type ClientProperties = {
    id: string,
    name?: string
}

type ClientRelatedNode = {
    Measurement: ModelRelatedNodesI<
        typeof MeasurementModel,
        MeasurementInstance
    >
}

interface MethodsI {
    clientId: (this: ClientInstance) => string
}

export type ClientInstance = NeogmaInstance<ClientProperties, ClientRelatedNode, MethodsI>;

export const ClientModel: NeogmaModel<ClientProperties, ClientRelatedNode, undefined, MethodsI> = ModelFactory<ClientProperties, ClientRelatedNode, undefined, MethodsI>(
        {
            label: 'Client',
            schema: {
                id: {
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
                }
            },
            primaryKeyField: 'id',
            methods: {
                clientId(this: ClientInstance) {
                    return this.id;
                }
            }
        },
        database().neogma
)
