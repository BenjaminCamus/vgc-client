import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_services/authentification.service';
import {Router} from '@angular/router';
import {Game} from '../_models/game';
import {UserGame} from '../_models/userGame';
import {ErrorService} from './error.service';
import {Contact} from '../_models/contact';
import {environment} from '../../environments/environment';
import {formatDate} from '../functions';

@Injectable()
export class GameService {

    private url = environment.vgcApiUrl;
    private headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.authenticationService.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });

    private static convertData(userGame) {

        userGame.purchaseDate = GameService.dateFromISO(userGame.purchaseDate);
        userGame.saleDate = GameService.dateFromISO(userGame.saleDate);

        for (const releaseDate of userGame.game.releaseDates) {
            if (userGame.platform.id === releaseDate.platform.id) {
                userGame.releaseDate = GameService.dateFromISO(releaseDate.date);
                break;
            }
        }

        if (userGame.game.name.substr(0, 4).toLowerCase() === 'the ') {
            userGame.game.name = userGame.game.name.substr(4) + ' (The)';
        }

        return userGame;
    }

    private static dateFromISO(date) {
        if (date) {
            const timestamp = Date.parse(date);
            return new Date(timestamp);
        }

        return date;
    }

    constructor(private http: HttpClient,
                private authenticationService: AuthenticationService,
                private router: Router,
                private errorService: ErrorService) {
    }

    getUserGames(username: string, offset: number, limit: number): Observable<UserGame[]> {

        return this.http
            .get<UserGame[]>(
                this.url + 'user/games?username=' + username + '&offset=' + offset + '&limit=' + limit,
                {headers: this.headers}
                )
            .pipe(
                map(response => {
                    for (const key in response) {
                        if (response[key]) {
                            response[key] = GameService.convertData(response[key]);
                        }
                    }
                    return response as UserGame[];
                }),
                catchError(this.errorService.handleError.bind(this))
            );
    }

    countUserGames(username): Observable<number> {

        return this.http.get<number>(this.url + 'user/games/count?username=' + username, {headers: this.headers})

            .pipe(
                catchError(this.errorService.handleError.bind(this))
            );
    }

    getUserContacts(): Observable<Contact[]> {

        return this.http.get<Contact[]>(this.url + 'user/contacts', {headers: this.headers})
            .pipe(
                catchError(this.errorService.handleError.bind(this))
            );
    }

    getUserPlaces(): Observable<string[]> {

        return this.http.get<string[]>(this.url + 'user/places', {headers: this.headers})
            .pipe(
                catchError(this.errorService.handleError.bind(this))
            );
    }

    deleteUserGame(userGame: UserGame): Observable<UserGame> {
        const url = this.url + 'user/games/' + userGame.id;
        const headers = this.headers;

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
        delete userGame.releaseDate;

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
                    return GameService.convertData(response) as UserGame;
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
