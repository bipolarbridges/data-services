import { allModels } from '../lib/models';
import { Session } from 'neo4j-driver';
import dotenv from 'dotenv';
import FixtureLoader from '../lib/fixtures/FixtureLoader';
dotenv.config();

new FixtureLoader().load(async (session: Session, models: allModels) => {

	await models.source.createOne({
		name: 'firebase'
	}, { session });

	await models.auth.roles.dataExporterRole.createOne({
		name: 'firebase-exporter',
		Source: {
			propertiesMergeConfig: {
				nodes: true,
				relationship: true,
			},
			properties: [{
				name: 'firebase',
			}]

		}
	}, { merge: true, session });

	await models.auth.roles.clientCreatorRole.createOne({
		name: 'firebase-client-creator',
	}, { session });

	await models.auth.apiKey.createOne({
		name: 'firebase-export-key',
		// hash of 'apikey1'
		hash: "d4f79b313f8106f5af108ad96ff516222dbfd5a0ab52f4308e4b1ad1d740de60",
		ClientCreatorRole: {
			propertiesMergeConfig: {
				nodes: true,
				relationship: true,
			},
			properties: [{
				name: 'firebase-client-creator',	
			}]
		},
		DataExporterRole: {
			propertiesMergeConfig: {
				nodes: true,
				relationship: true,
			},
			properties: [{
				name: 'firebase-exporter'
			}]
		}
	}, { merge: true, session });

	await models.auth.apiKey.createOne({
		name: 'other-export-key',
		// hash of 'apikey2'
		hash: "15fac8fa1c99022568b008b9df07b04b45354ac5ca4740041d904cd3cf2b39e3",
		DataExporterRole: {
			propertiesMergeConfig: {
				nodes: true,
				relationship: true,
			},
			properties: [{
				name: 'firebase-exporter'
			}]
		}
	}, { merge: true, session });

	const id = 'client0@email.com';
	await models.user.createOne({
		uid: id,
	}, { session });

	const readerId = `read:Client:${id}`;
	await models.auth.roles.clientReaderRole.createOne({
		name: readerId,
		User: {
			propertiesMergeConfig: {
				nodes: true,
				relationship: true,
			},
			properties: [{
				uid: id
			}]
		}
	}, { merge: true, session });

	const uid = id; // system id, may be different from client id
	await models.auth.userIdentity.createOne({
		uid,
		ClientReaderRole: {
			propertiesMergeConfig: {
				nodes: true,
				relationship: true,
			},
			properties: [{
					name: readerId
			}]
		}
	}, { merge: true, session });
})
.then(() => {
	process.exit(0);
})
.catch((err) => {
	console.log(err);
	process.exit(1);
});
