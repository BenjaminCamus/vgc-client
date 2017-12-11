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

    getUserGames() {
        if (localStorage.getItem(this.userGamesLocalId)) {
            return JSON.parse(localStorage.getItem(this.userGamesLocalId));
        }

        return [];
    }

    setUserGames(userGames: UserGame[]) {
        return localStorage.setItem(this.userGamesLocalId, JSON.stringify(userGames));
    }

    getUserGame(userGame: UserGame) {
        let userGames = this.getUserGames();
        if (userGames.length == 0) {
            console.log('local userGames empty');
            return userGame;
        }
        else {
            let index = userGames.findIndex(function (cur) {
                console.log('local userGame search');
                return userGame.game.slug === cur.game.slug && userGame.platform.slug === cur.platform.slug;
            });
            if (index === -1) {
                console.log('local userGame not found');
                return userGame;
            }
            else {
                console.log('local userGame found');
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