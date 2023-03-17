import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class VideoService {
    private videoState: Subject<any> = new Subject()

    videoStateObservable: Observable<any> = this.videoState.asObservable()

    startVideoCall() {
        this.videoState.next('VIDEO')
    }

    startAudioCall() {
        this.videoState.next('AUDIO')
    }

    joinVideoCall() {
        this.videoState.next('JOIN_VIDEO_CALL')
    }
}
