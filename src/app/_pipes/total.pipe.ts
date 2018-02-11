import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'total',
    pure: false
})

export class TotalPipe implements PipeTransform {

    transform(array: Array<any>, param: string): number {
        var total = 0;

        for (var object of array) {
            if (object[param]) {
                total += parseInt(object[param], 10);
            }
        }

        return total;
    }
}