import { Component } from "@angular/core";
import { User } from "../models/user.model";
import { OverWorkInfo } from "../models/time.model";
import { Store } from "@ngrx/store";
import { ChangeDateRange, changeDaily } from "./actions/main.actions";
import { Observable } from "rxjs";
import { State } from "./reducer/main.reducer";
import { UserService } from "../services/user.service";
import {
  getDateRange,
  getOverworkTotal,
  getOverworkInfoByWeek,
} from "./selectors/main.selectors";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent {
  time_entries: Observable<OverWorkInfo[]>;
  overwork: Observable<number>;
  date_range: Observable<[Date, Date]>;

  user: User;
  private _daily = 7;
  public get daily() {
    return this._daily;
  }
  public set daily(val: number) {
    this._daily = val;
    this.store.dispatch(changeDaily({ val: val }));
  }
  constructor(private store: Store<State>, private userService: UserService) {
    this.user = userService.userInfo.user;
  }

  async ngOnInit() {
    this.time_entries = this.store.select(getOverworkInfoByWeek);
    this.date_range = this.store.select(getDateRange);
    this.overwork = this.store.select(getOverworkTotal);
  }

  onRangeChange(value: [Date, Date]) {
    this.store.dispatch(new ChangeDateRange(value));
  }

  logOut(ev) {
    ev.preventDefault();
    this.userService.logOut();
    window.location.reload();
  }
}
