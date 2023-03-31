import { CommonModule } from '@angular/common'
import { Component, ElementRef, ViewChild } from '@angular/core'
import { SendComponent } from '../../components/send/send.component'
import { ChatService } from '../../services/chat.service'
import { UserService } from '../../services/user.service'

@Component({
    selector: 'app-chat-input',
    standalone: true,
    imports: [CommonModule, SendComponent],
    templateUrl: './chat-input.component.html',
    styleUrls: ['./chat-input.component.scss'],
    host: { class: 'chat-input' },
})
export class ChatInputComponent {
    @ViewChild('messageInput')
    messageInput: ElementRef

    blockSendingMessages: boolean = false

    constructor(
        public chatService: ChatService,
        private userService: UserService
    ) {}

    sendMessage() {
        if (this.blockSendingMessages) {
            return
        }
        this.chatService.sendChatMessage({
            authorIdn: this.userService.userIdn!,
            chatIdn: this.chatService.selectedChatIdn,
            body: this.messageInput.nativeElement.innerHTML,
        })
        this.messageInput.nativeElement.textContent = ''
    }

    onEnterDown(event: Event) {
        event.preventDefault()
    }

    onAppSend() {
        const message = this.messageInput.nativeElement.innerHTML

        if (message === '') {
            return
        }

        const chat = this.chatService.selectedChatSubject.value
        if (!chat.chatIdn) {
            this.blockSendingMessages = true
            this.chatService
                .createChat(chat.users.map((user) => user.idn))
                .subscribe(() => {
                    this.blockSendingMessages = false
                    this.sendMessage()
                })
            return
        }
        this.sendMessage()
    }
}
