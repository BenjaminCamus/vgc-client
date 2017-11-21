import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import {ErrorService} from "./error.service";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthenticationService {
    private headers = new Headers({'Content-type': 'application/json'});
    private loginUrl = environment.vgcApiUrl+'login_check';

    public token: string;

    constructor(private http: Http,
                private errorService: ErrorService) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    login(username: string, password: string): Observable<boolean> {

        let options = new RequestOptions({ headers: this.headers });

        return this.http.post(this.loginUrl, JSON.stringify({"_username": username, "_password": password }), {headers: this.headers})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;

                if (token) {

                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {console.log('no token');
                    // return false to indicate failed login
                    return false;
                }
            })
            .catch(this.errorService.handleError.bind(this));
    }

    logout(): void {

        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}