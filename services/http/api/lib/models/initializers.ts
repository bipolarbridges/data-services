import { ModelFactory, Neogma } from 'neogma';
import {
  user,
  measurement,
  resource,
  identity,
} from '.';

export function initIdentityModel(db: Neogma, resourceModel: resource.ResourceModel)
  : identity.IdentityModel {
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

export function initMeasurementModel(db: Neogma, userModel: user.UserModel)
  : measurement.MeasurementModel {
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
        User: {
          model: userModel,
          direction: 'in',
          name: 'Recorded',
        },
      },
      primaryKeyField: 'value',
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
    },
    db,
  );
}

export function initUserModel(db: Neogma,
  // measurementModel: measurement.MeasurementModel,
  resourceModel: resource.ResourceModel)
  : user.UserModel {
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
        /* Measurement: {
          model: measurementModel,
          direction: 'out',
          name: 'Recorded',
        }, */
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
      // relationshipCreationKeys: {}
    },
    db,
  );
}

export type AllModels = {
  identity: identity.IdentityModel,
  measurement: measurement.MeasurementModel,
  resource: resource.ResourceModel,
  user: user.UserModel,
};

export function initAllModels(db: Neogma): AllModels {
  const resourceModel = initResourceModel(db);
  const userModel = initUserModel(db, resourceModel);
  const identityModel = initIdentityModel(db, resourceModel);
  const measurementModel = initMeasurementModel(db, userModel);

  return {
    resource: resourceModel,
    measurement: measurementModel,
    identity: identityModel,
    user: userModel,
  };
}
