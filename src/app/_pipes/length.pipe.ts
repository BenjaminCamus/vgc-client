import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'length',
    pure: false
})

export class LengthPipe implements PipeTransform {

    transform(value: any): number {
        return value.length;
    }
}