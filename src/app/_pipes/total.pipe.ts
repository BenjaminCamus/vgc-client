import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'total',
    pure: false
})

export class TotalPipe implements PipeTransform {

    transform(array: Array<any>, param: string): number {
        let total = 0;

        for (const object of array) {
            if (object[param]) {
                total += parseFloat(object[param]);
            }
        }

        return Math.round(total);
    }
}
