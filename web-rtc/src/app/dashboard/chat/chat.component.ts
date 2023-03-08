import { CommonModule, NgOptimizedImage } from '@angular/common'
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core'
import { map, Observable } from 'rxjs'
import { ChatMessage, ChatService } from '../../services/chat.service'
import { MessageComponent } from './message/message.component'

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, MessageComponent],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    host: { class: 'chat' },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {

    constructor(public chatService: ChatService) {}

    ngOnInit(): void {}
}
