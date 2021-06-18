import * as loggers from '../logging';
import { Session } from 'neo4j-driver';
import { allModels } from 'lib/models';


function userExists(id: string) {
    return async (session: Session, models: allModels): Promise<boolean> => {
        try {
            const user = await models.user.findOne({
                where: {
                    uid: id,
                },
                session,
            });
            const exist = user ? user?.__existsInDatabase : false;
            loggers.info(`User exists: ${exist}`);
            return exist;
        } catch (err) {
            loggers.error(err);
            return false;
        }
    }
}

function createUser(id: string) {
    return async (session: Session, models: allModels): Promise<null> => {
        try {
            await models.user.createOne(
                {
                    uid: id,
                    Resource: {
                        propertiesMergeConfig: {
                            nodes: true,
                            relationship: true,
                        },
                        properties: [
                            {
                                path: `/client/${id}`,
                                method: 'GET'
                            },
                        ],
                    },                
                },
                {merge: true, session}
            ); 
            
            return null;
        } catch (err) {
            loggers.error(err);
            return null;
        }


    }
}

// named with format VerbModelArgs
export type CreateMeasurementArgs = {
    uid: string,
    value: number,
    name: string,
    source: string,
    date: number,
}

function createMeasurement(m: CreateMeasurementArgs) {
    return async (session: Session, models: allModels): Promise<boolean> => {
        
        try {
            const { year, month, day, hour, time } = transformDate(m.date);
            const { uid, source, value, name } = m;

            const User = {
                propertiesMergeConfig: {
                    nodes: true,
                    relationship: true,
                    
                },
                properties: [{
                    uid: uid,
                }]
            };

            const Measurement = {
                propertiesMergeConfig: {
                    nodes: false,
                    relationship: false,
                },
                properties: [
                    {
                        value: value,
                        // Date: Date,
                        Hour: {
                            propertiesMergeConfig: {
                                nodes: true,
                                relationship: true,
                            },
                            properties: [
                                { hour }
                            ],
                        },
                        Day: {
                            propertiesMergeConfig: {
                                nodes: true,
                                relationship: true,
                            },
                            properties: [
                                { day }
                            ],
                        },
                        Month: {
                            propertiesMergeConfig: {
                                nodes: true,
                                relationship: true,
                            },
                            properties: [
                                { 
                                    month,
                                    Day: {
                                        propertiesMergeConfig: {
                                            nodes: true,
                                            relationship: false,
                                        },
                                        properties: [
                                            { day }
                                        ],
                                    }
                                }
                            ],
                        },
                        Year: {
                            propertiesMergeConfig: {
                                nodes: true,
                                relationship: true,
                            },
                            properties: [
                                { year }
                            ],
                        },
                        Timestamp: {
                            propertiesMergeConfig: {
                                nodes: true,
                                relationship: false,
                            },
                            properties: [
                                { time }
                            ],
                        },
                        User: User,
                    }
                ]
            };

            const Source = {
                propertiesMergeConfig: {
                    nodes: true,
                    relationship: true,
                    
                },
                properties: [
                    {
                        name: source
                    }
                ]
            };

            await models.measurementType.createOne(
                {
                    name,
                    Measurement: Measurement,
                    Source: Source,             
                },
                { session, merge: true }
            );
            return true;        
            
        } catch (err) {
            loggers.error(err);
            loggers.error(err?.data?.errors)
            return false;
        }
    }
}

// Takes in a second number input, converts it to milliseconds 
// and returns
// - the year 
// - the month (0-11)
// - the day of the month (1-31)
// - the time in milliseconds
function transformDate(input: number) {
    const date = new Date(input * 1000);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const time = date.getTime();
    const hour = date.getHours(); // 3600 * date.getHours() + 60 * date.getMinutes() + date.getSeconds();

    return {
        year,
        month,
        day, 
        hour,
        time
    }
}

export default {
    userExists,
    createUser,
    createMeasurement,    
}