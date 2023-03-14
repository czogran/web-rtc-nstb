import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { RegisterService, UserRegiser } from '../services/register.service'

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
    userForm = new FormGroup({
        name: new FormControl('', Validators.required),
        surname: new FormControl('', Validators.required),
        nickname: new FormControl(''),
        login: new FormControl('', Validators.required),
    })

    constructor(private registerService: RegisterService) {}

    registerUser() {
        if (this.userForm.invalid) {
            return
        }
        this.registerService
            .register(this.userForm.value as UserRegiser)
            .subscribe()
    }
}
