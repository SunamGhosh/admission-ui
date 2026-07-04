import { Routes } from '@angular/router';
import { isLoggedInGuard } from './guards/is-logged-in.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'fronthomepage',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage),
    canActivate:[isLoggedInGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'university',
    loadComponent: () => import('./university/university.page').then( m => m.UniversityPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'kolhan-university',
    loadComponent: () => import('./kolhan-university/kolhan-university.page').then( m => m.KolhanUniversityPage)
  },
  {
    path: 'user',
    loadComponent: () => import('./user/user.page').then( m => m.UserPage)
  },
  {
    path: 'sikkim-manipal-university',
    loadComponent: () => import('./sikkim-manipal-university/sikkim-manipal-university.page').then( m => m.SikkimManipalUniversityPage)
  },
  {
    path: 'universities',
    loadComponent: () => import('./universities/universities.page').then( m => m.UniversitiesPage)
  },
  {
    path: 'course',
    loadComponent: () => import('./course/course.page').then( m => m.CoursePage)
  },
  {
    path: 'semester',
    loadComponent: () => import('./semester/semester.page').then( m => m.SemesterPage)
  },
  {
    path: 'session',
    loadComponent: () => import('./session/session.page').then( m => m.SessionPage)
  },
  {
    path: 'quickadmission',
    loadComponent: () => import('./quickadmission/quickadmission.page').then( m => m.QuickadmissionPage)
  },
  {
    path: 'subject',
    loadComponent: () => import('./subject/subject.page').then( m => m.SubjectPage)
  },
  {
    path: 'country',
    loadComponent: () => import('./country/country.page').then( m => m.CountryPage)
  },
  {
    path: 'state',
    loadComponent: () => import('./state/state.page').then( m => m.StatePage)
  },
  {
    path: 'elective',
    loadComponent: () => import('./elective/elective.page').then( m => m.ElectivePage)
  },
  {
    path: 'specialisation',
    loadComponent: () => import('./specialisation/specialisation.page').then( m => m.SpecialisationPage)
  },
  {
    path: 'admin-login',
    loadComponent: () => import('./admin-login/admin-login.page').then( m => m.AdminLoginPage)
  },
  {
    path: 'user-university',
    loadComponent: () => import('./user-university/user-university.page').then( m => m.UserUniversityPage)
  },
  {
    path: 'calculator',
    loadComponent: () => import('./calculator/calculator.page').then( m => m.CalculatorPage)
  },
  {
    path: 'university-registration',
    loadComponent: () => import('./university-registration/university-registration.page').then( m => m.UniversityRegistrationPage)
  },
  {
    path: 'docs',
    loadComponent: () => import('./docs/docs.page').then( m => m.DocsPage)
  },
  {
    path: 'office',
    loadComponent: () => import('./office/office.page').then( m => m.OfficePage)
  },
  {
    path: 'demo',
    loadComponent: () => import('./demo/demo.page').then( m => m.DemoPage)
  },
  {
    path: 'pincode',
    loadComponent: () => import('./pincode/pincode.page').then( m => m.PincodePage)
  },
  {
    path: 'city',
    loadComponent: () => import('./city/city.page').then( m => m.CityPage)
  },
  {
    path: 'student-login',
    loadComponent: () => import('./student-login/student-login.page').then( m => m.StudentLoginPage)
  },
  {
    path: 'student-university',
    loadComponent: () => import('./student-university/student-university.page').then( m => m.StudentUniversityPage)
  },
  {
    path: 'office-staff',
    loadComponent: () => import('./office-staff/office-staff.page').then( m => m.OfficeStaffPage)
  },
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats.page').then( m => m.StatsPage)
  },
  {
    path: 'course-structure',
    loadComponent: () => import('./course-structure/course-structure.page').then( m => m.CourseStructurePage)
  },
  {
    path: 'fees',
    loadComponent: () => import('./fees/fees.page').then( m => m.FeesPage)
  },
  {
    path: 'apply-online',
    loadComponent: () => import('./apply-online/apply-online.page').then( m => m.ApplyOnlinePage)
  },
  {
    path: 'agent',
    loadComponent: () => import('./agent/agent.page').then( m => m.AgentPage)
  },
  {
    path: 'agent-login',
    loadComponent: () => import('./agent-login/agent-login.page').then( m => m.AgentLoginPage)
  },
  {
    path: 'agent-student-getall',
    loadComponent: () => import('./agent-student-getall/agent-student-getall.page').then( m => m.AgentStudentGetallPage)
  },
  {
    path: 'sub-agent',
    loadComponent: () => import('./sub-agent/sub-agent.page').then( m => m.SubAgentPage)
  },
  {
    path: 'admin-syllabus',
    loadComponent: () => import('./admin-syllabus/admin-syllabus.page').then( m => m.AdminSyllabusPage)
  },
  {
    path: 'student-syllabus',
    loadComponent: () => import('./student-syllabus/student-syllabus.page').then( m => m.StudentSyllabusPage)
  },
  {
    path: 'admin-course-structure',
    loadComponent: () => import('./admin-course-structure/admin-course-structure.page').then( m => m.AdminCourseStructurePage)
  },
  {
    path: 'admin-question-bank',
    loadComponent: () => import('./admin-question-bank/admin-question-bank.page').then( m => m.AdminQuestionBankPage)
  },
  {
    path: 'admin-assignment',
    loadComponent: () => import('./admin-assignment/admin-assignment.page').then( m => m.AdminAssignmentPage)
  },
  {
    path: 'admin-university-questions',
    loadComponent: () => import('./admin-university-questions/admin-university-questions.page').then( m => m.AdminUniversityQuestionsPage)
  },
  {
    path: 'student-assignment',
    loadComponent: () => import('./student-assignment/student-assignment.page').then( m => m.StudentAssignmentPage)
  },
  {
    path: 'student-question-bank',
    loadComponent: () => import('./student-question-bank/student-question-bank.page').then( m => m.StudentQuestionBankPage)
  },
  {
    path: 'student-university-questions',
    loadComponent: () => import('./student-university-questions/student-university-questions.page').then( m => m.StudentUniversityQuestionsPage)
  },
 
 {
  path: 'whatsapp',
  loadComponent: () => import('./whatsapp/whatsapp.page').then(m => m.WhatsappPage),
  children: [
    {
      path: 'genralmodules',
      loadComponent: () => import('./genral-modules/genral-modules.page').then(m => m.GeneralModulesPage)
    }
  ]
},
  {
    path: 'add-modules',
    loadComponent: () => import('./add-modules/add-modules.page').then( m => m.AddModulesPage)
  },
  {
    path: 'add-tables',
    loadComponent: () => import('./add-tables/add-tables.page').then( m => m.AddTablesPage)
  },
  {
    path: 'category',
    loadComponent: () => import('./category/category.page').then( m => m.CategoryPage)
  },
  {
    path: 'subcategory',
    loadComponent: () => import('./subcategory/subcategory.page').then( m => m.SubcategoryPage)
  },
  {
    path: 'template',
    loadComponent: () => import('./template/template.page').then( m => m.TemplatePage)
  },
  {
    path: 'variables',
    loadComponent: () => import('./variables/variables.page').then( m => m.VariablesPage)
  },
  {
    path: 'url',
    loadComponent: () => import('./url/url.page').then( m => m.URLPage)
  },
  {
    path: 'field',
    loadComponent: () => import('./field/field.page').then( m => m.FieldPage)
  },
  {
    path: 'give-access',
    loadComponent: () => import('./give-access/give-access.page').then( m => m.GiveAccessPage)
  },
  {
    path: 'student-learn-english',
    loadComponent: () => import('./student-learn-english/student-learn-english.page').then( m => m.StudentLearnEnglishPage)
  },
  {
    path: 'chapter',
    loadComponent: () => import('./chapter/chapter.page').then( m => m.ChapterPage)
  },  {
    path: 'faculty',
    loadComponent: () => import('./faculty/faculty.page').then( m => m.FacultyPage)
  },
  {
    path: 'department-master',
    loadComponent: () => import('./department-master/department-master.page').then( m => m.DepartmentMasterPage)
  },
  {
    path: 'faculty-login',
    loadComponent: () => import('./faculty-login/faculty-login.page').then( m => m.FacultyLoginPage)
  },
  {
    path: 'faculty-master',
    loadComponent: () => import('./faculty-master/faculty-master.page').then( m => m.FacultyMasterPage)
  },
  {
    path: 'faculty-dashboard',
    loadComponent: () => import('./faculty-dashboard/faculty-dashboard.page').then( m => m.FacultyDashboardPage)
  },
  {
    path: 'admin-timetable',
    loadComponent: () => import('./admin-timetable/admin-timetable.page').then( m => m.AdminTimetablePage)
  },
  {
    path: 'infrastructure',
    loadComponent: () => import('./infrastructure/infrastructure.page').then( m => m.InfrastructurePage)
  },
  {
    path: 'faculty-recognisation',
    loadComponent: () => import('./faculty-recognisation/faculty-recognisation.page').then( m => m.FacultyRecognisationPage)
  },
  {
    path: 'admin-scheduling-timetable',
    loadComponent: () => import('./admin-scheduling-timetable/admin-scheduling-timetable.page').then( m => m.AdminSchedulingTimetablePage)
  },
  {
    path: 'fronthomepage',
    loadComponent: () => import('./fronthomepage/fronthomepage.page').then( m => m.FronthomepagePage)
  }



];
