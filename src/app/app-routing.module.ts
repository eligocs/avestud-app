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
  },
  {
    path: 'verifyotp',
    loadChildren: () => import('./verifyotp/verifyotp.module').then( m => m.VerifyotpPageModule)
  },
  {
    path: 'studenthome',
    loadChildren: () => import('./studenthome/studenthome.module').then( m => m.StudenthomePageModule)
  },
  {
    path: 'searchclass',
    loadChildren: () => import('./searchclass/searchclass.module').then( m => m.SearchclassPageModule)
  },
  {
    path: 'subject-detail-student',
    loadChildren: () => import('./subject-detail-student/subject-detail-student.module').then( m => m.SubjectDetailStudentPageModule)
  },
  {
    path: 'selecttimings',
    loadChildren: () => import('./selecttimings/selecttimings.module').then( m => m.SelecttimingsPageModule)
  },
  {
    path: 's-lectures',
    loadChildren: () => import('./s-lectures/s-lectures.module').then( m => m.SLecturesPageModule)
  },
  {
    path: 's-assignments',
    loadChildren: () => import('./s-assignments/s-assignments.module').then( m => m.SAssignmentsPageModule)
  },
  {
    path: 'startassignment',
    loadChildren: () => import('./startassignment/startassignment.module').then( m => m.StartassignmentPageModule)
  },
  {
    path: 'doubts',
    loadChildren: () => import('./doubts/doubts.module').then( m => m.DoubtsPageModule)
  },
  {
    path: 'doubt-messages',
    loadChildren: () => import('./doubt-messages/doubt-messages.module').then( m => m.DoubtMessagesPageModule)
  },
  {
    path: 'view-attendance',
    loadChildren: () => import('./view-attendance/view-attendance.module').then( m => m.ViewAttendancePageModule)
  },
  {
    path: 's-extraclasses',
    loadChildren: () => import('./s-extraclasses/s-extraclasses.module').then( m => m.SExtraclassesPageModule)
  }, 
  {
    path: 'student-doubts',
    loadChildren: () => import('./student-doubts/student-doubts.module').then( m => m.StudentDoubtsPageModule)
  },
  {
    path: 's-test',
    loadChildren: () => import('./s-test/s-test.module').then( m => m.STestPageModule)
  },
  {
    path: 'lec-unit',
    loadChildren: () => import('./lec-unit/lec-unit.module').then( m => m.LecUnitPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'newpassword',
    loadChildren: () => import('./newpassword/newpassword.module').then( m => m.NewpasswordPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
  },
  {
    path: 'starttest',
    loadChildren: () => import('./starttest/starttest.module').then( m => m.StarttestPageModule)
  },
  {
    path: 'changetime',
    loadChildren: () => import('./changetime/changetime.module').then( m => m.ChangetimePageModule)
  },
  {
    path: 'recipt-student',
    loadChildren: () => import('./recipt-student/recipt-student.module').then( m => m.ReciptStudentPageModule)
  },
  {
    path: 'attendance',
    loadChildren: () => import('./attendance/attendance.module').then( m => m.AttendancePageModule)
  },
  {
    path: 'extra-notes',
    loadChildren: () => import('./extra-notes/extra-notes.module').then( m => m.ExtraNotesPageModule)
  },
  {
    path: 'student-extra-notes',
    loadChildren: () => import('./student-extra-notes/student-extra-notes.module').then( m => m.StudentExtraNotesPageModule)
  },
  {
    path: 'demovideo',
    loadChildren: () => import('./demovideo/demovideo.module').then( m => m.DemovideoPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
