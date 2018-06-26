import { Component, OnInit } from '@angular/core';
import { HarvestService } from '../services/harvest.service';
import { User, UserInfo } from '../models/user.model';
import { TimeEntries, TimeEntryDto, TimeEntry, OverWorkInfo } from '../models/time.model';
import { Store } from '@ngrx/store';
import { ChangeDateRange } from './actions/main.actions';
import { Observable } from 'rxjs/Observable';
import { State } from './reducer/main.reducer';
import { UserService } from '../services/user.service';
import { getTimeEntries, getDateRange, getTimeEntriesAggregatedByDay, getOverworkInfoByDay, getOverworkTotal, getOverworkInfoByWeek } from './selectors/main.selectors';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  time_entries: Observable<OverWorkInfo[]>;
  overwork: Observable<number>;
  date_range: Observable<[Date,Date]>;
  
  user: User;
  
  constructor(private store: Store<State>, private harvest: HarvestService, private userService: UserService) {
    this.user = userService.userInfo.user;
  }

  async ngOnInit() {
    this.time_entries = this.store.select(getOverworkInfoByWeek);
    this.date_range = this.store.select(getDateRange);
    this.overwork = this.store.select(getOverworkTotal);
  }

  onRangeChange(value: [Date,Date]){
    this.store.dispatch(new ChangeDateRange(value));
  }

  logOut(ev){
    ev.preventDefault();
    this.userService.logOut();
    window.location.reload();
  }
}
