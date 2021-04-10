import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private storage: StorageService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.storage.token
    console.log(authToken)
    if(authToken != "") {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
                    "Bearer " + authToken)
      })
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
