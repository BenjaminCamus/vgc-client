import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Router} from "@angular/router";
import {Observable} from 'rxjs';
import {SlimLoadingBarService} from "ng2-slim-loading-bar";


@Injectable()
export class ErrorService {
    constructor(private router: Router,
                private slimLoadingBarService: SlimLoadingBarService) {
    }

    handleError(error: Response | any) {

        console.error('handleError');
        console.error(error);

        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);

            if (error.status == 403 || error.status == 401) {
                this.slimLoadingBarService.stop();
                this.router.navigate(['/login']);
            }

            errMsg = error.status + ' - ' + error.statusText + (err.exception ? '\n' + err.exception[0].message : '');
        }
        else {
            errMsg = error.message ? error.message : error.toString();

            alert('Oups...\n' + errMsg);
            this.router.navigate(['/']);
        }

        return Observable.empty();
    }
}