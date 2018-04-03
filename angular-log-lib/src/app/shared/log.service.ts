
import { Injectable } from '@angular/core';

import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';

import { Observable } from "rxjs/Observable";
import { fromEvent } from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/concat';


export enum LogLevel {
    All = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Fatal = 5,
    Off = 6
}

export class LogEntry {
    entryDate: Date = new Date();
    message: string = "";
    level: LogLevel = LogLevel.Debug;
    extraInfo: any[] = [];
    logWithDate: boolean = true;

    buildLogString(): string {
        let ret: string = "";
        if (this.logWithDate) {
            ret = new Date() + " - ";
        }
        ret += "Type: " + LogLevel[this.level]
        ret += " - Message: " + this.message;
        if (this.extraInfo.length) {
            ret += " - Extra Info: " + this.formatParams(this.extraInfo);
        }
        return ret;
    }

    private formatParams(params: any[]): string {
        let ret: string = params.join(",");

        if (params.some(p => typeof p == "object")) {

            ret = "";
            for (let item of params) {
                ret += JSON.stringify(item) + ",";
            }
        }

        return ret;
    }
}

@Injectable()
export class LogService {

    constructor(private publishersService: LogPublishersService) {
        this.publishers = this.publishersService.publishers;
    }

    level: LogLevel = LogLevel.All;
    logWithDate: boolean = false;
    publishers: LogPublisher[];

    private shouldLog(level: LogLevel): boolean {
        let ret: boolean = false;

        if (this.level != LogLevel.Off && level >= this.level) {
            ret = true;
        }

        return ret;
    }

    debug(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Debug, optionalParams);
    }

    info(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Info, optionalParams);
    }

    warning(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Warn, optionalParams);
    }

    error(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Error, optionalParams);
    }

    fatal(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Fatal, optionalParams);
    }


    log(msg: any, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.All, optionalParams);
    }

    clearLog(): void {
        for (let logger of this.publishers) {
            logger.clear();
        }
    }

    private data: Observable<Array<number>>;
    private values: Array<number> = [];
    private anyErrors: boolean;
    private finished: boolean;
    setObserver(selector: string): void {

        var numbers = Observable.of(10, 20, 30);
        var letters = Observable.of('a', 'b', 'c');
        var interval = Observable.interval(1000);
        var result = numbers.concat(letters).concat(interval);
        result.subscribe(x => console.log(x));

        // var button = document.querySelector(selector);
        // fromEvent(button, 'click')
        //     .throttleTime(1000)
        //     .map((event: {clientX: number}) => event.clientX)
        //     .scan((count, clientX) => count + clientX, 0)
        //     .subscribe(count => console.log(count));

    }

    private writeToLog(msg: string, level: LogLevel, params: any[]) {
        if (this.shouldLog(level)) {

            let entry: LogEntry = new LogEntry();
            entry.message = msg;
            entry.level = level;
            entry.extraInfo = params;
            entry.logWithDate = this.logWithDate;

            for (let logger of this.publishers) {
                logger.log(entry).subscribe(response => {
                    if (!response)
                        console.log(response);
                });
            }
        }
    }
}