import {
  ModelFactory, ModelRelatedNodesI, Neogma, NeogmaInstance, NeogmaModel,
} from 'neogma';

export type DomainProperties = {
  uid: string,
  importance: string,
  name: string,
  scope: string,
};

export type DomainRelatedNodes = {
  DomainBullet: ModelRelatedNodesI<DomainBulletModel, DomainInstance>,
};

export type DomainInstance = NeogmaInstance<DomainProperties, DomainRelatedNodes>;
export type DomainModel = NeogmaModel<DomainProperties, DomainRelatedNodes>;

export function initDomainModel(db: Neogma, bulletModel: DomainBulletModel): DomainModel {
  return ModelFactory<DomainProperties, DomainRelatedNodes>(
    {
      label: 'Domain',
      schema: {
        uid: {
          type: 'string',
          required: true,
        },
        importance: {
          type: 'string',
          required: true,
        },
        name: {
          type: 'string',
          required: true,
        },
        scope: {
          type: 'string',
          required: true,
        },
      },
      relationships: {
        DomainBullet: {
          model: bulletModel,
          direction: 'out',
          name: 'Includes',
        },
      },
      primaryKeyField: 'uid',
    },
    db,
  );
}

export type DomainBulletProperties = {
  content: string,
};

export type DomainBulletRelatedNodes = unknown;

export type DomainBulletInstance = NeogmaInstance<DomainBulletProperties, DomainBulletRelatedNodes>;
export type DomainBulletModel = NeogmaModel<DomainBulletProperties, DomainBulletRelatedNodes>;

export function initDomainBulletModel(db: Neogma): DomainBulletModel {
  return ModelFactory<DomainBulletProperties, DomainBulletRelatedNodes>({
    label: 'DomainBullet',
    schema: {
      content: {
        type: 'string',
        required: true,
      },
    },
  },
  db);
}
