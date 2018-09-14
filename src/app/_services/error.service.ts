import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from "@angular/router";


@Injectable()
export class ErrorService {
    constructor(private router: Router) {
    }

    handleError(error: any) {

        console.error('handleError');

        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof HttpErrorResponse) {

            if (error.status == 404) {
                this.router.navigate(['/']);
            }
            else if (error.status == 403 || (error.status == 401 && this.router && this.router.url !== '/login')) {
                this.router.navigate(['/login']);
            }

            errMsg = error.status + ' - ' + error.error.message;

        }
        else {
            errMsg = error.message ? error.error.message : error.toString();

            alert('Oups...\n' + errMsg);
            this.router.navigate(['/']);
        }

        console.error(errMsg);

        return errMsg;
    }
}