import {Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {GameLocalService} from '../_services/gameLocal.service';


@Component({
    moduleId: module.id,
    selector: 'loading',
    templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnInit {

    @Input() action: string;
    @Input() set progress(progress: number) {
        this.progressTo = progress;
        this.progressToggle();
    }
    currentProgress = 0;
    progressTo = 0;
    colorInc = 100 / 3;
    timer;
    increment = 1;
    color = 'red';
    @Input() total = 0;

    image: string;

    welcomeHide = false;

    @Output() close: EventEmitter<any> = new EventEmitter();

    constructor(private gameLocalService: GameLocalService) {
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        this.randomBgIndex();
    }

    ngOnInit(): void {
        this.randomBgIndex();
        this.welcomeHide = !this.gameLocalService.getOption('welcomeShow');
    }

    randomBgIndex() {
        const rand = Math.floor(Math.random() * 222) + 1;
        const str = '' + rand;
        const pad = '000';
        const imageId = pad.substring(0, pad.length - str.length) + str;

        this.image = 'assets/img/pixel-bg/pixel-background-' + imageId + '.gif';
    }

    progressToggle() {

        if (this.timer) {
            clearInterval(this.timer);
        }

        const range = this.progressTo - this.currentProgress;

        if (range === 0) {
            return false;
        }

        this.increment = this.progressTo > this.currentProgress ? 1 : -1;
        const stepTime = Math.abs(Math.floor(10 / range));

        this.timer = setInterval(() => {

            this.currentProgress += this.increment;

            if ((this.currentProgress * 100 / this.total) < this.colorInc * 1) {
                this.color = 'red';
            } else if ((this.currentProgress * 100 / this.total) < this.colorInc * 2) {
                this.color = 'orange';
            } else {
                this.color = 'green';
            }

            if (this.currentProgress === this.progressTo) {
                clearInterval(this.timer);
            }
        }, 10);


    }

    closeWelcome() {
        this.gameLocalService.setOption('welcomeShow', !this.welcomeHide);
        this.close.emit(true);
    }
}
