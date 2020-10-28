import { createSelector, MemoizedSelector } from "@ngrx/store";
import { ignoreHolidaysReducer, State } from "../reducer/main.reducer";
import { TimeEntry, OverWorkInfo } from "../../models/time.model";
import * as moment from "moment";
import { Moment } from "moment";
import { flatten } from "@angular/compiler";

export const getTimeDtos = (state: State) => state.time_entries;
export const getHolidays = (state: State) => state.holidays;
export const getDateRange = (state: State) => state.date_range;

export const getTimeEntries = createSelector([getTimeDtos], (dtos) =>
  dtos.map((dto) => new TimeEntry(dto))
);

export const getDaily = (state: State) => state.daily;

export const getIgnoreHolidays = (state: State) => state.ignoreHolidays;

export const getWorkingDaysRange = createSelector(
  [getDateRange, getHolidays, getDaily, getIgnoreHolidays],
  (dateRange, holidays, dailyWorkTime, ignoreHolidays) => {
    const today = moment();
    let current = moment(dateRange[0]);
    let endValue = moment(dateRange[1]);
    endValue = endValue.isAfter(today) ? today : endValue;
    endValue.add(1, "days");

    console.log(current, endValue);

    const dates: { [data: string]: number } = {};
    while (!current.isSame(endValue, "day")) {
      dates[current.format("YYYY-MM-DD")] =
        current.day() === 0 ||
        current.day() === 6 ||
        (!ignoreHolidays && holidays.find((x) => x.isSame(current, "day")))
          ? 0
          : dailyWorkTime;

      current = moment(current.add(1, "days"));
    }
    return dates;
  }
);

export const getTimeEntriesAggregatedByDay = createSelector(
  [getTimeEntries],
  (time_entries) =>
    group(time_entries, (x) => x.spent_date.format("YYYY-MM-DD"))
);

export const getOverworkInfoByDay: MemoizedSelector<
  State,
  OverWorkInfo[]
> = createSelector(
  [getTimeEntriesAggregatedByDay, getWorkingDaysRange],
  (entries, days) => {
    return Object.keys(days).map((dateStr) => ({
      time: moment(dateStr),
      timeString: moment(dateStr).format("ddd"),
      quota: days[dateStr],
      hours: (entries[dateStr] || []).reduce((p, c) => (p += c.hours), 0),
      numberOfVacationEntries: (entries[dateStr] || []).filter((x) => {
        const containsurlaub =
          x.notes?.toLowerCase().includes("urlaub") ?? false;
        const containsvacation =
          x.notes?.toLowerCase().includes("vacation") ?? false;
        console.log(
          containsvacation,
          containsurlaub,
          containsurlaub || containsvacation
        );
        return containsurlaub || containsvacation;
      }).length,
    }));
  }
);

export const getOverworkInfoByWeek: MemoizedSelector<
  State,
  OverWorkInfo[]
> = createSelector([getOverworkInfoByDay], (ow) =>
  groupMap(
    ow,
    (x) => x.time.week().toString(),
    (k, g) =>
      <OverWorkInfo>{
        hours: g.reduce((p, c) => p + c.hours, 0),
        quota: g.reduce((p, c) => p + c.quota, 0),
        time: g[0].time,
        timeString:
          "KW " +
          k +
          " " +
          moment()
            .isoWeek(+k)
            .startOf("week")
            .toString() +
          moment()
            .isoWeek(+k)
            .endOf("week")
            .toString(),
        numberOfVacationEntries: g.reduce(
          (p, c) => p + c.numberOfVacationEntries,
          0
        ),
      }
  )
);

export const getOverworkTotal = createSelector(
  [getOverworkInfoByDay],
  (entries) => entries.reduce<number>((p, c) => (p += c.hours - c.quota), 0)
);

function group<T>(list: T[], keySelector: (x: T) => string | number) {
  return list.reduce<{ [key: string]: T[] }>((p, c) => {
    const k = keySelector(c);
    p[k] = p[k] ? p[k] : [];
    p[k].push(c);
    return p;
  }, {});
}

function groupMap<T, V>(
  list: T[],
  keySelector: (x: T) => string | number,
  transformer: (key: string, group: T[]) => V
) {
  const g = group(list, keySelector);
  return Object.keys(g).map((k) => transformer(k, g[k]));
}

// example for groupMap: Count letters
//console.log(groupMap('Hallo Welt'.split(''), (c) => c, (c,cs) => ({ char: c, count: cs.length})));
