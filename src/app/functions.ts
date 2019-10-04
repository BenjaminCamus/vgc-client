export function deepIndexOf(arr, obj) {

    return arr.findIndex(function (cur) {

        if (obj.id && cur.id && obj.id === cur.id) {
            return true;
        }

        return Object.keys(obj).every(function (key) {
            return obj[key] === cur[key];
        });
    });
}

export function orderByName(a, b) {

    if (a.name) {

        a = a.name;
        b = b.name;
    } else if (a.firstName) {

        a = a.firstName;
        b = b.firstName;
    } else if (a.game.name) {

        a = a.game.name;
        b = b.game.name;
    } else {
        return 0;
    }

    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }

    return 0;
}

export function orderByCount(countArray: Array<number>) {
    return function (a, b) {
        if (countArray[a.id] < countArray[b.id]) {
            return 1;
        }
        if (countArray[a.id] > countArray[b.id]) {
            return -1;
        }

        return orderByName(a, b);
    };
}

export function formatDate(date: Date, format = 'y-m-d') {

    const y = date.getFullYear();
    const m = ('00' + (date.getMonth() + 1)).slice(-2);
    const d = ('00' + date.getDate()).slice(-2);

    let formattedDate = y + '-' + m + '-' + d;

    switch (format) {

        case 'y-m-d':
            formattedDate = y + '-' + m + '-' + d;
            break;

        case 'd/m/y':
            formattedDate = d + '/' + m + '/' + y;
            break;

        case 'y/m':
            formattedDate = y + '/' + m;
            break;
    }

    return formattedDate;
}
