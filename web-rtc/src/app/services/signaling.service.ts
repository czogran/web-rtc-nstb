import { Injectable, NgZone } from '@angular/core'
import { map, Observable, Subject } from 'rxjs'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { apiUrl } from '../../environments/url'
import { isNullOrUndefined } from '../utils/utils'
import { VideoService } from '../video/video.service'
import { ChatService } from './chat.service'
import { MediaService } from './media.service'
import { UserService } from './user.service'

@Injectable({
    providedIn: 'root',
})
export class SignalingService {
    private servers: RTCConfiguration = {
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

    private callStatus: Subject<SignalType> = new Subject<SignalType>()

    callStatusObservable = this.callStatus.asObservable()
    private iceMessages: any[] = []

    constructor(
        private zone: NgZone,
        private mediaService: MediaService,
        private videoService: VideoService,
        private chatService: ChatService,
        private userService: UserService
    ) {
        this.createWebsocket()
        this.websockerMessageManager()
    }

    async createCall(video: boolean = true, audio: boolean = true) {
        await this.createPeer(video, audio)
        await this.createOffer(video)
    }

    private createWebsocket() {
        this.ws = webSocket({
            url: apiUrl.signaling,
            deserializer: (msg) => msg,
            binaryType: 'arraybuffer',
        })

        this.ws.next({ type: 'CONNECT', userIdn: this.userService.userIdn })
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
                        this.videoService.joinVideoCall()
                        this.onOffer(data).then()
                        if (this.iceMessages.length) {
                            this.iceMessages.forEach((iceMessage) => {
                                const iceCandidate = new RTCIceCandidate(
                                    iceMessage
                                )
                                this.peerConnection.addIceCandidate(
                                    iceCandidate
                                )
                            })
                        }
                        this.iceServer()

                        break
                    case SignalType.ANSWER:
                        const sessionDescrition = new RTCSessionDescription(
                            data.body
                        )
                        this.peerConnection
                            .setRemoteDescription(sessionDescrition)
                            .then()
                        console.log('ANSWER')

                        break
                    case SignalType.ICE_CANDIDATE:
                        if (isNullOrUndefined(this.peerConnection)) {
                            this.iceMessages.push(data.body)
                            return
                        }
                        const iceCandidate = new RTCIceCandidate(data.body)
                        this.peerConnection.addIceCandidate(iceCandidate)
                        break
                    case SignalType.END:
                        this.peerConnection.close()
                        this.mediaService.closeStream()
                        this.callStatus.next(SignalType.END)
                        this.ws.complete()
                        break
                }
            })
        })
    }

    private sendSignalingMessage(
        type: SignalType,
        body: unknown,
        video: boolean = null
    ) {
        // Na razie jest tylko dla jednego użytkownika
        const message: SignalingMessage = {
            type: type,
            body: body,
            video: video,
            chatIdn: this.chatService.selectedChatIdn,
            recipentIdn: this.chatService.selectedChatSubject.value.users.find(
                (user) => user.idn !== this.userService.userIdn
            ).idn,
        }
        this.ws.next(message)
    }

    private async createPeer(video: boolean = true, audio: boolean = true) {
        this.createPeerConnection()
        await this.mediaService.createLocalStream(video, audio)
        this.addLocalMediaTracks()
        this.addRemotMedia()
    }

    private createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(this.servers)
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
        const userIdn = this.chatService.selectedChatSubject.value.users[0].idn
        this.mediaService.addRemoteMediaStream(userIdn)

        this.peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                this.mediaService.addRemoteTrack(userIdn, track)
            })
        }
    }

    private iceServer() {
        this.peerConnection.onicecandidate = async (event) => {
            console.log(event)
            if (!event.candidate) {
                return
            }
            this.sendSignalingMessage(SignalType.ICE_CANDIDATE, event.candidate)
        }
    }

    private async createOffer(video: boolean = true) {
        this.offer = await this.peerConnection.createOffer()
        await this.peerConnection.setLocalDescription(this.offer)
        this.sendSignalingMessage(SignalType.OFFER, this.offer, video)
        this.iceServer()
    }

    private async onOffer(data: SignalingMessage) {
        const offer = new RTCSessionDescription(data.body)

        await this.createPeer(data.video)
        await this.peerConnection.setRemoteDescription(offer)

        this.answer = await this.peerConnection.createAnswer()
        await this.peerConnection.setLocalDescription(this.answer)
        this.sendSignalingMessage(SignalType.ANSWER, this.answer)
    }

    endConnection() {
        this.peerConnection.close()
        this.sendSignalingMessage(SignalType.END, {})
    }
}

export enum SignalType {
    OFFER = 'OFFER',
    ANSWER = 'ANSWER',
    ICE_CANDIDATE = 'ICE_CANDIDATE',
    END = 'END',
}

export interface SignalingMessage {
    type: SignalType
    body: any
    video?: boolean
    chatIdn: string
    userIdn?: string
    recipentIdn?: string
}
