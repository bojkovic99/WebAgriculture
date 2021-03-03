import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { AdminComponent } from './admin/admin.component';
import { PoljoprivrednikComponent } from './poljoprivrednik/poljoprivrednik.component';
import { PreduzeceComponent } from './preduzece/preduzece.component';
import {FormsModule} from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha'
import {HttpClientModule} from '@angular/common/http';
import { PromenaComponent } from './promena/promena.component';
import { RasadnikComponent } from './rasadnik/rasadnik.component';
import { MagacinComponent } from './magacin/magacin.component';
import { ProdavnicaComponent } from './prodavnica/prodavnica.component';
import { SajtComponent } from './sajt/sajt.component';
import { DijagramComponent } from './dijagram/dijagram.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistracijaComponent,
    AdminComponent,
    PoljoprivrednikComponent,
    PreduzeceComponent,
    PromenaComponent,
    RasadnikComponent,
    MagacinComponent,
    ProdavnicaComponent,
    SajtComponent,
    DijagramComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
