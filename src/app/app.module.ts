import { ContextMenuModule } from 'ngx-contextmenu';
import { AppConfiguration } from './app.constants';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { AuthGuard } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldErrorDisplayComponent } from './field-error-display/field-error-display.component';
import { AuthService } from './services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardContentCreatorComponent } from './dashboard-content-creator/dashboard-content-creator.component';
import { CourseBuilderContentCreatorComponent } from './course-builder-content-creator/course-builder-content-creator.component';
import { LessonBuilderContentCreatorComponent } from './lesson-builder-content-creator/lesson-builder-content-creator.component';
import { SlickModule } from 'ngx-slick';
import { DashboardContentAdminComponent } from './dashboard-content-admin/dashboard-content-admin.component';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DndModule } from 'ng2-dnd';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { GraphComponent } from './graph/graph.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FieldErrorDisplayComponent,
    DashboardComponent,
    NavbarComponent,
    DashboardContentCreatorComponent,
    CourseBuilderContentCreatorComponent,
    LessonBuilderContentCreatorComponent,
    DashboardContentAdminComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule, DropzoneModule, NgbModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule, SlickModule.forRoot(), DndModule.forRoot(), ContextMenuModule.forRoot(), Ng2GoogleChartsModule
  ],
  providers: [AuthService, AuthGuard, AppConfiguration],
  bootstrap: [AppComponent]
})


export class AppModule { }
