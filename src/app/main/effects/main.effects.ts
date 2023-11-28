import { of as observableOf, Observable } from "rxjs";

import { map, switchMap, catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";

import * as timeEntryAction from "../actions/main.actions";
import { HarvestService } from "../../services/harvest.service";
import { HolidayService } from "../../services/holiday.service";

@Injectable()
export class TimeEffects {
  
  updateEntries: Observable<Action> = createEffect(() => this.actions.pipe(
    ofType(timeEntryAction.CHANGE_DATE_RANGE),
    switchMap((a: timeEntryAction.ChangeDateRange) =>
      this.harvestService.getTimeEntries(a.value[0], a.value[1]).pipe(
        map((val) => new timeEntryAction.GetTimeEntriesSuccess(val)),
        catchError((err) =>
          observableOf(new timeEntryAction.GetTimeEntriesError())
        )
      )
    )
  ));

  
  updateHolidays: Observable<Action> = createEffect(() => this.actions.pipe(
    ofType(timeEntryAction.CHANGE_DATE_RANGE),
    switchMap((a: timeEntryAction.ChangeDateRange) =>
      this.holidayService
        .getHolidaysInRange(a.value[0], a.value[1])
        .pipe(map((t) => new timeEntryAction.GetHolidaysSuccess(t)), catchError(err => observableOf(new timeEntryAction.GetHolidaysError())))
    )
  ));

  constructor(
    private harvestService: HarvestService,
    private holidayService: HolidayService,
    private actions: Actions
  ) {}
}
