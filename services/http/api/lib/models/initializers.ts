import { ModelFactory, Neogma } from "neogma";
import {
    user,
    measurement,
    source,
    time,
	auth,
    allModels
} from '../models';

export function initUserIdentityModel(db: Neogma,
		clientReaderRoleModel: auth.roles.clientReaderRole.ClientReaderRoleModel)
:auth.userIdentity.UserIdentityModel {
		return ModelFactory<auth.userIdentity.UserIdentityProperties, auth.userIdentity.UserIdentityRelatedNodes>({
				label: 'UserIdentity',
				schema: {
					uid: {
						type: 'string',
						required: true
					}
				},
				primaryKeyField: 'uid',
				relationships: {
					ClientReaderRole: {
						model: clientReaderRoleModel,
						direction: 'out',
						name: 'Has'
					},
				}
		}, db);
}

export function initApiKeyModel(db: Neogma,
		dataExporterRoleModel: auth.roles.dataExporterRole.DataExporterRoleModel,
		clientCreatorRoleModel: auth.roles.clientReaderRole.ClientReaderRoleModel)
:auth.apiKey.ApiKeyModel {
	return ModelFactory<auth.apiKey.ApiKeyProperties, auth.apiKey.ApiKeyRelatedNodes>({
		label: 'ApiKey',
		schema: {
			name: {
				type: 'string',
				required: true
			},
			hash: {
				type: 'string',
				required: true
			}
		},
		primaryKeyField: 'name',
		relationships: {
			DataExporterRole: {
				model: dataExporterRoleModel,
				direction: 'out',
				name: 'Has'
			},
			ClientCreatorRole: {
				model: clientCreatorRoleModel,
				direction: 'out',
				name: 'Has'
			}
		}
	}, db);
}

export function initClientCreatorRoleModel(db: Neogma,
		userModel: user.UserModel)
: auth.roles.clientCreatorRole.ClientCreatorRoleModel {
	return ModelFactory<auth.roles.clientCreatorRole.ClientCreatorRoleProperties,
				auth.roles.clientCreatorRole.ClientCreatorRoleRelatedNodes>({
			label: 'ClientCreatorRole',
			schema: {
				name: {
					type: 'string',
					required: true,
				}
			},
			primaryKeyField: 'name',
			relationships: {
				User: {
					model: userModel,
					direction: 'out',
					name: 'Created'
				}
			}
	}, db);
}

export function initClientReaderRoleModel(db: Neogma,
		userModel: user.UserModel)
: auth.roles.clientReaderRole.ClientReaderRoleModel {
	return ModelFactory<auth.roles.clientReaderRole.ClientReaderRoleProperties,
				auth.roles.clientReaderRole.ClientReaderRoleRelatedNodes>({
			label: 'ClientReaderRole',
			schema: {
				name: {
					type: 'string',
					required: true,
				}
			},
			primaryKeyField: 'name',
			relationships: {
				User: {
					model: userModel,
					direction: 'out',
					name: 'For'
				}
			}
	}, db);
}

export function initDataExportRoleModel(db: Neogma,
		sourceModel: source.SourceModel): auth.roles.dataExporterRole.DataExporterRoleModel {
	return ModelFactory<auth.roles.dataExporterRole.DataExporterRoleProperties,
				auth.roles.dataExporterRole.DataExporterRoleRelatedNodes>({
		label: 'DataExporterRole',
		schema: {
			name: {
				type: 'string',
				required: true,
			}
		},
		primaryKeyField: 'name',
		relationships: {
			Source: {
				model: sourceModel,
				direction: 'out',
				name: 'For'
			}
		}
	}, db);
}

export function initHourModel(db: Neogma): time.HourModel {
    return ModelFactory<time.HourProperties, time.HourRelatedNodes>(
        {
            label: 'Hour',
            primaryKeyField: 'hour',
            schema: {
                hour: {
                    type: "number",
                    required: true
                }
            }
        },
        db
    )
}

export function initTimestampModel(db: Neogma): time.TimestampModel {
    return ModelFactory<time.TimestampProperties, time.TimestampRelatedNodes>(
        {
            label: 'Timestamp',
            primaryKeyField: 'time',
            schema: {
                time: {
                    type: "number",
                    required: true
                }
            }
        },
        db
    )
}

export function initDayModel(db: Neogma): time.DayModel {
    return ModelFactory<time.DayProperties, time.DayRelatedNodes>(
        {
            label: 'Day',
            primaryKeyField: 'day',
            schema: {
                day: {
                    type: "number",
                    required: true
                }
            }
        },
        db
    )
}

