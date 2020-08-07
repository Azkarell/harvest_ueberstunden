import { Action, createAction, props } from "@ngrx/store";
import { TimeEntryDto, TimeEntry } from "../../models/time.model";
import { Moment } from "moment";

//export const GET_TIME_ENTRIES = 'GET_TIME_ENTRIES';
export const CHANGE_DATE_RANGE = "CHANGE_DATE_RANGE";
export const GET_TIME_ENTRIES_ERROR = "GET_TIME_ENTRIES_ERROR";
export const GET_TIME_ENTRIES_SUCCESS = "GET_TIME_ENTRIES_SUCCESS";
export const GET_HOLIDAYS_SUCCESS = "GET_HOLIDAYS_SUCCESS";
export const GET_HOLIDAYS_ERROR = "GET_HOLIDAYS_ERROR";

export class ChangeDateRange implements Action {
  type = CHANGE_DATE_RANGE;
  constructor(public value: [Date, Date]) {}
}

export const changeDaily = createAction(
  "changeDaily",
  props<{ val: number }>()
);

export class GetTimeEntriesError implements Action {
  type = GET_TIME_ENTRIES_ERROR;
}
export class GetTimeEntriesSuccess implements Action {
  type = GET_TIME_ENTRIES_SUCCESS;
  constructor(public time_entries: TimeEntry[]) {}
}

export class GetHolidaysError implements Action {
  type = GET_HOLIDAYS_ERROR;
}
export class GetHolidaysSuccess implements Action {
  type = GET_HOLIDAYS_SUCCESS;
  constructor(public holidays: Moment[]) {}
}

export type All =
  | GetTimeEntriesError
  | GetTimeEntriesSuccess
  | ChangeDateRange
  | GetHolidaysSuccess
  | GetHolidaysError;
