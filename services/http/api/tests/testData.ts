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

	await models.auth.roles.appUserCreatorRole.createOne({
		name: 'firebase-appUser-creator',
	}, { session });

	await models.auth.apiKey.createOne({
		name: 'firebase-export-key',
		// hash of 'apikey1'
		hash: "d4f79b313f8106f5af108ad96ff516222dbfd5a0ab52f4308e4b1ad1d740de60",
		AppUserCreatorRole: {
			propertiesMergeConfig: {
				nodes: true,
				relationship: true,
			},
			properties: [{
				name: 'firebase-appUser-creator',
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

	const id = 'appUser0@email.com';
	await models.appUser.createOne({
		uid: id,
	}, { session });

	const readerId = `read:AppUser:${id}`;
	await models.auth.roles.appUserReaderRole.createOne({
		name: readerId,
		AppUser: {
			propertiesMergeConfig: {
				nodes: true,
				relationship: true,
			},
			properties: [{
				uid: id
			}]
		}
	}, { merge: true, session });

	const uid = id; // system id, may be different from appUser id
	await models.auth.serviceUser.createOne({
		uid,
		AppUserReaderRole: {
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
