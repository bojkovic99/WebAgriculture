import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { AdminComponent } from './admin/admin.component';
import { PoljoprivrednikComponent } from './poljoprivrednik/poljoprivrednik.component';
import { PreduzeceComponent } from './preduzece/preduzece.component';
import { PromenaComponent } from './promena/promena.component';
import { RasadnikComponent } from './rasadnik/rasadnik.component';
import { MagacinComponent } from './magacin/magacin.component';
import { ProdavnicaComponent } from './prodavnica/prodavnica.component';
import { SajtComponent } from './sajt/sajt.component';


const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'login', component:LoginComponent},
  {path:'registracija', component:RegistracijaComponent},
  {path:'admin', component:AdminComponent},
  {path:'poljoprivrednik', component:PoljoprivrednikComponent},
  {path:'preduzece', component:PreduzeceComponent},
  {path:'promena', component:PromenaComponent },
  {path:'rasadnik', component:RasadnikComponent},
  {path:'magacin', component:MagacinComponent},
  {path:'prodavnica', component:ProdavnicaComponent},
  {path:'proizvod', component:SajtComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
