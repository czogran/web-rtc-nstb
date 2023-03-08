import { CommonModule } from '@angular/common'
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ChatNamePipe } from '../../pipes/chat-name.pipe'
import { ChatProfile, ChatService } from '../../services/chat.service'
import { LoginService } from '../../services/login.service'
import { UserService } from '../../services/user.service'

@Component({
    selector: 'app-users-menu',
    standalone: true,
    imports: [CommonModule, ChatNamePipe],
    templateUrl: './users-menu.component.html',
    styleUrls: ['./users-menu.component.scss'],
    host: { class: 'users-menu' },
    encapsulation: ViewEncapsulation.None,
})
export class UsersMenuComponent {
    constructor(
        public chatService: ChatService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public userService: UserService,
        private loginService: LoginService
    ) {
        this.chatService.getUserChats()
    }

    selectPeer(chatProfile: ChatProfile) {
        this.chatService.selectChat(chatProfile)
    }

    logout() {
        this.loginService.logout()
    }
}
