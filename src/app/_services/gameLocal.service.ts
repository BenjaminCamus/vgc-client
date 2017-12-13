import {Injectable} from '@angular/core';
import {UserGame} from "../_models/userGame";
import {orderByName} from "../functions";
import {Contact} from "../_models/contact";


@Injectable()
export class GameLocalService {
    constructor() {
    }

    private userGamesLocalId = 'userGames';
    private userContactsLocalId = 'userContacts';
    private newGameSearchLocalId = 'newGameSearch';

    getUserGames() {
        if (localStorage.getItem(this.userGamesLocalId)) {
            return JSON.parse(localStorage.getItem(this.userGamesLocalId));
        }

        return [];
    }

    setUserGames(userGames: UserGame[]) {
        return localStorage.setItem(this.userGamesLocalId, JSON.stringify(userGames));
    }

    getUserGame(userGame: UserGame, igdb: boolean = false) {

        let userGames = this.getUserGames();

        if (userGames.length == 0) {
            return userGame;
        }
        else {
            let index = userGames.findIndex(function (cur) {
                if (igdb) {
                    return userGame.game.id === cur.game.igdbId && userGame.platform.id === cur.platform.igdbId;
                }

                return userGame.game.slug === cur.game.slug && userGame.platform.slug === cur.platform.slug;
            });
            if (index === -1) {
                return userGame;
            }
            else {
                return userGames[index];
            }
        }
    }

    setUserGame(userGame: UserGame) {
        let userGames = this.getUserGames();
        if (userGames.length == 0) {
            userGames.push(userGame);
        }
        else {
            let index = userGames.findIndex(function (cur) {
                return userGame.game.id === cur.game.id && userGame.platform.id === cur.platform.id;
            });
            if (index === -1) {
                userGames.push(userGame);
            }
            else {
                userGames[index] = userGame;
            }

        }

        userGames.sort(orderByName);
        this.setUserGames(userGames);

        return userGame;
    }

    removeUserGame(userGame: UserGame) {
        let userGames = this.getUserGames();
        if (userGames.length > 0) {
            let index = userGames.findIndex(function (cur) {
                return userGame.game.id === cur.game.id && userGame.platform.id === cur.platform.id;
            });
            if (index > -1) {
                userGames.splice(index, 1);
            }

            userGames.sort(orderByName);
            this.setUserGames(userGames);
        }
        return userGames;
    }

    getNewGameSearch() {
        if (localStorage.getItem(this.newGameSearchLocalId)) {
            return localStorage.getItem(this.newGameSearchLocalId);
        }

        return '';
    }

    setNewGameSearch(search: string) {
        return localStorage.setItem(this.newGameSearchLocalId, search);
    }

    getUserContacts() {
        if (localStorage.getItem(this.userContactsLocalId)) {
            return JSON.parse(localStorage.getItem(this.userContactsLocalId));
        }

        return [];
    }

    setUserContacts(contacts: Contact[]) {
        return localStorage.setItem(this.userContactsLocalId, JSON.stringify(contacts));
    }
}