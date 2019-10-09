import {Injectable} from '@angular/core';
import {AngularIndexedDB} from 'angular2-indexeddb';
import {UserGame} from "../_models/userGame";
import {Contact} from "../_models/contact";

const DB_NAME = 'VGC';
const DB_VERSION = 11;

@Injectable()
export class GameLocalService {

    db;

    constructor() {

        localStorage.removeItem('userGames');

        this.db = new AngularIndexedDB(DB_NAME, DB_VERSION);

        this.db.openDatabase(DB_VERSION, (evt) => {
            this.db.getAll('userGames').then({}, (error) => {
                GameLocalService.dbError(error);
                evt.currentTarget.result.createObjectStore(
                    'userGames', {keyPath: "id", autoIncrement: true});
            });
        });
    }

    private userGamesDateLocalId = 'userGamesDate';
    private userContactsLocalId = 'userContacts';
    private userPlacesLocalId = 'userPlaces';
    private newGameSearchLocalId = 'newGameSearch';
    private newUserGameLocalId = 'newUserGame';
    private enableVideoId = 'enableVideo';
    private welcomeShowLocalId = 'welcomeShow';

    resetAll() {
        let resetIds = ['userGamesDate', 'userContacts', 'userPlaces', 'newGameSearch'];
        for (let i in resetIds) {
            localStorage.removeItem(resetIds[i]);
        }

        return this.db.openDatabase().then(() => {
            return this.db.getAll('userGames').then((userGames) => {
                for (let userGame of userGames) {
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

    private static dbError(error) {
        console.log(error);
    }

    setUserGames(userGames: UserGame[]) {
        for (let userGame of userGames) {
            this.setUserGame(userGame);
        }
    }

    getUserGames() {
        console.log('getUserGames openDatabase');

        return this.db.openDatabase().then(() => {
            console.log('getAll openDatabase');
            return this.db.getAll('userGames').then((userGames) => {
                console.log('return userGames');

                return userGames;
            }, (error) => {
                GameLocalService.dbError(error);
            });
        });
    }

    setUserGamesDate() {
        let date = new Date();
        localStorage.setItem(this.userGamesDateLocalId, date.getTime().toString());
        return date;
    }

    getUserGamesDate() {
        if (localStorage.getItem(this.userGamesDateLocalId)) {
            let dateTime = localStorage.getItem(this.userGamesDateLocalId);
            return new Date(parseInt(dateTime));
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

    getUserGameByPlatform(userGame: UserGame) {

        return this.db.openDatabase().then(() => {
            return this.db.getAll('userGames').then((userGames) => {

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
            }, (error) => {
                console.log(error);
            });
        });
    }

    setUserGame(userGame: UserGame) {
        console.log('setUserGame openDatabase');

        return this.db.openDatabase().then(() => {

            console.log('getByKey');
            return this.db.getByKey('userGames', userGame.id).then((localUserGame) => {

                if (localUserGame) {

                    this.db.update('userGames', userGame).then(() => {
                        return userGame;
                    }, (error) => {
                        console.log(error);
                    });

                }
                else {

                    const newUserGame = new UserGame();
                    newUserGame.purchaseDate = userGame.purchaseDate;
                    newUserGame.purchasePlace = userGame.purchasePlace;
                    newUserGame.purchaseContact = userGame.purchaseContact;
                    newUserGame.saleDate = userGame.saleDate;
                    newUserGame.salePlace = userGame.salePlace;
                    newUserGame.saleContact = userGame.saleContact;

                    this.setNewUserGame(newUserGame);

                    console.log('add');
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

        this.db.openDatabase().then(() => {

            this.db.delete('userGames', userGame.id).then(() => {
                // Do something after the value was added
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

    private static setDates(userGame) {

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
            userGame = GameLocalService.setDates(userGame);

            return userGame;
        }

        return new UserGame();
    }
}
