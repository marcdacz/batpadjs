const moment = require('moment');

const getDuration = (start, end) => {
  let dur = moment.duration(end.diff(start));

  if (dur.asMinutes() > 60) {
    return dur.asHours() + 'hrs';
  }

  if (dur.asSeconds() > 60) {
    return dur.asMinutes() + 'mins';
  }

  if (dur > 1000) {
    return dur.asSeconds() + 's';
  }

  return dur + 'ms';
};

module.exports = {
  getDuration
};