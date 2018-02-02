import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { CourseBuilderContentCreatorComponent } from './course-builder-content-creator/course-builder-content-creator.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { CoursesComponent } from './courses/courses.component';


const routes: Routes = [{ path: '', redirectTo: '/login', pathMatch: 'full', canActivate: [AuthGuard] },
{ path: 'login', component: LoginComponent },
{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
{ path: 'course/:id', component: CourseBuilderContentCreatorComponent, canActivate: [AuthGuard] },
{ path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] }
];
@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule { }
