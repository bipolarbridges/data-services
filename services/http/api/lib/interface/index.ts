import * as loggers from '../logging';
import { Session } from 'neo4j-driver-core';
import { allModels } from 'lib/models/initializers';

function userExistsX(id: string) {
    return async (session: Session, models: allModels): Promise<boolean> => {
        try {
            const user = await models.user.findOne({
                where: {
                    uid: id,
                },
                session,
            });
            const exist = user? user?.__existsInDatabase : false;
            loggers.info(`User exists: ${exist}`);
            return exist;
        } catch (err) {
            loggers.error(err);
            return false;
        }
    }
}

function createUserX(id: string) {
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
                        where: [
                            {
                                params: {
                                    path: `/client/${id}`,
                                },
                                relationshipProperties: {
                                    method: 'GET'
                                },
                            },
                        ],
                        properties: [{
                            path: `/client/${id}`,
                            method: 'GET',
                            
                        }],
                    },
                    
                },
                {session}
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
    date: number,
    uid: string,
    type: string,
    value: number
}

function createMeasurementX(m: CreateMeasurementArgs) {
    return async (session: Session, models: allModels): Promise<boolean> => {
        const date = transformDate(m.date);
        try {
            const user = await models.user.findOne({
                where: {
                    uid: m.uid,
                },
                session,
            });
            if (user?.__existsInDatabase) {
                await models.measurement.createOne(
                    {
                        type: m.type,
                        value: m.value,  
                        Date: {
                            

                            propertiesMergeConfig: {
                                nodes: true,
                                relationship: true,
                                
                            },
                            where: [
                                {
                                    params: {
                                        id: `${date.year}-${date.month}-${date.day}`,
                                    },
                                    relationshipProperties: {
                                        time: date.time
                                    },
                                },
                            ],
                            properties: [
                                {
                                    ...date,
                                    id: `${date.year}-${date.month}-${date.day}`,                                    
                                }
                            ],

                        },  
                        
                    },
                    { session, merge: true }
                );

                user.relateTo({
                    alias: 'Measurement',
                    where: {
                        type: m.type,
                        value: m.value,
                        
                    },
                    session,
                });
                return true;
            } else {
                return false;
            }          
            
        } catch (err) {
            loggers.error(err);
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
    const time = 3600 * date.getHours() + 60 * date.getMinutes() + date.getSeconds();

    return {
        year, 
        month,
        day, 
        time
    }
}

export default {
    userExistsX,
    createUserX,
    createMeasurementX,    
}