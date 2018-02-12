import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { CourseBuilderContentCreatorComponent } from './course-builder-content-creator/course-builder-content-creator.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { CoursesComponent } from './courses/courses.component';
import { CreateCourseTaskComponent } from './create-course-task/create-course-task.component';
import { LessonBuilderContentCreatorComponent } from './lesson-builder-content-creator/lesson-builder-content-creator.component';
import { ContentAdminReviewTaskComponent } from './content-admin-review-task/content-admin-review-task.component';
import { SlideEditorComponent } from './slide-editor/slide-editor.component';


const routes: Routes = [{ path: '', redirectTo: '/login', pathMatch: 'full', canActivate: [AuthGuard] },
{ path: 'login', component: LoginComponent },
{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
{ path: 'course/:id', component: CourseBuilderContentCreatorComponent, canActivate: [AuthGuard] },
{ path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
{ path: 'create_course_task', component: CreateCourseTaskComponent, canActivate: [AuthGuard] },
{ path: 'lesson_builder/:id', component: LessonBuilderContentCreatorComponent, canActivate: [AuthGuard] },
{ path: 'review_task', component: ContentAdminReviewTaskComponent, canActivate: [AuthGuard] },
{ path: 'slide_editor/:id', component: SlideEditorComponent, canActivate: [AuthGuard] }


];
@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule { }
