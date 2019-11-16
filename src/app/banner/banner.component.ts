import {Component, ElementRef, Input, HostListener, ViewChild} from '@angular/core';
import {Game} from '../_models/game';
import {opacityTransition} from '../_animations/opacity.animations';
import {GameLocalService} from '../_services/gameLocal.service';
import {Video} from '../_models/video';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
    moduleId: module.id,
    selector: 'banner',
    templateUrl: './banner.component.html',
    animations: [opacityTransition()]
})
export class BannerComponent {

    game: Game;

    enableVideo: boolean = true;
    video: Video | null;
    image: string = '';
    image2: string = '';

    bannerMarginLeft: number;
    bannerWidth: number;
    bannerHeight: number;

    @Input() disableVideo: boolean = false;

    @Input() set data(data: any) {

        // If Game
        if (data && data.name) {

            this.game = data;
        }

        // ElseIf UserGame
        else if (data && data.game) {

            this.game = data.game;
        }

        // ElseIf Games (for IGDB search)
        else if (data && data[0] && data[0].name) {

            this.game = data[0];
        } else {
            this.game = null;
        }

        let image = '';

        this.randomVideo();

        if (this.game && this.game.screenshots && this.game.screenshots.length > 0) {
            let rand = Math.floor(Math.random() * this.game.screenshots.length);
            let imageId = this.game.screenshots[rand].cloudinaryId;

            image = 'https://images.igdb.com/igdb/image/upload/t_original/' + imageId + '.jpg';
        } else {
            let rand = Math.floor(Math.random() * 222) + 1;
            let str = '' + rand;
            let pad = '000';
            let imageId = pad.substring(0, pad.length - str.length) + str;

            image = 'assets/img/pixel-bg/pixel-background-' + imageId + '.gif';
        }

        if (this.image != '') {
            this.image = '';
            this.image2 = image;
        } else {
            this.image = image;
            this.image2 = '';
        }
    }

    @ViewChild('gameBanner') gameBanner: ElementRef;

    constructor(private gameLocalService: GameLocalService,
                private deviceService: DeviceDetectorService) {
    }

    setEnableVideo(enableVideo) {
        this.gameLocalService.setEnableVideo(enableVideo);
        this.enableVideo = enableVideo;
    }

    randomVideo() {

        if (this.deviceService.isMobile()) {
            return false;
        }

        let video;

        if (!this.disableVideo && this.game && this.game.videos && this.game.videos.length > 0) {
            const rand = Math.floor(Math.random() * this.game.videos.length);

            video = this.game.videos[rand];

            if (this.video && this.video.youtubeId == video.youtubeId) {
                this.randomVideo();
                return false;
            }

            this.enableVideo = this.gameLocalService.getEnableVideo();
        }

        if (video) {
            this.video = video;
        }
    }

}
