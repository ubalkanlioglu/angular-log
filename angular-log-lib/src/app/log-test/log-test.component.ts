import { Component } from "@angular/core";
import { LogService, LogLevel, LogEntry } from "../shared/log.service";
import { LogLocalStorage } from "../shared/log-publishers";
import { Product } from "./product";

@Component({
    selector: "log-test",
    templateUrl: "./log-test.component.html"
})
export class LogTestComponent {
    constructor(private logger: LogService) {

    }

    logEntries: LogEntry[];

    clearLog(): void {
        this.logger.clearLog();
    }

    getLocalStorage(): void{
        let tmp = this.logger.publishers.
            find(p => p.constructor.name === "LogLocalStorage");
            if (tmp!=null) {
                let local=tmp as LogLocalStorage;
                local.getAll().subscribe(response => this.logEntries = response);;
            }
    }

    objectLog(): void {
        let product = new Product();

        product.productId = 1;
        product.productName = "A new product";
        product.intruductionDate = new Date();
        product.price = 10;
        product.url = "www.fairwaytech.com";

        this.logger.log("This is a product object", product);

    }

    testLog(): void {
        this.logger.level = LogLevel.Debug;
        this.logger.debug("Test the log() Method", "Paul", "John", 2, 3);
    }
}