import * as TimeEntriesAction from "../actions/main.actions";
import { TimeEntries, TimeEntryDto, TimeEntry } from "../../models/time.model";
import { Moment } from "moment";
import { createReducer, on } from "@ngrx/store";
export type Action = TimeEntriesAction.All;

export interface State {
  time_entries: TimeEntryDto[];
  holidays: Moment[];
  date_range: [Date, Date];
  daily: number;
  ignoreHolidays: boolean;
}

const intialDateRange = [new Date("2018-03-01"), new Date()];

export const dailyReducer = createReducer(
  7,
  on(TimeEntriesAction.changeDaily, (state, prop) => prop.val)
);

export const ignoreHolidaysReducer = createReducer(
  false,
  on(TimeEntriesAction.changeIgnoreHolidays, (state, prop) => prop.val)
);

export function TimeEntriesReducer(
  state: TimeEntryDto[] = [],
  action: TimeEntriesAction.All
) {
  switch (action.type) {
    case TimeEntriesAction.GET_TIME_ENTRIES_SUCCESS: {
      const act = action as TimeEntriesAction.GetTimeEntriesSuccess;
      return act.time_entries;
    }
    case TimeEntriesAction.GET_TIME_ENTRIES_ERROR: {
      return [];
    }
    default:
      return state;
  }
}

export function HolidaysReducer(
  state: Moment[] = [],
  action: TimeEntriesAction.All
) {
  switch (action.type) {
    case TimeEntriesAction.GET_HOLIDAYS_SUCCESS: {
      const act = action as TimeEntriesAction.GetHolidaysSuccess;
      return act.holidays;
    }
    case TimeEntriesAction.GET_HOLIDAYS_ERROR: {
      return [];
    }
    default:
      return state;
  }
}

export function DateRangeReducer(
  state: Date[] = intialDateRange,
  action: TimeEntriesAction.All
) {
  switch (action.type) {
    case TimeEntriesAction.CHANGE_DATE_RANGE: {
      return (<TimeEntriesAction.ChangeDateRange>action).value;
    }
    default:
      return state;
  }
}

export const reducers = {
  time_entries: TimeEntriesReducer,
  date_range: DateRangeReducer,
  holidays: HolidaysReducer,
  daily: dailyReducer,
  ignoreHolidays: ignoreHolidaysReducer,
};
