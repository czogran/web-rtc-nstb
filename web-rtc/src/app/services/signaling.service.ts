import { Injectable, NgZone } from '@angular/core'
import { map, Observable } from 'rxjs'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { apiUrl } from '../../environments/url'
import { MediaService } from './media.service'

@Injectable()
export class SignalingService {
    servers: RTCConfiguration = {
        iceServers: [
            {
                urls: [
                    'stun:stun.l.google.com:19302',
                    // 'stun:stun1.l.google.com:19302',
                    // 'stun:stun2.l.google.com:19302',
                ],
            },
        ],
    }
    private ws: WebSocketSubject<any>
    private peerConnection: RTCPeerConnection

    private offer: RTCSessionDescriptionInit
    private answer: RTCSessionDescriptionInit

    constructor(private zone: NgZone, private mediaService: MediaService) {
        this.createWebsocket()
        this.websockerMessageManager()
    }

    async createCall() {
        await this.createPeer()
        await this.createOffer()
    }

    private createWebsocket() {
        this.ws = webSocket({
            url: apiUrl.signaling,
            deserializer: (msg) => msg,
            binaryType: 'arraybuffer',
        })
    }

    private signalMessageListener(): Observable<SignalingMessage> {
        return this.ws
            .asObservable()
            .pipe(map((message) => JSON.parse(message.data)))
    }

    private websockerMessageManager() {
        this.zone.runOutsideAngular(() => {
            this.signalMessageListener().subscribe((data) => {
                switch (data.type) {
                    case SignalType.OFFER:
                        const offer = new RTCSessionDescription(data.body)
                        this.onOffer(offer)
                        this.iceServer()

                        break
                    case SignalType.ANSWER:
                        const sessionDescrition = new RTCSessionDescription(
                            data.body
                        )
                        this.peerConnection.setRemoteDescription(
                            sessionDescrition
                        )
                        this.iceServer()

                        break
                    case SignalType.ICE_CANDIDATE:
                        const iceCandidate = new RTCIceCandidate(data.body)
                        this.peerConnection.addIceCandidate(iceCandidate)
                        break
                }
            })
        })
    }

    private sendSignalingMessage(message: SignalingMessage) {
        this.ws.next(message)
    }

    private async createPeer() {
        this.createPeerConnection()
        await this.mediaService.createLocalStream()
        this.addLocalMediaTracks()
        this.addRemotMedia()
        // this.iceServer()
    }

    private createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(this.servers)
        this.peerConnection.onconnectionstatechange = (_) => {
            console.log(this.peerConnection.connectionState)
            // this.connectionStatus.next(this.peerConnection.connectionState)
            // this.changeDetectorRef.detectChanges()
        }
    }

    private addLocalMediaTracks() {
        this.mediaService.localStream
            .getTracks()
            .forEach((track) =>
                this.peerConnection.addTrack(
                    track,
                    this.mediaService.localStream
                )
            )
    }

    private addRemotMedia() {
        this.mediaService.addRemoteMediaStream('aa')

        this.peerConnection.ontrack = (event) => {
            event.streams[0]
                .getTracks()
                .forEach((track) =>
                    this.mediaService.addRemoteTrack('aa', track)
                )
        }
    }

    private iceServer() {
        this.peerConnection.onicecandidate = async (event) => {
            console.log(event)
            if (!event.candidate) {
                return
            }
            this.sendSignalingMessage({
                type: SignalType.ICE_CANDIDATE,
                body: event.candidate,
            })
        }
    }

    private async createOffer() {
        this.offer = await this.peerConnection.createOffer()
        await this.peerConnection.setLocalDescription(this.offer)
        this.sendSignalingMessage({
            type: SignalType.OFFER,
            body: this.offer,
        })
    }

    private async onOffer(offer: RTCSessionDescriptionInit) {
        await this.createPeer()
        await this.peerConnection.setRemoteDescription(offer)

        this.answer = await this.peerConnection.createAnswer()
        await this.peerConnection.setLocalDescription(this.answer)
        this.sendSignalingMessage({
            type: SignalType.ANSWER,
            body: this.answer,
        })
    }

    endConnection() {
        this.peerConnection.close()
    }
}

export enum SignalType {
    OFFER = 'OFFER',
    ANSWER = 'ANSWER',
    ICE_CANDIDATE = 'ICE_CANDIDATE',
}
export interface SignalingMessage {
    type: SignalType
    body: any
}
