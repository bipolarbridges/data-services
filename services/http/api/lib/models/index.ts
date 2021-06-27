import * as user from './user';
import * as measurement from './measurement';
import * as source from './source';
import * as time from './time';
import * as auth from './auth';


type allModels = {
    measurementType: measurement.MeasurementTypeModel,
    user: user.UserModel,
    source: source.SourceModel,
    hour: time.HourModel,
    day: time.DayModel,
    month: time.MonthModel,
    year: time.YearModel,
    timestamp: time.TimestampModel,
    measurement: measurement.MeasurementModel,
	auth: auth.allAuthModels,
}

export {
    user,
    measurement,
    source,
    time,
	auth,
    allModels,
}
