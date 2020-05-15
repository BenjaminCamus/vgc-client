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

    private optionsId = 'options';

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
        localStorage.removeItem('userGamesDate');
        localStorage.removeItem('userContacts');
        localStorage.removeItem('userPlaces');
        localStorage.removeItem('newGameSearch');
        localStorage.removeItem('newUserGame');
        localStorage.removeItem('enableVideo');
        localStorage.removeItem('welcomeShow');

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

    setOption(option, value) {
        let options = {};
        if (localStorage.getItem(this.optionsId)) {
            options = JSON.parse(localStorage.getItem(this.optionsId));
        }

        options[option] = value;

        return localStorage.setItem(this.optionsId, JSON.stringify(options));
    }

    getOption(option) {
        if (localStorage.getItem(this.optionsId)) {
            const options = JSON.parse(localStorage.getItem(this.optionsId));

            if (options[option]) {
                let optionValue = options[option];

                switch (option) {
                    case 'syncDatetime':
                        optionValue = new Date(parseInt(optionValue, 10));
                        break;
                }

                return optionValue;
            }

            return null;
        }

        return null;
    }

    setItems(item, value) {
        return localStorage.setItem(item, JSON.stringify(value));
    }

    getItems(option) {
        if (localStorage.getItem(option)) {
            const value = JSON.parse(localStorage.getItem(option));
            return value;
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
}
