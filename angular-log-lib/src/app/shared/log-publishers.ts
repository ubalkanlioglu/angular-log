import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LogEntry } from './log.service';

export abstract class LogPublisher {
    location: string;

    abstract log(record: LogEntry): Observable<boolean>;
    abstract clear(): Observable<boolean>;

}

export class LogConsole extends LogPublisher {
    log(record: LogEntry): Observable<boolean> {
        console.log(record.buildLogString())
        return Observable.of(true);
    }

    clear(): Observable<boolean> {
        console.clear();
        return Observable.of(true);
    }
}

export class LogLocalStorage extends LogPublisher {
    constructor() {
        super();
        this.location = "logging";
    }

    getAll(): Observable<LogEntry[]> {
        let values: LogEntry[];

        values = JSON.parse(localStorage.getItem(this.location)) || [];

        return Observable.of(values);
    }

    log(record: LogEntry): Observable<boolean> {
        let ret: boolean = false;
        let values: LogEntry[];
        try {
            values = JSON.parse(localStorage.getItem(this.location)) || [];
            values.push(record);
            localStorage.setItem(this.location, JSON.stringify(values));
        } catch (ex) {
            console.log(ex);

        }


        return Observable.of(ret);
    }
    clear(): Observable<boolean> {
        localStorage.removeItem(this.location);
        return Observable.of(true);
    }
}

export class LogPublisherConfig {
    loggerName: string;
    loggerLocation: string;
    isActive: boolean;
}

export class LogWebApi extends LogPublisher {
    constructor(private http: Http) {
        super();
        this.location = "http://localhost:5000/api/log";
    }

    log(record: LogEntry): Observable<boolean> {
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.location, record, options)
            .map(response => {
                response.json
            })
            .catch(this.handleErrors);
    }
    clear(): Observable<boolean> {
        return Observable.of(true);
    }

    private handleErrors(error: any): Observable<any> {
        let errors: string[] = [];
        let msg: string = "";

        msg="Status" + error.status;
        msg += " - Status Text: " + error.status.statusText;
        if (error.json()) {
            msg += " - Exception Message: " + error.json().exceptionMessage;
        }

        errors.push(msg);

        console.log("An error occured", errors);

        return Observable.throw(errors);
    }
}