import { Injectable, TemplateRef } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class ToastVisibilityService {
    isToastOpen: Subject<ToastMessage> = new Subject()
    constructor() {}

    openToast(templateRef: TemplateRef<any>) {
        this.isToastOpen.next({ isOpen: true, template: templateRef })
    }
}

export interface ToastMessage {
    isOpen: boolean
    template: TemplateRef<any>
}
