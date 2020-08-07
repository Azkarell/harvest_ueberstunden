
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Moment } from 'moment';
import { range } from '../helpers';

type Holidays = { [name: string]: Holiday }

interface Holiday {
    datum: string,
    hinweis: string;
}

const baseUrl = 'https://feiertage-api.de/api/';

// Remove holydays not relevant for nuremberg
function filter(holydays: Holidays){
    const copy = { ...holydays };
    delete copy['Augsburger Friedensfest'];
    delete copy['Mariä Himmelfahrt'];
    return copy
}

@Injectable()
export class HolidayService {  

    constructor(private http: HttpClient) {}

    getHolidaysInRange(start: Date, end: Date) {
        const startYear = moment(start).year();
        const endYear = moment(end).year();
        console.log(start, end, startYear, endYear)

        // create an observable containing a holiday object array with the years
        return observableForkJoin(range(startYear, endYear)
            .map(x => this.http.get<Holidays>(baseUrl, {
                params: {
                    jahr: x.toString(),
                    nur_land: 'by'
                }
            }))).pipe(
        // filter non nuremberg holidays
        map(x => x.map(filter)
                // get arrays of dates
                .map(y => Object.keys(y)
                    .map(key => y[key].datum))
                // merge into single array
                .reduce<string[]>( (p,c) => [ ...p, ...c ], [])
                // parse dates
                .map(y => moment(y))));        
    }
}