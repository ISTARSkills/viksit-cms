import { Injectable } from '@angular/core';
import { Slide } from '../../pojo/slide/slide';

@Injectable()
export class PlayPresentationService {

    audio = new Audio();

    constructor() { }


    public playPresentation(interactivelist) {


        if (interactivelist != null && interactivelist.fragmentAudioUrl != null && interactivelist.fragmentAudioUrl != '' && interactivelist.fragmentAudioUrl != 'none') {
            this.audio.src = interactivelist.fragmentAudioUrl;
            this.audio.load();
            this.audio.play();
        }


    }


}