import { Database, database } from '../db';
import { allModels } from '../models';
import { error, info } from '../logging';
import { Session } from 'neo4j-driver';
import dotenv from 'dotenv';
import { makeMeasurementProperties, mergedMeasurement } from '../interface';
dotenv.config();

async function main() {
    const db: Database = database();
    info('Clearing out old data...');
    await db.run('MATCH (n) DETACH DELETE n;');
    info('Done clearing data.');
    info('Beginning to load example data...');
    try {
        await Promise.all([
            (await createClients(db)), 
        ]);
        
    } catch (err) {
        error(err);
        process.exit(1);
    }
    info('Loaded example data.');
    process.exit(0);
}

main();

function createMergeProperties(name: string, source: string) {
    return {
        propertiesMergeConfig: {
            nodes: true,
            relationship: true,
        },
        properties: [
            {
                name,
                Source: {
                    propertiesMergeConfig: {
                        nodes: true,
                        relationship: true,
                    },
                    properties: [
                        {
                            name: source,
                        }
                    ]
                }
            }
        ]
    };
}

async function createClients(db: Database) {
    const users = ['1', '2']
    type measurementList = {
        [key: string] : mergedMeasurement[]
    };

    const measurements: measurementList = {
        [`${users[0]}`]: [
            makeMeasurementProperties(90, 8, 13, 9, 2021, 1890237291, undefined, createMergeProperties('heartrate', 'measurement')),
            makeMeasurementProperties(0.8, 3, 1, 9, 2021, 18966712291, undefined, createMergeProperties('sentiment', 'measurement')),
        ],
        [`${users[1]}`]: [
            makeMeasurementProperties(6, 12, 27, 3, 2021, 189667111111, undefined, createMergeProperties('sentiment', 'measurement')),
        ],
    };

    const creator = async (session: Session, models: allModels): Promise<boolean> => { 
        
        const createdList = users.map(uid => {
            return {
                uid,
                Measurement: {
                    propertiesMergeConfig: {
                        nodes: true,
                        relationship: true,
                    },
                    properties: measurements[uid]
                },
                Resource: {
                    propertiesMergeConfig: {
                        nodes: true,
                        relationship: true,
                    },
                    properties: [
                        {
                            path: `/client/${uid}`,
                            method: 'GET'
                        },
                    ],
                },    
            }
        });

        try {
            await models.user.createMany(createdList, { session, merge: true });
            return true;
        } catch (err) {
            throw new Error(err);
        }
    }

    try {
        return db.exec(creator);
    } catch (err) {
        throw new Error(err);
    }
}