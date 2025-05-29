import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, Routes } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { LayoutComponent } from './app/layout/layout.component';
import { UniversityPage } from './app/university/university.page';
import { KolhanUniversityPage } from './app/kolhan-university/kolhan-university.page';
// import { AmityUniversityPage } from './app/amity-university/amity-university.page';
// import { SikkimManipalUniversityPage } from './app/sikkim-manipal-university/sikkim-manipal-university.page';
// import { DelhiUniversityPage } from './app/delhi-university/delhi-university.page';

import { AppComponent } from './app/app.component';
import { DashboardPage } from './app/dashboard/dashboard.page';
import { UserPage } from './app/user/user.page';
import { LoginPage } from './app/login/login.page';
import { SikkimManipalUniversityPage } from './app/sikkim-manipal-university/sikkim-manipal-university.page';
import { CoursePage } from './app/course/course.page';
import { SemesterPage } from './app/semester/semester.page';
import { SessionPage } from './app/session/session.page';
import { QuickadmissionPage } from './app/quickadmission/quickadmission.page';
import { SubjectPage } from './app/subject/subject.page';
import { CountryPage } from './app/country/country.page';
import { StatePage } from './app/state/state.page';
import { ElectivePage } from './app/elective/elective.page';
import { SpecialisationPage } from './app/specialisation/specialisation.page';
import { AdminLoginPage } from './app/admin-login/admin-login.page';
import { UserUniversityPage } from './app/user-university/user-university.page';
import { CalculatorPage } from './app/calculator/calculator.page';
import { UniversityRegistrationPage } from './app/university-registration/university-registration.page';
import { DocsPage } from './app/docs/docs.page';
import { DemoPage } from './app/demo/demo.page';
import { PincodePage } from './app/pincode/pincode.page';
import { CityPage } from './app/city/city.page';
import { StudentLoginPage } from './app/student-login/student-login.page';
import { StudentUniversityPage } from './app/student-university/student-university.page';
import { RegisterPage } from './app/register/register.page';
import { OfficeStaffPage } from './app/office-staff/office-staff.page';
import { StatsPage } from './app/stats/stats.page';
import { CourseStructurePage } from './app/course-structure/course-structure.page';
import { FeesPage } from './app/fees/fees.page';
import { ApplyOnlinePage } from './app/apply-online/apply-online.page';
import { AgentPage } from './app/agent/agent.page';
import { AgentLoginPage } from './app/agent-login/agent-login.page';
import { AgentStudentGetallPage } from './app/agent-student-getall/agent-student-getall.page';
import { SubAgentPage } from './app/sub-agent/sub-agent.page';
import { AdminSyllabusPage } from './app/admin-syllabus/admin-syllabus.page';
import { StudentSyllabusPage } from './app/student-syllabus/student-syllabus.page';
import { AdminCourseStructurePage } from './app/admin-course-structure/admin-course-structure.page';
import { AdminQuestionBankPage } from './app/admin-question-bank/admin-question-bank.page';
import { AdminAssignmentPage } from './app/admin-assignment/admin-assignment.page';
import { AdminUniversityQuestionsPage } from './app/admin-university-questions/admin-university-questions.page';
import { StudentQuestionBankPage } from './app/student-question-bank/student-question-bank.page';
import { StudentAssignmentPage } from './app/student-assignment/student-assignment.page';
import { StudentUniversityQuestionsPage } from './app/student-university-questions/student-university-questions.page';
import { WhatsappPage } from './app/whatsapp/whatsapp.page';
import { GeneralModulesPage } from './app/genral-modules/genral-modules.page';
import { AddModulesPage } from './app/add-modules/add-modules.page';
import { AddTablesPage } from './app/add-tables/add-tables.page';
import { CategoryPage } from './app/category/category.page';
import { SubcategoryPage } from './app/subcategory/subcategory.page';
import { TemplatePage } from './app/template/template.page';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  

  { path: 'login', component: LoginPage }, // Redirect to UniversityPage on initial load
  { path: 'admin-login', component: AdminLoginPage }, // Redirect to UniversityPage on initial load
  { path: 'student-login', component: StudentLoginPage }, 
  { path: 'agent-login', component: AgentLoginPage }, // Redirect to UniversityPage on initial load
  // Redirect to UniversityPage on initial load
      { path: 'whatsapp', component: WhatsappPage},

  {path:'demo',component:DemoPage},
  { path: 'university', component: UniversityPage }, 
  { path: 'user-university', component: UserUniversityPage} ,
  { path: 'student-university', component: StudentUniversityPage} ,
  { path: 'register', component: RegisterPage} ,

