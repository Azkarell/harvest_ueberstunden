import { Injectable } from '@angular/core';
import { HarvestService } from './harvest.service';
import { TimeEntries, TimeEntry } from '../models/time.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TimeService {


  curTimeEntries: TimeEntries
  allTimeEntries: TimeEntry[];
  constructor(private harvest: HarvestService) {




  }

  // async getOvertime( workHours: number): Promise<number>{
  //   const timeentries = new TimeEntries();
  //   this.curTimeEntries = await this.harvest.getTimeEntries(timeentries);
  //   this.allTimeEntries = this.curTimeEntries.time_entries;
  //   let entries = this.curTimeEntries;
  //   entries.page++;
  //   while(entries.page <= entries.total_pages){
  //     entries = await this.harvest.getTimeEntries(entries);
  //     this.allTimeEntries.concat(entries.time_entries);
  //   }
  //   console.log(this.allTimeEntries);
  //   return this.allTimeEntries.map(entry => entry.hours).reduce((prev,cur) => prev + cur);
  //  }

   getAllTimeEntries(): Observable<TimeEntry[]> {
     return this.harvest.getTimeEntries();
   }
}