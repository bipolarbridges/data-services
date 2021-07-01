import { ModelFactory, Neogma } from 'neogma';
import {
  user,
  measurement,
  resource,
  identity,
  source,
  time,
  AllModels,
} from '.';

import {
  MeasurementModel, MeasurementTypeModel, MeasurementTypeProperties, MeasurementTypeRelatedNodesI,
} from './measurement';

export function initIdentityModel(db: Neogma,
  resourceModel: resource.ResourceModel): identity.IdentityModel {
  return ModelFactory<identity.IdentityProperties, identity.IdentityRelatedNodes>(
    {
      label: 'Identity',
      schema: {
        type: {
          type: 'string',
          required: true,
        },
        name: {
          type: 'string',
          required: true,
        },
        check: {
          type: 'string',
          required: true,
        },
      },
      relationships: {
        Resource: {
          model: resourceModel,
          direction: 'out',
          name: 'Can',
          properties: {
            method: {
              property: 'method',
              schema: {
                type: 'string',
              },
            },
          },

        },
      },
      primaryKeyField: 'name',
    },
    db,
  );
}

export function initResourceModel(db: Neogma): resource.ResourceModel {
  return ModelFactory<resource.ResourceProperties, resource.ResourceRelatedNodes>(
    {
      label: 'Resource',
      schema: {
        path: {
          type: 'string',
          required: true,
        },
      },
      primaryKeyField: 'path',
    },
    db,
  );
}

export function initHourModel(db: Neogma): time.HourModel {
  return ModelFactory<time.HourProperties, time.HourRelatedNodes>(
    {
      label: 'Hour',
      primaryKeyField: 'hour',
      schema: {
        hour: {
          type: 'number',
          required: true,
        },
      },
    },
    db,
  );
}

export function initTimestampModel(db: Neogma): time.TimestampModel {
  return ModelFactory<time.TimestampProperties, time.TimestampRelatedNodes>(
    {
      label: 'Timestamp',
      primaryKeyField: 'time',
      schema: {
        time: {
          type: 'number',
          required: true,
        },
      },
    },
    db,
  );
}

export function initDayModel(db: Neogma): time.DayModel {
  return ModelFactory<time.DayProperties, time.DayRelatedNodes>(
    {
      label: 'Day',
      primaryKeyField: 'day',
      schema: {
        day: {
          type: 'number',
          required: true,
        },
      },
    },
    db,
  );
}

export function initMonthModel(db: Neogma, dayModel: time.DayModel): time.MonthModel {
  return ModelFactory<time.MonthProperties, time.MonthRelatedNodes>(
    {
      label: 'Month',
      primaryKeyField: 'month',
      schema: {
        month: {
          type: 'number',
          required: true,
        },
      },
      relationships: {
        Day: {
          model: dayModel,
          direction: 'out',
          name: 'Includes',
        },
      },
    },
    db,
  );
}

export function initYearModel(db: Neogma): time.YearModel {
  return ModelFactory<time.YearProperties, time.YearRelatedNodes>(
    {
      label: 'Year',
      primaryKeyField: 'year',
      schema: {
        year: {
          type: 'number',
          required: true,
        },
      },
    },
    db,
  );
}

export function initMeasurementModel(db: Neogma,
  hourModel: time.HourModel, dayModel: time.DayModel, monthModel: time.MonthModel,
  yearModel: time.YearModel, timestampModel: time.TimestampModel,
  userModel: user.UserModel): MeasurementModel {
  return ModelFactory<measurement.MeasurementProperties, measurement.MeasurementRelatedNodes>(
    {
      label: 'Measurement',
      schema: {
        value: {
          type: 'number',
          required: true,
        },
      },
      relationships: {
        Hour: {
          model: hourModel,
          direction: 'out',
          name: 'RecordedAt',
        },
        Day: {
          model: dayModel,
          direction: 'out',
          name: 'RecordedOn',
        },
        Month: {
          model: monthModel,
          direction: 'out',
          name: 'RecordedOn',
        },
        Year: {
          model: yearModel,
          direction: 'out',
          name: 'RecordedOn',
        },
        Timestamp: {
          model: timestampModel,
          direction: 'out',
          name: 'RecordedAt',
        },
        User: {
          model: userModel,
          direction: 'in',
          name: 'Recorded',
        },
      },
    },
    db,
  );
}

export function initMeasurementTypeModel(db: Neogma,
  valueModel: MeasurementModel, sourceModel: source.SourceModel): MeasurementTypeModel {
  return ModelFactory<MeasurementTypeProperties, MeasurementTypeRelatedNodesI>(
    {
      label: 'MeasurementType',
      schema: {
        name: {
          type: 'string',
          required: true,
        },
      },
      relationships: {
        Measurement: {
          model: valueModel,
          direction: 'out',
          name: 'Includes',
        },
        Source: {
          model: sourceModel,
          direction: 'in',
          name: 'Includes',
        },
      },
      primaryKeyField: 'name',
    },
    db,
  );
}

export function initUserModel(db: Neogma,
  resourceModel: resource.ResourceModel): user.UserModel {
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
        Resource: {
          model: resourceModel,
          direction: 'out',
          name: 'Can',
          properties: {
            method: {
              property: 'method',
              schema: {
                type: 'string',
              },
            },
          },
        },
      },
      primaryKeyField: 'uid',
    },
    db,
  );
}

export function initSourceModel(db: Neogma): source.SourceModel {
  return ModelFactory<source.SourceProperties, source.SourceRelatedNodes>(
    {
      label: 'Source',
      schema: {
        name: {
          type: 'string',
          required: true,
        },
      },
      /* relationships: {
        MeasurementType: {
          model: measurementTypeModel,
          direction: 'out',
          name: 'Includes',
        },
      }, */
      primaryKeyField: 'name',
    },
    db,
  );
}

export function initAllModels(db: Neogma): AllModels {
  const resourceModel = initResourceModel(db);
  const identityModel = initIdentityModel(db, resourceModel);
  const userModel = initUserModel(db, resourceModel);

  const hourModel = initHourModel(db);
  const dayModel = initDayModel(db);
  const monthModel = initMonthModel(db, dayModel);
  const yearModel = initYearModel(db);
  const timestampModel = initTimestampModel(db);
  const sourceModel = initSourceModel(db);

  const measurementModel = initMeasurementModel(db,
    hourModel,
    dayModel,
    monthModel,
    yearModel,
    timestampModel,
    userModel);
  const measurementTypeModel = initMeasurementTypeModel(db, measurementModel, sourceModel);

  measurementModel.addRelationships(
    {
      MeasurementType: {
        model: measurementTypeModel,
        direction: 'in',
        name: 'Includes',
      },
    },
  );

  return {
    source: sourceModel,
    resource: resourceModel,
    measurementType: measurementTypeModel,
    identity: identityModel,
    user: userModel,
    measurement: measurementModel,
    hour: hourModel,
    day: dayModel,
    month: monthModel,
    year: yearModel,
    timestamp: timestampModel,
  };
}
