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
            relationships: {}
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
                    type: 'number',
                    required: true
                }
            }
        },
        db
    )
}

export function initMeasurementValueModel(db: Neogma, dateModel: date.DateModel, hourModel: hour.HourModel): measurement.MeasurementValueModel {
    return ModelFactory<measurement.ValueProperties, measurement.ValueRelatedNodeI>(
        {
            label: 'MeasurementValue',
            schema: {
                value : {
                    type: 'number',
                    required: true
                }
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

export function initUserMeasurementModel(db: Neogma, valueModel: measurement.MeasurementValueModel): measurement.UserMeasurementModel {
    return ModelFactory<measurement.UserMeasurementProperties, measurement.UserMeasurementRelatedNodesI>(
        {
            label: 'UserMeasurement',
            schema: {
                type: {
                    type: 'string',
                    required: true
                }
            },
            relationships: {
                MeasurementValue: {
                    model: valueModel,
                    direction: 'out',
                    name: 'Includes',
                }
            },
            primaryKeyField: 'type'
        },
        db
    );
}



export function initUserModel(db: Neogma, userMeasurementModel: measurement.UserMeasurementModel, resourceModel: resource.ResourceModel): user.UserModel {
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
                UserMeasurement: {
                    model: userMeasurementModel,
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

export function initSourceModel(db: Neogma, userMeasurementModel: measurement.UserMeasurementModel): source.SourceModel {
    return ModelFactory<source.SourceProperties, source.SourceRelatedNodeI>(
        {
            label: 'Source',
            schema: {
                type: {
                    type: 'string',
                    required: true
                },
                
            },
            relationships: {
                UserMeasurement: {
                    model: userMeasurementModel,
                    direction: 'out',
                    name: 'Includes',
                }
            },
        },
        db);
}

export type allModels = {
    date: date.DateModel,
    identity: identity.IdentityModel,
    userMeasurement: measurement.UserMeasurementModel,
    resource: resource.ResourceModel,
    user: user.UserModel,
    source: source.SourceModel,
    measurementValue: measurement.MeasurementValueModel
}

export function initAllModels(db: Neogma): allModels {
    const resource = initResourceModel(db);
    const identity = initIdentityModel(db, resource);
    
    const date = initDateModel(db);
    const hour = initHourModel(db);
    

    const measurementValue = initMeasurementValueModel(db, date, hour);
    const userMeasurement = initUserMeasurementModel(db, measurementValue);
    const source = initSourceModel(db, userMeasurement);
    const user = initUserModel(db, userMeasurement, resource);
    

    return {
        date,
        source,
        resource,
        userMeasurement, 
        identity,
        user,
        measurementValue
    }
}