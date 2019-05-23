import {Pipe} from '@angular/core';

@Pipe({
    name: 'terminal'
})
export class TerminalPipe {

    static transform(content: string): string {

        return '<div class="terminal">' +
            '<p>' +
            content.replace(/\./gi, '.</p><p>') +
            ' <span>|</span>' +
            '</p>' +
            '</div>';
    }
}