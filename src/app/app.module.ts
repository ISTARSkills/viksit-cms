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
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DndModule } from 'ng2-dnd';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: AppConfiguration.ServerWithApiUrl + 'image/upload',
  method: 'POST',
  maxFilesize: 50,
  maxFiles: 1,
  createImageThumbnails: true,
  acceptedFiles: 'image/*',
  paramName: 'file',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FieldErrorDisplayComponent,
    DashboardComponent,
    NavbarComponent,
    DashboardContentCreatorComponent,
    CourseBuilderContentCreatorComponent,
    LessonBuilderContentCreatorComponent
  ],
  imports: [
    BrowserModule, DropzoneModule, NgbModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule, SlickModule.forRoot(), DndModule.forRoot()
  ],
  providers: [AuthService, AuthGuard, AppConfiguration, {
    provide: DROPZONE_CONFIG,
    useValue: DEFAULT_DROPZONE_CONFIG
  }],
  bootstrap: [AppComponent]
})


export class AppModule { }
