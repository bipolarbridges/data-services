import { ModelFactory, Neogma } from "neogma";
import {
    appUser,
    measurement,
    source,
    time,
	auth,
    allModels
} from '../models';

export function initServiceUserModel(db: Neogma,
		appUserReaderRoleModel: auth.roles.appUserReaderRole.AppUserReaderRoleModel)
:auth.serviceUser.ServiceUserModel {
		return ModelFactory<auth.serviceUser.ServiceUserProperties, auth.serviceUser.ServiceUserRelatedNodes>({
				label: 'ServiceUser',
				schema: {
					uid: {
						type: 'string',
						required: true
					}
				},
				primaryKeyField: 'uid',
				relationships: {
					AppUserReaderRole: {
						model: appUserReaderRoleModel,
						direction: 'out',
						name: 'Has'
					},
				}
		}, db);
}

export function initApiKeyModel(db: Neogma,
		dataExporterRoleModel: auth.roles.dataExporterRole.DataExporterRoleModel,
		appUserCreatorRoleModel: auth.roles.appUserReaderRole.AppUserReaderRoleModel)
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
			AppUserCreatorRole: {
				model: appUserCreatorRoleModel,
				direction: 'out',
				name: 'Has'
			}
		}
	}, db);
}

export function initAppUserCreatorRoleModel(db: Neogma,
		appUserModel: appUser.AppUserModel)
: auth.roles.appUserCreatorRole.AppUserCreatorRoleModel {
	return ModelFactory<auth.roles.appUserCreatorRole.AppUserCreatorRoleProperties,
				auth.roles.appUserCreatorRole.AppUserCreatorRoleRelatedNodes>({
			label: 'AppUserCreatorRole',
			schema: {
				name: {
					type: 'string',
					required: true,
				}
			},
			primaryKeyField: 'name',
			relationships: {
				AppUser: {
					model: appUserModel,
					direction: 'out',
					name: 'Created'
				}
			}
	}, db);
}

export function initAppUserReaderRoleModel(db: Neogma,
		appUserModel: appUser.AppUserModel)
: auth.roles.appUserReaderRole.AppUserReaderRoleModel {
	return ModelFactory<auth.roles.appUserReaderRole.AppUserReaderRoleProperties,
				auth.roles.appUserReaderRole.AppUserReaderRoleRelatedNodes>({
			label: 'AppUserReaderRole',
			schema: {
				name: {
					type: 'string',
					required: true,
				}
			},
			primaryKeyField: 'name',
			relationships: {
				AppUser: {
					model: appUserModel,
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

export function initAppUserModel(db: Neogma, measurementModel: measurement.MeasurementModel): appUser.AppUserModel {
    return ModelFactory<appUser.AppUserProperties, appUser.AppUserRelatedNodes>(
        {
            label: 'AppUser',
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
    const appUser = initAppUserModel(db, measurement);

	const roles: auth.roles.allRolesModels = {
		appUserReaderRole: initAppUserReaderRoleModel(db, appUser),
		appUserCreatorRole: initAppUserCreatorRoleModel(db, appUser),
		dataExporterRole: initDataExportRoleModel(db, source),	
	}

	const auth: auth.allAuthModels = {
		apiKey: initApiKeyModel(db, roles.dataExporterRole, roles.appUserCreatorRole),
		serviceUser: initServiceUserModel(db, roles.appUserReaderRole),
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
            AppUser: {
                model: appUser,
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
        appUser,
        measurement,
        hour,
        day,
        month,
        year,
        timestamp,
		auth
    }
}
