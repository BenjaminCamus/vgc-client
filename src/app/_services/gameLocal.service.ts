import {Injectable} from '@angular/core';
import {AngularIndexedDB} from 'angular2-indexeddb';
import {UserGame} from '../_models/userGame';
import {Contact} from '../_models/contact';

const DB_NAME = 'VGC';
const DB_VERSION = 12;

@Injectable()
export class GameLocalService {

    private db: AngularIndexedDB;
    private userGames: UserGame[] = [];

    private userGamesDateLocalId = 'userGamesDate';
    private userContactsLocalId = 'userContacts';
    private userPlacesLocalId = 'userPlaces';
    private newGameSearchLocalId = 'newGameSearch';
    private newUserGameLocalId = 'newUserGame';
    private enableVideoId = 'enableVideo';
    private welcomeShowLocalId = 'welcomeShow';

    private static setDates(userGame) {

        userGame.purchaseDate = new Date(userGame.purchaseDate);
        if (userGame.saleDate) {
            userGame.saleDate = new Date(userGame.saleDate);
        }

        return userGame;
    }

    private static dbError(error) {
        console.log(error);
    }

    constructor() {

        localStorage.removeItem('userGames');

        this.db = new AngularIndexedDB(DB_NAME, DB_VERSION);

        this.db.openDatabase(DB_VERSION, (evt) => {
            evt.currentTarget.result.createObjectStore(
                'userGames', {keyPath: 'id', autoIncrement: true});
        });
    }


    resetAll() {
        const resetIds = ['userGamesDate', 'userContacts', 'userPlaces', 'newGameSearch'];
        for (const id of resetIds) {
            localStorage.removeItem(id);
        }

        this.userGames = [];

        return this.db.openDatabase(DB_VERSION).then(() => {
            return this.db.getAll('userGames').then((userGames) => {
                for (const userGame of userGames) {
                    this.db.delete('userGames', userGame.id).then(() => {
                        // Do something after the value was added
                    }, (error) => {
                        console.log(error);
                    });
                }
            }, (error) => {
                GameLocalService.dbError(error);
            });
        });
    }

    setUserGames(userGames: UserGame[]) {
        for (const userGame of userGames) {
            this.setUserGame(userGame);
        }
    }

    getUserGames() {
        if (this.userGames.length > 0) {
            return new Promise(resolve => {
                resolve(this.userGames);
            });
        }

        this.userGames = [];

        return this.db.openDatabase(DB_VERSION).then(() => {
            return this.db.getAll('userGames').then((userGames) => {
                this.userGames = userGames;
                return userGames;
            }, (error) => {
                GameLocalService.dbError(error);
            });
        });
    }

    setUserGamesDate() {
        const date = new Date();
        localStorage.setItem(this.userGamesDateLocalId, date.getTime().toString());
        return date;
    }

    getUserGamesDate() {
        if (localStorage.getItem(this.userGamesDateLocalId)) {
            const dateTime = localStorage.getItem(this.userGamesDateLocalId);
            return new Date(parseInt(dateTime, 10));
        }

        return null;
    }

    setWelcomeShow(show: boolean) {
        return localStorage.setItem(this.welcomeShowLocalId, JSON.stringify(show));
    }

    getWelcomeShow() {
        if (localStorage.getItem(this.welcomeShowLocalId)) {
            return JSON.parse(localStorage.getItem(this.welcomeShowLocalId));
        }

        return true;
    }

    setEnableVideo(enableVideo: boolean) {
        return localStorage.setItem(this.enableVideoId, JSON.stringify(enableVideo));
    }

    getEnableVideo() {
        if (localStorage.getItem(this.enableVideoId)) {
            return JSON.parse(localStorage.getItem(this.enableVideoId));
        }

        return [];
    }

    getUserGame(id) {
        const index = this.userGames.findIndex(function (cur) {
            return id === cur.id;
        });

        if (index > 0) {
            return new Promise(resolve => {
                resolve(this.userGames[index]);
            });
        }

        return this.db.openDatabase(DB_VERSION).then(() => {
            return this.db.getByKey('userGames', id).then((userGame) => {
                return userGame;
            }, (error) => {
                GameLocalService.dbError(error);
            });
        });
    }

    setUserGame(userGame: UserGame) {

        const index = this.userGames.findIndex(function (cur) {
            return userGame.id === cur.id;
        });
        if (index === -1) {
            this.userGames.push(userGame);
        } else {
            this.userGames[index] = userGame;
        }

        return this.db.openDatabase(DB_VERSION).then(() => {
            return this.db.getByKey('userGames', userGame.id).then((localUserGame) => {

                if (localUserGame) {

                    this.db.update('userGames', userGame).then(() => {
                        return userGame;
                    }, (error) => {
                        console.log(error);
                    });
                } else {

                    const newUserGame = new UserGame();
                    newUserGame.purchaseDate = userGame.purchaseDate;
                    newUserGame.purchasePlace = userGame.purchasePlace;
                    newUserGame.purchaseContact = userGame.purchaseContact;
                    newUserGame.saleDate = userGame.saleDate;
                    newUserGame.salePlace = userGame.salePlace;
                    newUserGame.saleContact = userGame.saleContact;

                    this.setNewUserGame(newUserGame);

                    this.db.add('userGames', userGame).then(() => {
                        return userGame;
                    }, (error) => {
                        GameLocalService.dbError(error);
                    });
                }
            }, (error) => {
                GameLocalService.dbError(error);
            });
        });
    }

    removeUserGame(userGame: UserGame) {

        this.userGames = this.userGames.filter(function (el) {
            return el.id !== userGame.id;
        });

        return this.db.openDatabase(DB_VERSION).then(() => {

            return this.db.delete('userGames', userGame.id).then(() => {
                return userGame;
            }, (error) => {
                console.log(error);
            });
        });
    }

    setNewGameSearch(search: string) {
        return localStorage.setItem(this.newGameSearchLocalId, search);
    }

    getNewGameSearch() {
        if (localStorage.getItem(this.newGameSearchLocalId)) {
            return localStorage.getItem(this.newGameSearchLocalId);
        }

        return '';
    }

    setUserContacts(contacts: Contact[]) {
        return localStorage.setItem(this.userContactsLocalId, JSON.stringify(contacts));
    }

    getUserContacts() {
        if (localStorage.getItem(this.userContactsLocalId)) {
            return JSON.parse(localStorage.getItem(this.userContactsLocalId));
        }

        return [];
    }

    setUserPlaces(places: string[]) {
        return localStorage.setItem(this.userPlacesLocalId, JSON.stringify(places));
    }

    getUserPlaces() {
        if (localStorage.getItem(this.userPlacesLocalId)) {
            return JSON.parse(localStorage.getItem(this.userPlacesLocalId));
        }

        return [];
    }

    setNewUserGame(userGame: UserGame) {
        return localStorage.setItem(this.newUserGameLocalId, JSON.stringify(userGame));
    }

    getNewUserGame() {
        if (localStorage.getItem(this.newUserGameLocalId)) {

            let userGame = JSON.parse(localStorage.getItem(this.newUserGameLocalId));
            userGame = GameLocalService.setDates(userGame);

            return userGame;
        }

        return new UserGame();
    }
}
