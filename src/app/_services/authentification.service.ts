import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {ErrorService} from "./error.service";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthenticationService {

    private headers = new HttpHeaders({'Content-type': 'application/json'});
    private loginUrl = environment.vgcApiUrl + 'login_check';
    private registerUrl = environment.vgcApiUrl + 'api_register';

    public token: string;

    constructor(private http: HttpClient,
                private errorService: ErrorService) {
        // set token if saved in local storage
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    login(user: any): Observable<boolean> {

        let url, request;

        if (user.email) {
            url = this.registerUrl;
            request = {
                "email": user.email,
                "username": user.username,
                "plainPassword": {
                    "first": user.password,
                    "second": user.confirmPassword
                }
            };
        }
        else {
            url = this.loginUrl;
            request = {
                "_username": user.username,
                "_password": user.password
            };
        }

        return this.http.post<any>(url, JSON.stringify(request), {headers: this.headers})
            .pipe(
                map(response => {
                    // login successful if there's a jwt token in the response
                    let token = response && response.token;

                    if (token) {

                        // set token property
                        this.token = token;

                        // store username and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(response));

                        // return true to indicate successful login
                        return true;
                    } else {
                        console.log('no token');
                        // return false to indicate failed login
                        return false;
                    }
                }),
                catchError(this.errorService.handleError.bind(this))
            );
    }

    logout(): void {

        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}
