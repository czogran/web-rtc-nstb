import {Injectable} from '@angular/core'
import {BehaviorSubject, Observable, shareReplay, Subject} from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class MediaService {
    localStream: MediaStream
    localStreamSubject: Subject<MediaStream> = new Subject()
    cameraOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    cameraOnObservable: Observable<boolean> = this.cameraOn.pipe(shareReplay(1))

    remoteStreamsMap: Map<string, MediaStream> = new Map<string, MediaStream>()

    private audioOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    )
    audioOnObservable: Observable<boolean> = this.audioOn.pipe(shareReplay(1))

    constructor() {
    }

    async createLocalStream() {
        this.localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
        this.cameraOn.next(true)
        this.audioOn.next(true)

        this.localStreamSubject.next(this.localStream)
    }

    addRemoteTrack(userIdn: string, track: MediaStreamTrack) {
        const remotStream = this.remoteStreamsMap.get(userIdn)
        if (remotStream) {
            remotStream.addTrack(track)
        }
    }

    addRemoteMediaStream(userIdn: string) {
        this.remoteStreamsMap.set(userIdn, new MediaStream)
    }

    turnCameraOff() {
        const isCameraOn = this.cameraOn.value
        this.localStream.getVideoTracks()[0].enabled = !isCameraOn
        this.cameraOn.next(!isCameraOn)
    }

    turnAudio() {
        const isAudioOn = this.audioOn.value
        this.localStream.getAudioTracks()[0].enabled = !isAudioOn
        this.audioOn.next(!isAudioOn)
    }

    closeStream() {
        this.localStream.getTracks().forEach(track => track.stop())
    }
}
