// truncate.ts
import { Pipe } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe {
    static transform(value: string, limit: number) : string {

        if (typeof value == 'undefined') {
            return '';
        }

        return value.length > limit ? value.substring(0, limit) + '...' : value;
    }
}