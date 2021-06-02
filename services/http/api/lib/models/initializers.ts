import { ModelFactory, Neogma } from "neogma";
import {
    user,
    measurement,
    resource,
    identity,
    date
} from '../models';

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

export function initMeasurementModel(db: Neogma, dateModel: date.DateModel): measurement.MeasurementModel {
    return ModelFactory<measurement.MeasurementProperties, measurement.MeasurementRelatedNode>(
        {
            label: 'Measurement',
            schema: {
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
                Date: {
                    model: dateModel,
                    direction: 'out',
                    name: 'Recorded At',
                    properties: {
                        time: {
                            property: 'time',
                            schema: {
                                type: 'number'
                            }
                        }
                    }
                }
            },
            primaryKeyField: 'type'
        },
        db
    );
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
                Measurement: {
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
            // relationshipCreationKeys: {}
        },
        db
);
}


export type allModels = {
    date: date.DateModel,
    identity: identity.IdentityModel,
    measurement: measurement.MeasurementModel,
    resource: resource.ResourceModel,
    user: user.UserModel,
}
export function initAllModels(db: Neogma): allModels {
    const date = initDateModel(db);
    
    const resource = initResourceModel(db);
    const measurement = initMeasurementModel(db, date);
    const identity = initIdentityModel(db, resource);
    const user = initUserModel(db, measurement, resource);
    date.addRelationships({
        Measurement: {
            model: measurement,
            direction: 'out',
            name: 'Includes',
        }
    });
    measurement.addRelationships({
        User: {
            model: user,
            direction: 'in',
            name: 'Recorded By',
        }
    });
    return {
        date,
        resource,
        measurement, 
        identity,
        user
    }
}