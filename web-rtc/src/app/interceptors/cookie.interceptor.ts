import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { LoginService } from '../services/login.service'

@Injectable()
export class CookieInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (this.loginService.cookie) {
            const cloned = request.clone({
                headers: request.headers.set('Token', this.loginService.cookie),
            })
            return next.handle(cloned)
        }
        return next.handle(request)
    }
}
