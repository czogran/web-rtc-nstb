import { CommonModule, NgOptimizedImage } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ChatService } from '../../services/chat.service'
import { MessageComponent } from './message/message.component'

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, MessageComponent],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    host: { class: 'chat' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
    constructor(public chatService: ChatService) {}
}
