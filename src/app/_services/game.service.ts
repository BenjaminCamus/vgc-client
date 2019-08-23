import {Injectable}              from '@angular/core';
import {HttpClient, HttpHeaders,}          from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

import {Observable} from 'rxjs';






import {AuthenticationService} from '../_services/authentification.service';

import {Router} from "@angular/router";
import {Game} from '../_models/game';
import {UserGame} from "../_models/userGame";
import {ErrorService} from "./error.service";
import {Contact} from "../_models/contact";
import {environment} from "../../environments/environment";
import {formatDate} from "../functions";

@Injectable()
export class GameService {

    searchLimit = 10;

    private url = environment.vgcApiUrl;
    private headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.authenticationService.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });

    constructor(private http: HttpClient,
                private authenticationService: AuthenticationService,
                private router: Router,
                private errorService: ErrorService) {
    }

    getUserGames(offset: number, limit: number): Observable<UserGame[]> {

        return this.http
            .get<UserGame[]>(this.url + 'user/games?offset=' + offset + '&limit=' + limit, {headers: this.headers})
            .pipe(
                map(response => {
                    for (let key in response) {
                        response[key] = GameService.setDates(response[key]);
                    }
                    return response as UserGame[];
                }),
                catchError(this.errorService.handleError.bind(this))
            );
    }

    countUserGames(): Observable<number> {

        return this.http.get<number>(this.url + 'user/games/count', {headers: this.headers})

            .pipe(
                catchError(this.errorService.handleError.bind(this))
            );
    }

    private static setDates(userGame) {

        if (userGame.purchaseDate) {
            userGame.purchaseDate = new Date(userGame.purchaseDate.timestamp * 1000);
        }
        if (userGame.saleDate) {
            userGame.saleDate = new Date(userGame.saleDate.timestamp * 1000);
        }
        if (userGame.releaseDate) {
            userGame.releaseDate = new Date(userGame.releaseDate.timestamp * 1000);
        }

        if (userGame.game.name.substr(0, 4).toLowerCase() == 'the ') {
            userGame.game.name = userGame.game.name.substr(4) + ' (The)';
        }

        return userGame;
    }

    getUserContacts(): Observable<Contact[]> {

        return this.http.get<Contact[]>(this.url + 'user/contacts', {headers: this.headers})
            .pipe(
                catchError(this.errorService.handleError.bind(this))
            );
    }

    getGame(userGame: UserGame): Observable<UserGame> {

        var url = this.url + 'user/games/' + userGame.id;
        var headers = this.headers;

        return this.http
            .get<UserGame>(url, {headers: headers})
            .pipe(
                map(response => {
                    return GameService.setDates(response) as UserGame;
                }),
                catchError(this.errorService.handleError.bind(this))
            );
    }

    deleteUserGame(userGame: UserGame): Observable<UserGame> {
        var url = this.url + 'user/games/' + userGame.id;
        var headers = this.headers;

        return this.http
            .delete<UserGame>(url, {headers: headers})
            .pipe(
                catchError(this.errorService.handleError.bind(this))
            );
    }

    postUserGame(userGame: UserGame): Observable<UserGame> {

        delete userGame.fieldTypes;
        delete userGame.createdAt;
        delete userGame.updatedAt;
        let userGameJson = JSON.stringify(userGame);
        if (userGame.purchaseDate) {
            userGameJson = userGameJson.replace(
                '"purchaseDate":' + JSON.stringify(userGame.purchaseDate),
                '"purchaseDate":"' + formatDate(userGame.purchaseDate) + '"');
        }
        if (userGame.saleDate) {
            userGameJson = userGameJson.replace(
                '"saleDate":' + JSON.stringify(userGame.saleDate),
                '"saleDate":"' + formatDate(userGame.saleDate) + '"');
        }

        return this.http
            .post<UserGame>(this.url + 'user/games/add', userGameJson, {headers: this.headers})
            .pipe(
                map(response => {
                    return GameService.setDates(response) as UserGame;
                }),
                catchError(this.errorService.handleError.bind(this))
            );
    }

    igdbSearch(search: string): Observable<Game[]> {
        return this.http
            .get<Game[]>(this.url + 'igdb/search/' + encodeURIComponent(search), {headers: this.headers})
            .pipe(
                catchError(this.errorService.handleError.bind(this))
            );
    }
}
