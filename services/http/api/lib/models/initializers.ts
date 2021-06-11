import { ModelFactory, Neogma } from "neogma";
import {
    user,
    measurement,
    resource,
    identity,
    date,
    source,
    hour
} from '../models';


export function initIdentityModel(db: Neogma, resourceModel: resource.ResourceModel): identity.IdentityModel {
    return ModelFactory<identity.IdentityProperties, identity.IdentityRelatedNode>(
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
                    model: resourceModel,
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
            },
            primaryKeyField: 'name'
        },
        db
    )
}

export function initResourceModel(db: Neogma): resource.ResourceModel {
    return ModelFactory<resource.ResourceProperties, resource.ResourceRelatedNode>(
        {
            label: 'Resource',
            schema: {
                path: {
                    type: 'string',
                    required: true
                }
            },
            primaryKeyField: 'path'
        },
        db
    )
}

export function initDateModel(db: Neogma): date.DateModel {
    return ModelFactory<date.DateProperties, date.DateRelatedNode>(
        {
            label: 'Date',
            primaryKeyField: 'id',
            schema: {
                id: {
                    type: 'string',
                    required: true
                },
                day: {
                    type: 'number',
                    required: true
                },
                month: {
                    type: 'number',
                    required: true
                },
                year: {
                    type: 'number',
                    required: true
                },
            },
        },
        db
    )
}

export function initHourModel(db: Neogma): hour.HourModel {
    return ModelFactory<hour.HourProperties, hour.HourRelatedNodeI>(
        {
            label: 'Hour',
            primaryKeyField: 'time',
            schema: {
                time: {
                    type: "number",
                    required: true
                }
            }
        },
        db
    )
}

export function initMeasurementModel(db: Neogma, dateModel: date.DateModel, hourModel: hour.HourModel): measurement.MeasurementModel {
    return ModelFactory<measurement.MeasurementProperties, measurement.MeasurementRelatedNodeI>(
        {
            label: 'Measurement',
            schema: {
                value : {
                    type: 'number',
                    required: true
                },
            },
            relationships: {
                Date: {
                    model: dateModel,
                    direction: 'out',
                    name: 'RecordedOn',
                },
                Hour: {
                    model: hourModel,
                    direction: 'out',
                    name: 'RecordedAt'
                }
            }
        },
        db
    )
}

export function initMeasurementTypeModel(db: Neogma, valueModel: measurement.MeasurementModel): measurement.MeasurementTypeModel {
    return ModelFactory<measurement.MeasurementTypeProperties, measurement.MeasurementTypeRelatedNodesI>(
        {
            label: 'MeasurementType',
            schema: {
                name: {
                    type: 'string',
                    required: true
                },
            },
            relationships: {
                Measurement: {
                    model: valueModel,
                    direction: 'out',
                    name: 'Includes',
                }
            },
            primaryKeyField: 'name'
        },
        db
    );
}



export function initUserModel(db: Neogma, measurementModel: measurement.MeasurementModel, resourceModel: resource.ResourceModel): user.UserModel {
    return ModelFactory<user.UserProperties, user.UserRelatedNode>(
        {
            label: 'User',
            schema: {
                uid: {
                    type: 'string',
                    required: true,
                },
            },
            relationships: {
                MeasurementType: {
                    model: measurementModel,
                    direction: 'out',
                    name: 'Recorded',
                },
                Resource: {
                    model: resourceModel,
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
            },
            primaryKeyField: 'uid',
        },
        db
);
}

export function initSourceModel(db: Neogma, MeasurementTypeModel: measurement.MeasurementTypeModel): source.SourceModel {
    return ModelFactory<source.SourceProperties, source.SourceRelatedNodeI>(
        {
            label: 'Source',
            schema: {
                name: {
                    type: 'string',
                    required: true
                },
            },
            relationships: {
                MeasurementType: {
                    model: MeasurementTypeModel,
                    direction: 'out',
                    name: 'Includes',
                }
            },
            primaryKeyField: 'name'
        },
        db);
}

export type allModels = {
    date: date.DateModel,
    identity: identity.IdentityModel,
    measurementType: measurement.MeasurementTypeModel,
    resource: resource.ResourceModel,
    user: user.UserModel,
    source: source.SourceModel,
    hour: hour.HourModel
    measurementValue: measurement.MeasurementModel
}

export function initAllModels(db: Neogma): allModels {
    const resource = initResourceModel(db);
    const identity = initIdentityModel(db, resource);
    
    const date = initDateModel(db);
    const hour = initHourModel(db);
    

    const measurementValue = initMeasurementModel(db, date, hour);
    const measurementType = initMeasurementTypeModel(db, measurementValue);
    const source = initSourceModel(db, measurementType);
    const user = initUserModel(db, measurementValue, resource);
    
    measurementType.addRelationships(
        {
            Source: {
                model: source,
                direction: 'in',
                name: 'Includes',
            }
        });
    measurementValue.addRelationships(
        {
            User: {
                model: user,
                direction: 'in',
                name: 'Recorded',
            }
        });

    return {
        date,
        source,
        resource,
        measurementType, 
        identity,
        user,
        measurementValue,
        hour
    }
}