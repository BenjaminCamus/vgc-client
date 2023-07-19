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

    private optionsKey = 'options';
    private defaultOption = {
        'displayMode': 0,
        'orderField': 'game.name',
        'orderOption': false,
        'welcomeShow': true,
        'enableVideo': true,
        'syncDatetime': 0,
        'newGameSearch': '',
        'sliceGap': 50,
    };

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
        this.db = new AngularIndexedDB(DB_NAME, DB_VERSION);

        this.db.openDatabase(DB_VERSION, (evt) => {
            evt.currentTarget.result.createObjectStore(
                'userGames', {keyPath: 'id', autoIncrement: true});
        });
    }


    resetAll() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key !== this.optionsKey) {
                localStorage.removeItem(key);
            }
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
        if (localStorage.getItem(this.optionsKey)) {
            options = JSON.parse(localStorage.getItem(this.optionsKey));
        }

        options[option] = value;

        return localStorage.setItem(this.optionsKey, JSON.stringify(options));
    }

    getOption(option) {
        if (localStorage.getItem(this.optionsKey)) {
            const options = JSON.parse(localStorage.getItem(this.optionsKey));

            if (typeof options[option] !== 'undefined') {
                let optionValue = options[option];

                switch (option) {
                    case 'syncDatetime':
                        optionValue = new Date(parseInt(optionValue, 10));
                        break;
                }

                return optionValue;
            }

            return this.defaultOption[option];
        }

        return this.defaultOption[option];
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

    getSameUserGame(gameId, platformId) {

        console.log(this.userGames);
        for (const userGame of this.userGames) {
            console.log(userGame.game.id);
            console.log(userGame.game.name);
            if (gameId === userGame.game.id && platformId === userGame.platform.id) {
                return userGame;
            }
        }

        return null;
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
