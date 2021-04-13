import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login.component';
import { SignupComponent } from './auth/signup.component'
import { LogoutComponent } from './auth/logout.component'
import { Routes, RouterModule } from '@angular/router';

import { BoardComponent } from './board/board.component';
import { BoardDetailComponent } from './board/board-detail.component';
import { ColumnComponent } from './board/column.component';

import { UserGuard } from './user.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
import {MaterialModule} from './material.module';

import { DragulaModule } from 'ng2-dragula';
import { CardComponent } from './board/card.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditCardComponent } from './board/edit-card.component';

const routes: Routes = [
  { path: '' , component: BoardComponent },
  { path: 'login' , component: LoginComponent },
  { path: 'signup' , component: SignupComponent },
  { path: 'logout' , component: LogoutComponent },
  {
    path: 'boards/:id', component: BoardDetailComponent, canActivate: [UserGuard]
  },
  {
    path: 'boards', component: BoardComponent, canActivate: [UserGuard]
  }
]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LogoutComponent,
    BoardComponent,
    BoardDetailComponent,
    ColumnComponent,
    CardComponent,
    EditCardComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDialogModule,
    MaterialModule,
    FlexLayoutModule,
    DragulaModule.forRoot()
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
