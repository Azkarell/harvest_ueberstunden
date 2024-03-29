import { forkJoin as observableForkJoin, Observable } from "rxjs";

import { map, tap, mergeMap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TimeEntries, TimeEntryDto, TimeEntry } from "../models/time.model";
import { UserService } from "./user.service";
import * as moment from "moment";
import { range } from "../helpers";

@Injectable()
export class HarvestService {
  // Doc: https://help.getharvest.com/api-v2/
  private baseurl = "https://api.harvestapp.com";
  private timeurl = "/v2/time_entries";

  constructor(private http: HttpClient, private user: UserService) {}

  getTimeEntries(start: Date, end: Date): Observable<TimeEntry[]> {
    const headers = { "Harvest-Account-Id": this.user.accountId.toString() };
    const from = moment(start).format("YYYY-MM-DD");
    const to = moment(end).format("YYYY-MM-DD");

    return this.http
      .get<TimeEntries>(this.baseurl + this.timeurl, {
        headers: headers,
        params: {
          from: from,
          to: to,
        },
      })
      .pipe(
        mergeMap((res) =>
          {
            let r = range(1, res.total_pages).map((x) =>
              this.http.get<TimeEntries>(this.baseurl + this.timeurl, {
                headers: headers,
                params: {
                  from: from,
                  to: to,
                  page: x.toString(),
                },
              })
            )
            return observableForkJoin(r);
          }
        ),
        tap((x) => console.log(x)),
        map((x) =>
          x
            .reduce<TimeEntryDto[]>((p, c) => [...p, ...c.time_entries], [])
            .map((y) => new TimeEntry(y))
        )
      );
  }
}
