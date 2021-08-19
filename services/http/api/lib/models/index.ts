import * as user from './user';
import * as measurement from './measurement';
import * as resource from './resource';
import * as identity from './identity';
import * as source from './source';
import * as time from './time';
import * as domain from './domain';

type AllModels = {
  identity: identity.IdentityModel,
  measurementType: measurement.MeasurementTypeModel,
  resource: resource.ResourceModel,
  user: user.UserModel,
  source: source.SourceModel,
  hour: time.HourModel,
  day: time.DayModel,
  month: time.MonthModel,
  year: time.YearModel,
  timestamp: time.TimestampModel,
  measurement: measurement.MeasurementModel,
  domain: domain.DomainModel,
  domainBullet: domain.DomainBulletModel,
};

export {
  user,
  measurement,
  resource,
  identity,
  source,
  time,
  domain,
  AllModels,
};
