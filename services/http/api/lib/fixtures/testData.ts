import { Database, database } from 'lib/db';
import { allModels, resource } from 'lib/models';
import api from '../interface';
import { error, info } from '../logging';
import { Session } from 'neo4j-driver';

async function main() {
    const db: Database = database();
    info('Beginning to load test data...');
    await db.exec(api.createUser('client0@email.com'));
    await db.exec(createIdentity([{ path: '/client', method: 'POST' }, {path: '/measurement', method: 'POST'}]));
    info('Loaded test data.');
}

type resource = {
    path: string,
    method: string
}

function createIdentity(paths: resource[]) {
    return async (session: Session, models: allModels): Promise<boolean> => {
        try {
            await models.identity.createOne(
                {
                    type: "key",
                    name: "test_export_key",
                    check: "d4f79b313f8106f5af108ad96ff516222dbfd5a0ab52f4308e4b1ad1d740de60",
                    Resource: {
                        propertiesMergeConfig: {
                            nodes: true,
                            relationship: true,
                        },
                        properties: paths,
                    }
                },
                { session }
            )
            return true;
        } catch (err) {
            error(err);
            return false;
        }
    }
}


main();