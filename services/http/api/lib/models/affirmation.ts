import {
  ModelFactory, ModelRelatedNodesI, Neogma, NeogmaInstance, NeogmaModel,
} from 'neogma';
import { DomainInstance, DomainModel } from './domain';
import {
  HourModel, HourInstance, DayModel, DayInstance, MonthModel, MonthInstance,
  YearModel, YearInstance, TimestampModel, TimestampInstance,
} from './time';
import { UserModel, UserInstance } from './user';

export type AffirmationProperties = {
  uid: string,
  content: string,
};

export type AffirmationRelatedNodes = {
  Domain: ModelRelatedNodesI<DomainModel, DomainInstance>,
  Keyword: ModelRelatedNodesI<KeywordModel, KeywordInstance>,
};

export type AffirmationInstance = NeogmaInstance<AffirmationProperties, AffirmationRelatedNodes>;
export type AffirmationModel = NeogmaModel<AffirmationProperties, AffirmationRelatedNodes>;

export function initAffirmationModel(db: Neogma, domainModel: DomainModel,
  keywordModel: KeywordModel): AffirmationModel {
  return ModelFactory<AffirmationProperties, AffirmationRelatedNodes>({
    label: 'Affirmation',
    schema: {
      uid: {
        type: 'string',
        required: true,
      },
      content: {
        type: 'string',
        required: true,
      },
    },
    relationships: {
      Domain: {
        model: domainModel,
        direction: 'in',
        name: 'Includes',
      },
      Keyword: {
        model: keywordModel,
        direction: 'out',
        name: 'Includes',
      },
    },
    primaryKeyField: 'uid',
  },
  db);
}

export type KeywordProperties = {
  word: string,
};

export type KeywordRelatedNodes = unknown;

export type KeywordInstance = NeogmaInstance<KeywordProperties, KeywordRelatedNodes>;
export type KeywordModel = NeogmaModel<KeywordProperties, KeywordRelatedNodes>;

export function initKeywordModel(db: Neogma): KeywordModel {
  return ModelFactory<KeywordProperties, KeywordRelatedNodes>({
    label: 'Keyword',
    schema: {
      word: {
        type: 'string',
        required: true,
      },
    },
    primaryKeyField: 'word',
  },
  db);
}

export type AffirmationNotifProperties = {
  uid: string,
};

export type AffirmationNotifRelatedNodes = {
  User: ModelRelatedNodesI<UserModel, UserInstance>,
  Hour: ModelRelatedNodesI<HourModel, HourInstance>,
  Day: ModelRelatedNodesI<DayModel, DayInstance>,
  Month: ModelRelatedNodesI<MonthModel, MonthInstance>,
  Year: ModelRelatedNodesI<YearModel, YearInstance>,
  Timestamp: ModelRelatedNodesI<TimestampModel, TimestampInstance>,
  Affirmation: ModelRelatedNodesI<AffirmationModel, AffirmationInstance>,
};
export type AffirmationNotifInstance = NeogmaInstance<
AffirmationNotifProperties, AffirmationNotifRelatedNodes>;

export type AffirmationNotifModel = NeogmaModel<
AffirmationNotifProperties, AffirmationNotifRelatedNodes>;

export function initAffirmationNotifModel(db: Neogma,
  hourModel: HourModel, dayModel: DayModel, monthModel: MonthModel,
  yearModel: YearModel, timestampModel: TimestampModel,
  userModel: UserModel, affirmationModel: AffirmationModel): AffirmationNotifModel {
  return ModelFactory<AffirmationNotifProperties, AffirmationNotifRelatedNodes>({
    label: 'AffirmationNotif',
    schema: {
      uid: {
        type: 'string',
        required: true,
      },
    },
    relationships: {
      Affirmation: {
        model: affirmationModel,
        direction: 'in',
        name: 'Notified',
      },
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
    primaryKeyField: 'uid',
  }, db);
}
