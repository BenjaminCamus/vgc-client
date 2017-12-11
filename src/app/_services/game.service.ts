import {Injectable}              from '@angular/core';
import {Http, Headers, Response}          from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import {AuthenticationService} from '../_services/authentification.service';

import {Router} from "@angular/router";
import {Game} from '../_models/game';
import {UserGame} from "../_models/userGame";
import {ErrorService} from "./error.service";
import {Place} from "../_models/place";
import {Contact} from "../_models/contact";
import {environment} from "../../environments/environment";

@Injectable()
export class GameService {

    searchLimit = 10;

    private url = environment.vgcApiUrl;
    private headers = new Headers({
        'Authorization': 'Bearer ' + this.authenticationService.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });

    constructor(private http: Http,
                private authenticationService: AuthenticationService,
                private router: Router,
                private errorService: ErrorService) {
    }

    getUserGames(): Observable<UserGame[]> {

        return this.http.get(this.url + 'user/games', {headers: this.headers})
            .map(response => {
                var res = response.json();
                for (let key in res) {
                    res[key] = this.setDates(res[key]);
                }
                return res as UserGame[];
            })
            //.map(response => response.json() as UserGame[])
            .catch(this.errorService.handleError.bind(this));
    }

    setDates(userGame) {

        userGame.purchaseDate = new Date(userGame.purchaseDate.timestamp * 1000);
        if (userGame.saleDate) {
            userGame.saleDate = new Date(userGame.saleDate.timestamp * 1000);
        }

        return userGame;
    }

    getUserContacts(): Observable<Contact[]> {

        return this.http.get(this.url + 'user/contacts', {headers: this.headers})
            .map(response => response.json() as Contact[])
            .catch(this.errorService.handleError.bind(this));
    }

    getPlaces(): Observable<Place[]> {

        return this.http.get('/assets/places.json')
            .map(response => response.json() as Place[])
            .catch(this.errorService.handleError.bind(this));
    }

    getGame(userGame: UserGame): Observable<UserGame> {

        var url = this.url + 'user/games/' + userGame.platform.slug + '/' + userGame.game.slug;
        var headers = this.headers;

        return this.http
            .get(url, {headers: headers})
            .map(response => {
                var returnUserGame = response.json();
                returnUserGame = this.setDates(returnUserGame);

                return returnUserGame as UserGame;
            })
            .catch(this.errorService.handleError.bind(this));
    }

    deleteUserGame(userGame: UserGame, igdb: boolean = false): Observable<UserGame> {
        var url = this.url + 'user/games/' + userGame.platform.slug + '/' + userGame.game.slug;
        var headers = this.headers;

        return this.http
            .delete(url, {headers: headers})
            .map(response => {
                return response;
            })
            .catch(this.errorService.handleError.bind(this));
    }

    postUserGame(userGame: UserGame): Observable<UserGame> {
        return this.http
            .post(this.url + 'user/games/add', JSON.stringify(userGame), {headers: this.headers})
            .map(response => {
                var res = response.json();
                res = this.setDates(res);
                return res as UserGame;
            })
            .catch(this.errorService.handleError.bind(this));
    }

    igdbSearch(search: string): Observable<Game[]> {
        return this.http
            .get(this.url + 'igdb/search/' + encodeURIComponent(search), {headers: this.headers})
            .map(response => {
                var games = response.json();
                return games as Game[];
            })
            .catch(this.errorService.handleError.bind(this));
    }
}
