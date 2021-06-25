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
	}, { session });

	await models.auth.roles.clientCreatorRole.createOne({
		name: 'firebase-client-creator',
	}, { session });

	await models.auth.apiKey.createOne({
		name: 'firebase-export-key',
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
	}, { session });

	const id = 'client0@email.com';
	await models.user.createOne({
		uid: id,
	}, { session });

	await models.auth.roles.clientReaderRole.createOne({
		name: `read:Client:${id}`,
		User: {
			propertiesMergeConfig: {
				nodes: true,
				relationship: true,
			},
			properties: [{
				uid: id
			}]
		}
	});

})
.then(() => {
	process.exit(0);
})
.catch((err) => {
	console.log(err);
	process.exit(1);
});
