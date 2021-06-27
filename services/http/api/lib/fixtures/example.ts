import { allModels } from '../models';
import { error } from '../logging';
import { Session } from 'neo4j-driver';
import dotenv from 'dotenv';
import { makeMeasurementProperties, mergedMeasurement } from '../interface';
import FixtureLoader from './FixtureLoader';
dotenv.config();

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

const appUsers = ['1', '2']
type measurementList = {
    [key: string] : mergedMeasurement[]
};

const measurements: measurementList = {
    [`${appUsers[0]}`]: [
        makeMeasurementProperties(90, 8, 13, 9, 2021, 1890237291, undefined, createMergeProperties('heartrate', 'measurement')),
        makeMeasurementProperties(0.8, 3, 1, 9, 2021, 18966712291, undefined, createMergeProperties('sentiment', 'measurement')),
    ],
    [`${appUsers[1]}`]: [
        makeMeasurementProperties(6, 12, 27, 3, 2021, 189667111111, undefined, createMergeProperties('sentiment', 'measurement')),
    ],
};

new FixtureLoader().load( async (session: Session, models: allModels) => { 
        const createdList = appUsers.map(uid => {
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
                            path: `/appUser/${uid}`,
                            method: 'GET'
                        },
                    ],
                },    
            }
        });

        await models.appUser.createMany(createdList, { session, merge: true });
    })
.then(() => {
	process.exit(0);
})
.catch((err) => {
	error(err);
	process.exit(1);
});