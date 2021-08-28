import { Session } from 'neo4j-driver';
import { DomainBulletProperties } from 'lib/models/domain';
import { AllModels } from '../models';
import { DatabaseProcedure } from '../db';
import * as loggers from '../logging';
import { createMeasurement, makeTimeProperties } from './measurement';

function userExists(id: string): DatabaseProcedure<boolean> {
  return async (session: Session, models: AllModels): Promise<boolean> => {
    try {
      const user = await models.user.findOne({
        where: {
          uid: id,
        },
        session,
      });
      const exist = user ? user?.__existsInDatabase : false;
      loggers.info(`User exists: ${exist}`);
      return exist;
    } catch (err) {
      loggers.error(err);
      return false;
    }
  };
}

function createUser(id: string): DatabaseProcedure<boolean> {
  return async (session: Session, models: AllModels): Promise<boolean> => {
    try {
      await models.user.createOne(
        {
          uid: id,
          Resource: {
            propertiesMergeConfig: {
              nodes: true,
              relationship: true,
            },
            properties: [
              {
                path: `/client/${id}`,
                method: 'GET',
              },
            ],
          },
        },
        { merge: true, session },
      );

      return true;
    } catch (err) {
      loggers.error(err);
      return false;
    }
  };
}

export type CreateDomainArgs = {
  id: string,
  bullets: string[],
  importance: string,
  name: string,
  scope: string,
};

function domainExists(name: string): DatabaseProcedure<boolean> {
  return async (session: Session, models: AllModels): Promise<boolean> => {
    try {
      const domain = await models.domain.findOne({
        where: {
          name,
        },
        session,
      });
      const exist = domain ? domain?.__existsInDatabase : false;
      loggers.info(`Domain exists: ${exist}`);
      return exist;
    } catch (err) {
      loggers.error(err);
      return false;
    }
  };
}

function createDomain(d: CreateDomainArgs): DatabaseProcedure<boolean> {
  return async (session: Session, models: AllModels): Promise<boolean> => {
    try {
      const bullets: DomainBulletProperties[] = d.bullets
        .map((point: string) => ({ content: point }));
      await models.domain.createOne(
        {
          uid: d.id,
          importance: d.importance,
          name: d.name,
          scope: d.scope,
          DomainBullet: {
            propertiesMergeConfig: {
              nodes: true,
              relationship: true,
            },
            properties: bullets,
          },
        },
        { merge: true, session },
      );

      return true;
    } catch (err) {
      loggers.error(err);
      return false;
    }
  };
}

export type CreateAffirmationArgs = {
  uid: string,
  domains: string[],
  content: string,
  keywords: string[],
};

function affirmationExists(id: string): DatabaseProcedure<boolean> {
  return async (session: Session, models: AllModels): Promise<boolean> => {
    try {
      const affirmation = await models.affirmation.findOne({
        where: {
          uid: id,
        },
        session,
      });
      const exist = affirmation ? affirmation?.__existsInDatabase : false;
      loggers.info(`Affirmation exists: ${exist}`);
      return exist;
    } catch (err) {
      loggers.error(err);
      return false;
    }
  };
}

function createAffirmation(a: CreateAffirmationArgs): DatabaseProcedure<boolean> {
  return async (session: Session, models: AllModels): Promise<boolean> => {
    try {
      const keywords = a.keywords.map((w) => ({ word: w }));
      const afffirmation = await models.affirmation.createOne(
        {
          uid: a.uid,
          content: a.content,
          Keyword: {
            propertiesMergeConfig: {
              nodes: true,
              relationship: true,
            },
            properties: keywords,
          },
        },
        { merge: true, session },
      );
      const results: Promise<number>[] = a.domains.map((name) => afffirmation.relateTo({
        alias: 'Domain',
        where: {
          name,
        },
      }));
      await Promise.all(results);
      return true;
    } catch (err) {
      loggers.error(err);
      return false;
    }
  };
}

export type CreateAffirmationNotifArgs = {
  notifId: string,
  affirmationId: string,
  userId: string,
  date: number,
};

function affirmationNotifExists(notifId: string): DatabaseProcedure<boolean> {
  return async (session: Session, models: AllModels): Promise<boolean> => {
    try {
      const notif = await models.affirmationNotif.findOne({
        where: {
          uid: notifId,
        },
        session,
      });
      const exist = notif ? notif?.__existsInDatabase : false;
      loggers.info(`Affirmation notif exists: ${exist}`);
      return exist;
    } catch (err) {
      loggers.error(err);
      return false;
    }
  };
}

function createAffirmationNotif(n: CreateAffirmationNotifArgs): DatabaseProcedure<boolean> {
  return async (session: Session, models: AllModels): Promise<boolean> => {
    try {
      const notif = await models.affirmationNotif.createOne({
        uid: n.notifId,
        ...makeTimeProperties(n.date),
      }, { merge: true, session });
      await notif.relateTo({
        alias: 'Affirmation',
        where: {
          uid: n.affirmationId,
        },
      });
      await notif.relateTo({
        alias: 'User',
        where: {
          uid: n.userId,
        },
      });
      return true;
    } catch (err) {
      loggers.error(err);
      return false;
    }
  };
}

export default {
  userExists,
  createUser,
  createMeasurement,
  createDomain,
  domainExists,
  affirmationExists,
  createAffirmation,
  affirmationNotifExists,
  createAffirmationNotif,
};
