import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import {ChatMessage} from "../../../services/chat.service";
import {LoginService} from "../../../services/login.service";
import {UserService} from "../../../services/user.service";

@Component({
    selector: 'app-message',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
    @Input()
    message: ChatMessage
    constructor(public userService: UserService) {}

    ngOnInit(): void {}
}
