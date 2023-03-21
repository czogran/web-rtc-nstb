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
import { User, UserService } from './user.service'

@Injectable({
    providedIn: 'root',
})
export class ChatService implements OnDestroy {
    public selectedChatSubject: BehaviorSubject<ChatProfile> =
        new BehaviorSubject<ChatProfile>({ users: [] })
    public selectedChatObservale: Observable<ChatProfile> =
        this.selectedChatSubject.asObservable().pipe(shareReplay(1))

    private ws: WebSocketSubject<any>
    private wsSubscription: Subscription

    messagesSubject: Subject<ChatMessage> = new Subject<ChatMessage>()
    messagesObservable: Observable<ChatMessage[]>

    private messages: Map<string, ChatMessage[]> = new Map()

    public selectedChatIdn: string

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService
    ) {
        this.activatedRoute.queryParams.subscribe(
            (params) => (this.selectedChatIdn = params['chatIdn'])
        )

        this.ws = webSocket({
            url: apiUrl.chat,
            deserializer: (msg) => msg,
            binaryType: 'arraybuffer',
        })

        this.ws.next({ type: 'CONNECT', userIdn: this.userService.userIdn })

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
                if (!this.messages.has(this.selectedChatIdn)) {
                    this.messages.set(this.selectedChatIdn, [])
                }
                if (message === null) {
                    return this.messages.get(this.selectedChatIdn)
                }
                this.messages.get(this.selectedChatIdn).push(message)

                return this.messages.get(this.selectedChatIdn)
            }),
            shareReplay(1)
        )
    }

    sendChatMessage(message: ChatMessage) {
        this.ws.next(message)
    }

    getUserChats(): Observable<ChatProfile[]> {
        return this.httpClient
            .post(apiUrl.userChats, { userIdn: this.userService.userIdn })
            .pipe(
                map(
                    (respnose) =>
                        (respnose as { chats: ChatProfile[] })?.chats ?? []
                ),
                tap((chats) => {
                    const selectedChat =
                        chats.find(
                            (userChat) =>
                                userChat.chatIdn === this.selectedChatIdn
                        ) ||
                        chats[0] ||
                        {}
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
    }

    selectChat(chatProfile: ChatProfile) {
        this.selectedChatSubject.next(chatProfile)
        this.selectedChatIdn = chatProfile.chatIdn

        this.messagesSubject.next(null)

        this.setSelectedChatQueryParam(chatProfile.chatIdn || '')
    }

    setSelectedChatQueryParam(chatIdn: string) {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { chatIdn: chatIdn },
            queryParamsHandling: 'merge',
        })
    }

    createChat(userIdns: string[]): Observable<ChatProfile> {
        return this.httpClient
            .post(apiUrl.createChat, { userIdns: userIdns })
            .pipe(
                map((response) => response as ChatProfile),
                tap((chat) => this.selectedChatSubject.next(chat))
            )
    }

    ngOnDestroy(): void {
        this.wsSubscription.unsubscribe()
    }
}

export interface ChatProfile {
    chatIdn?: string
    chatName?: string
    users?: User[]
}

export interface ChatMessage {
    authorIdn?: string
    chatIdn?: string
    body: any
}
