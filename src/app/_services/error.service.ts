import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Router} from "@angular/router";
import {Observable} from 'rxjs';


@Injectable()
export class ErrorService {
    constructor(private router: Router) {
    }

    handleError(error: Response | any) {

        console.error('handleError');
        console.error(error);

        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);

            if (error.status == 404) {
                this.router.navigate(['/']);
            }
            else if (error.status == 403 || error.status == 401) {
                this.router.navigate(['/login']);
            }


            errMsg = error.status + ' - ' + error.statusText + (err.exception ? '\n' + err.exception[0].message : '');
            console.error(errMsg);

        }
        else {
            errMsg = error.message ? error.message : error.toString();
            console.error(errMsg);


            alert('Oups...\n' + errMsg);
            this.router.navigate(['/']);
        }

        return Observable.empty();
    }
}