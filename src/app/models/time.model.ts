import { Time } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import * as moment from 'moment';
import { Moment } from "moment";

export interface OverWorkInfo {
    time: Moment,
    timeString: string,
    hours: number,
    quota: number
} 

export interface OverWorkWeek {
    from: Moment,
    to: Moment,
    hours: number,
    quota: number
}

export class TimeEntryDto {
    id: number;
    hours: number;
    spent_date: string;
    timer_started_at: string;
    started_time: string;
    ended_time: string;
    is_running: boolean;
}

export class TimeEntry {
    id: number;
    hours: number;
    spent_date: Moment;
    timer_started_at: Moment;
    started_time: Moment;
    ended_time: Moment;
    is_running: boolean;

    constructor(dto: TimeEntryDto){        
        this.id = dto.id;
        this.hours = dto.hours;
        this.spent_date = moment(dto.spent_date),
        this.timer_started_at = moment(dto.timer_started_at),
        this.ended_time = moment(dto.ended_time),
        this.is_running = dto.is_running
    }
}


export class TimeEntries {
    user_id?: number;
    from?: string;
    to?: string;
    is_running?: boolean;
    page?: number;
    per_page?: number;
    time_entries: TimeEntryDto[];
    total_pages?: number;
    total_entries?: number;

    constructor(user_id?: number,from?: string, to?: string, page: number = 1, per_page: number = 100, is_running = false){
        this.user_id = user_id;
        this.from = from;
        this.to = to;
        this.page = page;
        this.per_page = per_page;
        this.is_running = is_running;
        this.time_entries = [];
    }
}