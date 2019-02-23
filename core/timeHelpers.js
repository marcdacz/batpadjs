const moment = require('moment');

const getDuration = (start, end) => {
  let dur = moment.duration(end.diff(start));

  if (dur.asMinutes() > 60) {
    return dur.asHours().toFixed(2) + 'hrs';
  }

  if (dur.asSeconds() > 60) {
    return dur.asMinutes().toFixed(2) + 'mins';
  }

  if (dur > 1000) {
    return dur.asSeconds().toFixed(2) + 's';
  }

  return dur + 'ms';
};

module.exports = {
  getDuration
};