//  { path: 'genralmodules', component: GenralModulesPage},

     { path: 'sikkim-manipal-university', component: SikkimManipalUniversityPage }, // Sikkim Manipal University page University page
  // Kolhan University page
  // { path: 'amity-university', component: AmityUniversityPage }, // Amity University page
  // { path: 'sikkim-manipal-university', component: SikkimManipalUniversityPage }, // Sikkim Manipal University page
  // { path: 'delhi-university', component: DelhiUniversityPage }, // Delhi University page
  {
    path: '',
    component: LayoutComponent, // Wrap the layout for the rest of the app
    children: [
      
      { path: 'dashboard', component: DashboardPage },
      { path: 'kolhan-university/:id', component: KolhanUniversityPage } ,
      { path: 'user', component: UserPage }, 
      { path: 'docs', component: DocsPage }, 
      { path: 'pincode', component: PincodePage }, 
      { path: 'city', component: CityPage }, 
      { path: 'agent-register', component: RegisterPage} ,

      { path: 'calculator', component: CalculatorPage }, 
      { path: 'university-registration', component: UniversityRegistrationPage }, 
  { path: 'office-staff', component: OfficeStaffPage} ,

  { path: 'stats', component: StatsPage} ,

      { path: 'course', component: CoursePage } ,
      { path: 'semester', component: SemesterPage } ,
      { path: 'session', component: SessionPage } ,
      { path: 'quickadmission', component: QuickadmissionPage } ,
      { path: 'subject', component: SubjectPage } ,
      { path: 'country', component: CountryPage } ,
      { path: 'state', component: StatePage } ,
      { path: 'elective', component: ElectivePage} ,
      { path: 'specialisation', component: SpecialisationPage} ,
      { path: 'course-structure', component: CourseStructurePage} ,
      { path: 'fees', component: FeesPage},
      { path: 'apply-online', component: ApplyOnlinePage} ,
      { path: 'agent', component: AgentPage} ,

      { path: 'agent-student-getall', component: AgentStudentGetallPage} ,

      { path: 'sub-agent', component: SubAgentPage} ,
      { path: 'admin-syllabus', component: AdminSyllabusPage} ,
      { path: 'student-syllabus', component: StudentSyllabusPage} ,
      { path: 'admin-course-structure', component: AdminCourseStructurePage} ,
      { path: 'admin-question-bank', component: AdminQuestionBankPage},
      { path: 'admin-assignment', component: AdminAssignmentPage},
      { path: 'admin-university-question', component: AdminUniversityQuestionsPage},
      { path: 'student-question-bank', component: StudentQuestionBankPage},
      { path: 'student-assignment', component: StudentAssignmentPage},
      { path: 'student-university-questions', component: StudentUniversityQuestionsPage},






     



       

    


      
      // Add more routes inside this component if needed, like Admin Dashboard, etc.
    ],
  },


   {
      path: 'whatsapp',
      component: WhatsappPage,
      children: [
        {
          path: 'genralmodules',
          component: GeneralModulesPage
        },


        {
          path: 'addmodules',
          component: AddModulesPage
        },

          {
          path: 'addtables',
          component: AddTablesPage
        },

          {
          path: 'category',
          component: CategoryPage
        },

          {
          path: 'subcategory',
          component: SubcategoryPage
        },
         {
          path: 'template',
          component:TemplatePage
        }
      ]
    }
];

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
