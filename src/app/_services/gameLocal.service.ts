import {Injectable} from '@angular/core';
import {UserGame} from "../_models/userGame";
import {orderByName} from "../functions";
import {Contact} from "../_models/contact";


@Injectable()
export class GameLocalService {
    constructor() {
    }

    private userGamesLocalId = 'userGames';
    private userGamesDateLocalId = 'userGamesDate';
    private userContactsLocalId = 'userContacts';
    private newGameSearchLocalId = 'newGameSearch';
    private newUserGameLocalId = 'newUserGame';

    static resetAll() {
        var resetIds = ['userGames', 'userGamesDate', 'userContacts', 'newGameSearch'];
        for (var i in resetIds) {
            localStorage.removeItem(resetIds[i]);
        }
    }

    getUserGames() {
        if (localStorage.getItem(this.userGamesLocalId)) {

            let userGames = JSON.parse(localStorage.getItem(this.userGamesLocalId));
            for (let userGame of userGames) {
                userGame = this.setDates(userGame);
            }

            return userGames;
        }

        return [];
    }

    setUserGamesDate() {
        var date = new Date();
        localStorage.setItem(this.userGamesDateLocalId, date.getTime().toString());
        return date;
    }

    getUserGamesDate() {
        if (localStorage.getItem(this.userGamesDateLocalId)) {
            var dateTime = localStorage.getItem(this.userGamesDateLocalId);
            var date = new Date(parseInt(dateTime));
            return date;
        }

        return null;
    }

    setUserGames(userGames: UserGame[]) {
        return localStorage.setItem(this.userGamesLocalId, JSON.stringify(userGames));
    }

    getUserGame(userGame: UserGame) {


        let userGames = this.getUserGames();

        if (userGames.length == 0) {
            return userGame;
        }
        else {
            let index = userGames.findIndex(function (cur) {
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

                var newUserGame = new UserGame();
                newUserGame.purchaseDate = userGame.purchaseDate;
                newUserGame.purchasePlace = userGame.purchasePlace;
                newUserGame.purchaseContact = userGame.purchaseContact;
                newUserGame.saleDate = userGame.saleDate;
                newUserGame.salePlace = userGame.salePlace;
                newUserGame.saleContact = userGame.saleContact;

                this.setNewUserGame(newUserGame);
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

    setDates(userGame) {

        userGame.purchaseDate = new Date(userGame.purchaseDate);
        if (userGame.saleDate) {
            userGame.saleDate = new Date(userGame.saleDate);
        }
        if (userGame.releaseDate) {
            userGame.releaseDate = new Date(userGame.releaseDate);
        }

        return userGame;
    }

    setNewUserGame(userGame: UserGame) {
        return localStorage.setItem(this.newUserGameLocalId, JSON.stringify(userGame));
    }

    getNewUserGame() {
        if (localStorage.getItem(this.newUserGameLocalId)) {

            let userGame = JSON.parse(localStorage.getItem(this.newUserGameLocalId));
            userGame = this.setDates(userGame);

            return userGame;
        }

        return new UserGame();
    }
}