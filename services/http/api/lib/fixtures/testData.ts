import { Database, database } from '../db';
import { allModels, resource } from '../models';
import api from '../interface';
import { error, info } from '../logging';
import { Session } from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    const db: Database = database();
    info('Clearing out old data...');
    await db.run('MATCH (n) DETACH DELETE n;');
    info('Done clearing data.');
    info('Beginning to load test data...');
    try {
        await Promise.all([
            (await createClient(db)), 
            (await createIdentity(db))
        ]);
        
    } catch (err) {
        error(err);
        process.exit(1);
    }
    info('Loaded test data.');
    process.exit(0);
}

type resource = {
    path: string,
    method: string
}

function createIdentity(db: Database) {
    const paths: resource[]= [{ path: '/client', method: 'POST' }, {path: '/measurement', method: 'POST'}];

    const creator = async (session: Session, models: allModels): Promise<boolean> => {
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
            throw new Error(err);
        }
    }

    try {
        return db.exec(creator);
    } catch (err) {
        throw new Error(err);
    }
}

async function createClient(db: Database) {
    try {
        await db.exec(api.createUser('client0@email.com'));
    } catch (err) {
        throw new Error(err);
    }
}

main();