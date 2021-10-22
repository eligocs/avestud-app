import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubjectDetailStudentPage } from './subject-detail-student.page';

describe('SubjectDetailStudentPage', () => {
  let component: SubjectDetailStudentPage;
  let fixture: ComponentFixture<SubjectDetailStudentPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectDetailStudentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectDetailStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
