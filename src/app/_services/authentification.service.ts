import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import {ErrorService} from "./error.service";
import {environment} from "../../environments/environment";
import {GameLocalService} from "./gameLocal.service";

@Injectable()
export class AuthenticationService {
    private headers = new Headers({'Content-type': 'application/json'});
    private loginUrl = environment.vgcApiUrl+'login_check';
    private registerUrl = environment.vgcApiUrl+'api_register';

    public token: string;

    constructor(private http: Http,
                private errorService: ErrorService) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    login(user: any): Observable<boolean> {

        if (user.email) {
            var url = this.registerUrl;
            var request: any = {
                "email": user.email,
                "username": user.username,
                "plainPassword":
                {
                    "first": user.password,
                    "second": user.confirmPassword
                }
            };
        }
        else {
            var url = this.loginUrl;
            var request: any = {
                "_username": user.username,
                "_password": user.password
            };
        }

        return this.http.post(url, JSON.stringify(request), {headers: this.headers})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;

                if (token) {

                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: user.username, token: token }));

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

        GameLocalService.resetAll();

        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}