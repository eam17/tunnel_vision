import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 //{ path: '', redirectTo: 'home', pathMatch: 'full' },
 { path: '', loadChildren: './login/login.module#LoginPageModule' },
 { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
 { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
 { path: 'image', loadChildren: './image/image.module#ImagePageModule' },  { path: 'info', loadChildren: './info/info.module#InfoPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
