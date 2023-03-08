import { HttpClient } from '@angular/common/http'
import { Injectable, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
    BehaviorSubject,
    map,
    Observable,
    shareReplay,
    Subject,
    Subscription,
    tap,
} from 'rxjs'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { apiUrl } from '../../environments/url'
import {User} from "./user.service";

@Injectable({
    providedIn: 'root',
})
export class ChatService implements OnDestroy {
    public selectedChatSubject: BehaviorSubject<ChatProfile> =
        new BehaviorSubject<ChatProfile>({ users: [] })
    public selectedChatObservale: Observable<ChatProfile> =
        this.selectedChatSubject.asObservable().pipe(shareReplay(1))

    url: string = apiUrl.chat
    private ws: WebSocketSubject<any>
    private wsSubscription: Subscription

    messagesSubject: Subject<ChatMessage> = new Subject<ChatMessage>()
    messagesObservable: Observable<ChatMessage[]>
    private messages: ChatMessage[] = []

    availableChatProfilesSubject: Subject<ChatProfile[]> = new Subject()
    availableChatProfilesObservable: Observable<ChatProfile[]> =
        this.availableChatProfilesSubject.asObservable()
    private selectedChatIdn: string

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.selectedChatIdn = params['chatIdn']
            console.log(this.selectedChatIdn)
            // this.selectedChatSubject.next(this.selectedChat)
        })

        this.ws = webSocket({
            url: apiUrl.chat,
            deserializer: (msg) => msg,
            binaryType: 'arraybuffer',
        })
        this.wsSubscription = this.ws
            .pipe(
                tap((response) => {
                    const message = JSON.parse(response.data)
                    this.messagesSubject.next(message)
                })
            )
            .subscribe()

        this.messagesObservable = this.messagesSubject.asObservable().pipe(
            map((message) => {
                this.messages.push(message)
                return this.messages
            }),
            shareReplay(1)
        )
    }

    sendChatMessage(message: ChatMessage) {
        this.messagesSubject.next(message)
        this.ws.next(message)
    }

    getUserChats() {
        return this.httpClient
            .post(apiUrl.userChats, {})
            .pipe(
                map(
                    (respnose) =>
                        (respnose as { chats: ChatProfile[] })?.chats ?? []
                ),
                tap((chats) => {
                    this.availableChatProfilesSubject.next(chats)

                    const selectedChat =
                        chats.find(
                            (userChat) =>
                                userChat.chatIdn === this.selectedChatIdn
                        ) || chats[0]
                    this.selectedChatSubject.next(selectedChat)
                    if (
                        this.selectedChatIdn === null ||
                        this.selectedChatIdn === undefined
                    ) {
                        this.setSelectedChatQueryParam(
                            selectedChat.chatIdn || ''
                        )
                    }
                })
            )
            .subscribe()
    }

    ngOnDestroy(): void {
        this.wsSubscription.unsubscribe()
    }

    selectChat(chatProfile: ChatProfile) {
        this.selectedChatSubject.next(chatProfile)

        this.setSelectedChatQueryParam(chatProfile.chatIdn || '')
    }

    setSelectedChatQueryParam(chatIdn: string) {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { chatIdn: chatIdn },
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
    }
}

export interface ChatProfile {
    chatIdn?: string
    chatName?: string
    users?: User[]
}



export interface ChatMessage {
    authorIdn?: string
    recipentIdn?: string
    body: any
}
