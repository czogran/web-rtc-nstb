import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { LoginService } from '../services/login.service'

@Component({
    selector: 'app-login-page',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
    host: { class: 'login-page' },
})
export class LoginPageComponent {
    @ViewChild('input')
    input: ElementRef

    wrongLogin: Subject<boolean> = new Subject<boolean>()

    constructor(
        private loginService: LoginService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    submitInput() {
        const login = this.input.nativeElement.value

        this.loginService.login(login).subscribe({
            next: () =>
                this.router.navigate(['/dashboard'], {
                    relativeTo: this.activatedRoute,
                }),
            error: () => {
                this.wrongLogin.next(true)
            },
        })
    }
}
