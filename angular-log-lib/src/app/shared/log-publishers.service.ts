import { Injectable } from '@angular/core';
import { LogPublisher, LogConsole, LogLocalStorage, LogWebApi, LogPublisherConfig } from './log-publishers';
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/operator/map";
import "rxjs/operator/catch";
import "rxjs/observable/throw";

const PUBLISHERS_FILE = "assets/log-publishers.json";

@Injectable()
export class LogPublishersService {
    constructor(private http: Http) {
        this.buildPublishers();
    }

    publishers: LogPublisher[] = [];

    buildPublishers() {
        // this.publishers.push(new LogConsole());
        // this.publishers.push(new LogLocalStorage());
        // this.publishers.push(new LogWebApi(this.http));
        let logPub: LogPublisher;

        this.getLoggers().subscribe(response => {
            for (const pub of response.filter(p => p.isActive)) {
                switch (pub.loggerName.toLowerCase()) {
                    case "console":
                        logPub = new LogConsole();
                        break;
                    case "localstorage":
                        logPub = new LogLocalStorage();
                        break;
                    case "webapi":
                        logPub = new LogWebApi(this.http);
                        break;
                }

                logPub.location = pub.loggerLocation;
                this.publishers.push(logPub);
            }
        });
    }


    getLoggers(): Observable<LogPublisherConfig[]> {
        return this.http.get(PUBLISHERS_FILE)
            .map(response => response.json())
            .catch(this.handleErrors);
    }

    private handleErrors(error: any): Observable<any> {
        let errors: string[] = [];
        let msg: string = "";

        msg = "Status" + error.status;
        msg += " - Status Text: " + error.status.statusText;
        if (error.json()) {
            msg += " - Exception Message: " + error.json().exceptionMessage;
        }

        errors.push(msg);

        console.log("An error occured", errors);

        return Observable.throw(errors);
    }
}