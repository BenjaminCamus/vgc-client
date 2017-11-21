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

    private igdbUrl = 'https://igdbcom-internet-game-database-v1.p.mashape.com/';
    private igdbHeaders = new Headers({
        'X-Mashape-Key': environment.mashapeKey,
        'Accept': 'application/json'
    });

    constructor(private http: Http,
                private authenticationService: AuthenticationService,
                private router: Router,
                private errorService: ErrorService) {
    }

    getUserGames(): Observable<UserGame[]> {

        return this.http.get(this.url + 'user/games', {headers: this.headers})
            .map(response => response.json() as Game[])
            .catch(this.errorService.handleError.bind(this));
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

    getGame(userGame: UserGame, igdb: boolean = false): Observable<UserGame> {
        if (igdb) {
            var url = this.igdbUrl + 'games/' + userGame.game.id + '?fields=*';
            var headers = this.igdbHeaders;
        }
        else {
            var url = this.url + 'user/games/' + userGame.platform.slug + '/' + userGame.game.slug;
            var headers = this.headers;
        }

        return this.http
            .get(url, {headers: headers})
            .map(response => {
                var res = response.json();
                return res as UserGame;
            })
            .catch(this.errorService.handleError.bind(this));
    }

    postUserGame(userGame: UserGame): Observable<UserGame> {
        return this.http
            .post(this.url + 'user/games/add', JSON.stringify(userGame), {headers: this.headers})
            .map(response => {
                var res = response.json();
                return res as UserGame;
            })
            .catch(this.errorService.handleError.bind(this));
    }

    igdbSearch(search: string): Observable<Game[]> {
        return this.http
            .get(this.igdbUrl + 'games/?search=' + encodeURIComponent(search) + '&fields=*&limit=' + (this.searchLimit+3), {headers: this.igdbHeaders})
            .map((res: any) => res.json() as Game[])
            .flatMap((games: Game[]) => {

                if (games.length > 0) {

                    var platformObservable = [];

                    games.map((game: Game) => {
                        if (!game.release_dates || !game.cover) {
                            return Observable.of([]);
                        }

                        var platformIds = [];

                        for (var rd in game.release_dates) {
                            platformIds.push(game.release_dates[rd].platform);
                        }
                        platformIds = platformIds.filter(function (elem, index, self) {
                            return index == self.indexOf(elem);
                        });

                        game.platform = [];

                        for (var p in platformIds) {
                            var platformId = platformIds[p];

                            platformObservable.push(
                                this.http
                                    .get(this.igdbUrl + 'platforms/' + platformId + '?fields=id,name,slug', {headers: this.igdbHeaders})
                                    .map((res: any) => {

                                        //console.log('platformObservable');
                                        let platform: any = res.json();
                                        platform = platform[0];

                                        platform.name = platform.name.replace('PC (Microsoft Windows)', 'Windows');
                                        platform.name = platform.name.replace('PlayStation Portable', 'PSP');
                                        platform.name = platform.name.replace('PlayStation Network', 'PSN');
                                        platform.name = platform.name.replace('Nintendo GameCube', 'GameCube');
                                        platform.name = platform.name.replace('Sega Saturn', 'Saturn');
                                        platform.name = platform.name.replace('Super Nintendo Entertainment System (SNES)', 'Super Nintendo');
                                        platform.name = platform.name.replace('Nintendo Entertainment System (NES)', 'NES');
                                        platform.name = platform.name.replace('Sega Master System', 'Master System');
                                        platform.name = platform.name.replace('Sega Game Gear', 'Game Gear');
                                        platform.name = platform.name.replace('Sega Mega Drive/Genesis', 'Mega Drive');

                                        game.platform.push(platform);
                                        //console.log(game);
                                        return game;
                                    })
                            );
                        }
                    });

                    return Observable.forkJoin(platformObservable);
                }

                return Observable.of([]);
            })
            .catch(this.errorService.handleError.bind(this));
    }
}