export function initMonthModel(db: Neogma, dayModel: time.DayModel): time.MonthModel {
    return ModelFactory<time.MonthProperties, time.MonthRelatedNodes>(
        {
            label: 'Month',
            primaryKeyField: 'month',
            schema: {
                month: {
                    type: "number",
                    required: true
                }
            },
            relationships: {
                Day: {
                    model: dayModel,
                    direction: 'out',
                    name: 'Includes'
                }
            }
        },
        db
    )
}

export function initYearModel(db: Neogma): time.YearModel {
    return ModelFactory<time.YearProperties, time.YearRelatedNodes>(
        {
            label: 'Year',
            primaryKeyField: 'year',
            schema: {
                year: {
                    type: "number",
                    required: true
                }
            }
        },
        db
    )
}

export function initMeasurementModel(db: Neogma,
    hourModel: time.HourModel, dayModel: time.DayModel, monthModel: time.MonthModel,
    yearModel: time.YearModel, timestampModel: time.TimestampModel): measurement.MeasurementModel {
    return ModelFactory<measurement.MeasurementProperties, measurement.MeasurementRelatedNodes>(
        {
            label: 'Measurement',
            schema: {
                value: {
                    type: 'number',
                    required: true
                },
            },
            relationships: {
                Hour: {
                    model: hourModel,
                    direction: 'out',
                    name: 'RecordedAt'
                },
                Day: {
                    model: dayModel,
                    direction: 'out',
                    name: 'RecordedOn',
                },
                Month: {
                    model: monthModel,
                    direction: 'out',
                    name: 'RecordedOn'
                },
                Year: {
                    model: yearModel,
                    direction: 'out',
                   name: 'RecordedOn',
                },
                Timestamp: {
                    model: timestampModel,
                    direction: 'out',
                    name: 'RecordedAt'
                }
            }
        },
        db
    )
}

export function initMeasurementTypeModel(db: Neogma, valueModel: measurement.MeasurementModel): measurement.MeasurementTypeModel {
    return ModelFactory<measurement.MeasurementTypeProperties, measurement.MeasurementTypeRelatedNodesI>(
        {
            label: 'MeasurementType',
            schema: {
                name: {
                    type: 'string',
                    required: true
                },
            },
            relationships: {
                Measurement: {
                    model: valueModel,
                    direction: 'out',
                    name: 'Includes',
                }
            },
            primaryKeyField: 'name'
        },
        db
    );
}

export function initUserModel(db: Neogma, measurementModel: measurement.MeasurementModel): user.UserModel {
    return ModelFactory<user.UserProperties, user.UserRelatedNodes>(
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
            },
            primaryKeyField: 'uid',
        },
        db
    );
}

export function initSourceModel(db: Neogma, MeasurementTypeModel: measurement.MeasurementTypeModel): source.SourceModel {
    return ModelFactory<source.SourceProperties, source.SourceRelatedNodes>(
        {
            label: 'Source',
            schema: {
                name: {
                    type: 'string',
                    required: true
                },
            },
            relationships: {
                MeasurementType: {
                    model: MeasurementTypeModel,
                    direction: 'out',
                    name: 'Includes',
                }
            },
            primaryKeyField: 'name'
        },
        db);
}

export function initAllModels(db: Neogma): allModels {

    // const date = initDateModel(db);
    const hour = initHourModel(db);
    const day = initDayModel(db);
    const month = initMonthModel(db, day);
    const year = initYearModel(db);
    const timestamp = initTimestampModel(db);

    const measurement = initMeasurementModel(db, hour, day, month, year, timestamp);
    const measurementType = initMeasurementTypeModel(db, measurement);
    const source = initSourceModel(db, measurementType);
    const user = initUserModel(db, measurement);

	const roles: auth.roles.allRolesModels = {
		clientReaderRole: initClientReaderRoleModel(db, user),
		clientCreatorRole: initClientCreatorRoleModel(db, user),
		dataExporterRole: initDataExportRoleModel(db, source),	
	}

	const auth: auth.allAuthModels = {
		apiKey: initApiKeyModel(db, roles.dataExporterRole, roles.clientCreatorRole),
		userIdentity: initUserIdentityModel(db, roles.clientReaderRole),
		roles,
	}

    measurementType.addRelationships(
        {
            Source: {
                model: source,
                direction: 'in',
                name: 'Includes',
            }
        }
    );

    measurement.addRelationships(
        {
            User: {
                model: user,
                direction: 'in',
                name: 'Recorded',
            }
        }
    );
    
    measurement.addRelationships(
        {
            MeasurementType: {
                model: measurementType,
                direction: 'in',
                name: 'Includes',
            }
        }
    );

    return {
        source,
        measurementType,
        user,
        measurement,
        hour,
        day,
        month,
        year,
        timestamp,
		auth
    }
}
