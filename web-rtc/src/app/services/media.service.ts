import { Injectable } from '@angular/core'

import { BehaviorSubject, Observable, shareReplay } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class MediaService {
    localStream: MediaStream

    localStreamSubject: BehaviorSubject<MediaStream> =
        new BehaviorSubject<MediaStream>(null)

    cameraOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    cameraOnObservable: Observable<boolean> = this.cameraOn.pipe(shareReplay(1))

    remoteStreamsMap: Map<string, MediaStream> = new Map<string, MediaStream>()

    private audioOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    )

    audioOnObservable: Observable<boolean> = this.audioOn.pipe(shareReplay(1))

    constructor() {}

    async createLocalStream(video: boolean = true, audio: boolean = true) {
        this.localStream = await navigator.mediaDevices.getUserMedia({
            video: video,
            audio: audio,
        })

        this.cameraOn.next(video)
        this.audioOn.next(audio)

        this.localStreamSubject.next(this.localStream)
    }

    addRemoteTrack(userIdn: string, track: MediaStreamTrack) {
        const remotStream = this.remoteStreamsMap.get(userIdn)

        if (remotStream) {
            remotStream.addTrack(track)
        }
    }

    addRemoteMediaStream(userIdn: string) {
        this.remoteStreamsMap.set(userIdn, new MediaStream())
    }

    turnCamera() {
        const isCameraOn = this.cameraOn.value

        if (!isCameraOn) {
            this.enableCamera()
        } else {
            ;(this.localStream.getVideoTracks() || []).forEach((track) => {
                track.stop()
                this.localStream.removeTrack(track)
            })
        }

        this.cameraOn.next(!isCameraOn)
    }

    private enableCamera() {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((mediaDevices) =>
                this.localStream.addTrack(mediaDevices.getTracks()[0])
            )
    }

    turnAudio() {
        const isAudioOn = this.audioOn.value
        this.localStream.getAudioTracks()[0].enabled = !isAudioOn
        this.audioOn.next(!isAudioOn)
    }

    closeStream() {
        this.localStream.getTracks().forEach((track) => track.stop())
    }
}
