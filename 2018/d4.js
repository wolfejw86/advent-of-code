const fs = require("fs");

const MATCH_GUARD_NUMBER_REGEX = /\#[0-9]+?\b/;

const guardEvents = fs.readFileSync("./d4.txt", "utf8").split("\n");

function parseEvent(event) {
  const [bracketDate] = event.match(/\[(.*?)\]/g);
  const datetime = bracketDate.replace(/[\[\]]/g, "");
  const [date, time] = datetime.split(" ");
  const [year, month, day] = date.split("-");
  const [rest, action] = event.split("] ");

  return { month, day, time, action, datetime };
}

const events = guardEvents
  .map(parseEvent)
  .sort((a, b) => (a.datetime < b.datetime ? -1 : 1));

function translateSleepRangeToMinutes(start, end) {
  const toInt = n => parseInt(n, 10);
  let [startHr, startMin] = start.split(":").map(toInt);
  const [endHr, endMin] = end.split(":").map(toInt);

  while (startHr !== 0) {
    while (startMin !== 0) {
      startMin++;
      if (startMin === 60) {
        startMin = 0;
      }
    }
    startHr++;
    if (startHr === 24) {
      startHr = 0;
    }
  }

  while (endHr !== 0) {
    while (endMin !== 0) {
      endMin--;
    }
    endHr--;
  }

  return { startMin, endMin };
}

function setupSleepMap() {
  const map = {};
  for (let i = 0; i < 60; i++) {
    map[i] = ".";
  }
  return map;
}

function calcSleepMap(guardSeries) {
  const asleepMinutes = setupSleepMap();
  let asleepStartTime = "";
  let asleepEndTime = "";
  for (const { time, action } of guardSeries) {
    if (action.includes("falls asleep")) {
      asleepStartTime = time;
    } else if (action.includes("wakes up")) {
      asleepEndTime = time;
      const { startMin, endMin } = translateSleepRangeToMinutes(
        asleepStartTime,
        asleepEndTime
      );
      for (let i = startMin; i < endMin; i++) {
        asleepMinutes[i] = "#";
      }
    }
  }

  return asleepMinutes;
}

function findWakeupActionIndex(events) {
  return events.findIndex(e => e.action.includes("begins shift"));
}

function parseGuardsIntoSeries(events, allSeries = []) {
  if (!events.length) {
    return allSeries;
  }

  const first = events.shift();
  let next = findWakeupActionIndex(events);

  if (next === -1) {
    // edgecase for last series
    next = events.length;
  }

  const series = [first];

  for (let i = 0; i < next; i++) {
    series.push(events.shift());
  }

  allSeries.push(series);

  return parseGuardsIntoSeries(events, allSeries);
}

function getMidnightDate(series) {
  const withMidnightHour = series.find(e => e.time.includes("00:"));
  if (!withMidnightHour) {
    return false;
  }
  return withMidnightHour.month + "/" + withMidnightHour.day;
}

function createGuardSleepDataByDate(events) {
  const allGuardsAsleepMaps = [];
  const guardSeries = parseGuardsIntoSeries(events);

  for (const series of guardSeries) {
    const minutes = calcSleepMap(series);
    const [guardId] = series[0].action.match(MATCH_GUARD_NUMBER_REGEX);
    const date = getMidnightDate(series);

    if (date) {
      allGuardsAsleepMaps.push({
        minutes,
        guardId,
        date
      });
    }
  }

  return allGuardsAsleepMaps;
}

function getGuardSeriesForGuard(allGuardsAsleepMaps) {
  return function(guardId) {
    const idmatch = id => arr => arr.filter(g => g.guardId === id);

    return idmatch(guardId)(allGuardsAsleepMaps);
  };
}

function getMostAsleepGuardSeries(guardSleepTotals) {
  const mostMinutesAsleep = Math.max(...Object.values(guardSleepTotals));
  const [[guardWithMostSleepMinutes]] = Object.entries(guardSleepTotals).filter(
    ([key, val]) => val === mostMinutesAsleep
  );

  return getGuardSeriesForGuard(allGuardsAsleepMaps)(guardWithMostSleepMinutes);
}

function getGuardSleepTotals(allGuardsAsleepMaps) {
  return allGuardsAsleepMaps.reduce((data, shift) => {
    if (!data[shift.guardId]) {
      data[shift.guardId] = 0;
    }

    Object.values(shift.minutes).forEach(min => {
      if (min === "#") {
        data[shift.guardId]++;
      }
    });
    return data;
  }, {});
}

function tallyMinutesForSeries(series) {
  return series.reduce((data, series) => {
    Object.entries(series.minutes).forEach(([key, val]) => {
      if (val === "#") {
        data[key]++;
      }
    });

    return data;
  }, setupMinuteMapCounter());
}

function getGuardSeparateTotals(allGuardsAsleepMaps) {
  const uniqueGuardIds = allGuardsAsleepMaps
    .map(map => map.guardId)
    .filter((n, i, arr) => arr.indexOf(n) === i);

  const findGuardSeriesById = getGuardSeriesForGuard(allGuardsAsleepMaps);

  const seriesByGuard = uniqueGuardIds.map(findGuardSeriesById);
  return seriesByGuard.reduce((data, series) => {
    const minutesTotals = tallyMinutesForSeries(series);
    const guardId = series[0].guardId;
    data.push({ minutesTotals, guardId });
    return data;
  }, []);
}

function setupMinuteMapCounter() {
  const minutesMap = setupSleepMap();
  Object.keys(minutesMap).forEach(key => (minutesMap[key] = 0));
  return minutesMap;
}

const allGuardsAsleepMaps = createGuardSleepDataByDate(events);

const allSeriesTotals = getGuardSeparateTotals(allGuardsAsleepMaps);

const maxMinuteAndTotalsByGuard = allSeriesTotals.map(
  ({ minutesTotals, guardId }) => {
    const maxMinuteTotal = Math.max(...Object.values(minutesTotals));
    const minuteOfMostSleep = Object.keys(minutesTotals).filter(
      key => minutesTotals[key] === maxMinuteTotal
    );
    return {
      maxMinuteTotal,
      minuteOfMostSleep,
      guardId
    };
  }
);

const maxMinuteCount = Math.max(
  ...maxMinuteAndTotalsByGuard.map(g => g.maxMinuteTotal)
);

// key to answer pt 2
const [pt2AnswerGuard] = maxMinuteAndTotalsByGuard.filter(
  g => (g.maxMinuteTotal = maxMinuteCount)
);
console.log("pt 2 answer");
console.log(pt2AnswerGuard);

const guardSeriesForGuard = getMostAsleepGuardSeries(
  getGuardSleepTotals(allGuardsAsleepMaps)
);

const minutesCounter = tallyMinutesForSeries(guardSeriesForGuard);

const mostMinuteCount = Math.max(...Object.values(minutesCounter));
const minuteMostSlept = Object.keys(minutesCounter).find(
  key => minutesCounter[key] === mostMinuteCount
);

// key to answer pt 1
console.log("pt 1 answer");
console.log(guardSeriesForGuard[0].guardId);
console.log(minuteMostSlept);
