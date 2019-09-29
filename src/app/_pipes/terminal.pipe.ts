import {Pipe} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

@Pipe({
    name: 'terminal'
})
export class TerminalPipe {

    constructor(private deviceService: DeviceDetectorService) {}

    transform(content: string): string {

        return '<div class="' + (this.deviceService.isMobile() ? '' : 'terminal') + '">' +
            '<p>' +
            content.replace(/\./gi, '.</p><p>') +
            (this.deviceService.isMobile() ? '' : ' <span>|</span>') +
            '</p>' +
            '</div>';
    }
}
