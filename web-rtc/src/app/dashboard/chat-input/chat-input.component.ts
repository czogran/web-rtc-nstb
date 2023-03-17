import { CommonModule } from '@angular/common'
import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core'
import { SendComponent } from '../../components/send/send.component'
import { ChatService } from '../../services/chat.service'
import {LoginService} from "../../services/login.service";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-chat-input',
    standalone: true,
    imports: [CommonModule, SendComponent],
    templateUrl: './chat-input.component.html',
    styleUrls: ['./chat-input.component.scss'],
    host: { class: 'chat-input' },
    encapsulation: ViewEncapsulation.None,
})
export class ChatInputComponent implements OnInit {
    @ViewChild('messageInput')
    messageInput: ElementRef

    constructor(public chatService: ChatService, private userService: UserService) {}
    text: string = ''
    ngOnInit(): void {}

    test(event: any) {
        console.log(event)
    }

    sendMessage() {
        this.chatService.sendChatMessage({
            authorIdn: this.userService.userIdn!,
            chatIdn: this.chatService.selectedChatSubject.value.chatIdn,
            body: this.messageInput.nativeElement.textContent,
        })
        this.messageInput.nativeElement.textContent = ''
    }

    onEnterDown(event: Event) {
        event.preventDefault()
    }
}
