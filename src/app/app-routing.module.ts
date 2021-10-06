import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [ 
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'homepage',
    loadChildren: () => import('./homepage/homepage.module').then( m => m.HomepagePageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'feed',
    loadChildren: () => import('./feed/feed.module').then( m => m.FeedPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },   {
    path: 'subject-detail',
    loadChildren: () => import('./subject-detail/subject-detail.module').then( m => m.SubjectDetailPageModule)
  },
  {
    path: 'lectures',
    loadChildren: () => import('./lectures/lectures.module').then( m => m.LecturesPageModule)
  },
  {
    path: 'addlecture',
    loadChildren: () => import('./addlecture/addlecture.module').then( m => m.AddlecturePageModule)
  },
  {
    path: 'enrollments',
    loadChildren: () => import('./enrollments/enrollments.module').then( m => m.EnrollmentsPageModule)
  },
  {
    path: 'extraclass',
    loadChildren: () => import('./exrtraclass/exrtraclass.module').then( m => m.ExrtraclassPageModule)
  },
  {
    path: 'add-extra-class',
    loadChildren: () => import('./add-extra-class/add-extra-class.module').then( m => m.AddExtraClassPageModule)
  },
  {
    path: 'assignments',
    loadChildren: () => import('./assignments/assignments.module').then( m => m.AssignmentsPageModule)
  },
  {
    path: 'add-assignment',
    loadChildren: () => import('./add-assignment/add-assignment.module').then( m => m.AddAssignmentPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'add-question',
    loadChildren: () => import('./add-question/add-question.module').then( m => m.AddQuestionPageModule)
  },
  {
    path: 'list-question',
    loadChildren: () => import('./list-question/list-question.module').then( m => m.ListQuestionPageModule)
  },
  {
    path: 'add-assignment-unit',
    loadChildren: () => import('./add-assignment-unit/add-assignment-unit.module').then( m => m.AddAssignmentUnitPageModule)
  },
  {
    path: 'publish-assignment',
    loadChildren: () => import('./publish-assignment/publish-assignment.module').then( m => m.PublishAssignmentPageModule)
  },
  {
    path: 'add-test',
    loadChildren: () => import('./add-test/add-test.module').then( m => m.AddTestPageModule)
  },
  {
    path: 'add-test-unit',
    loadChildren: () => import('./add-test-unit/add-test-unit.module').then( m => m.AddTestUnitPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
