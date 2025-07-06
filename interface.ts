

export interface Permission {
  id?: number;
  module_id?: number; // Links to Module interface (e.g., Course, Syllabus)
  route?: string; // e.g., '/dashboard', '/quickadmission'
  label: string; // e.g., 'Dashboard', 'Quick Admission'
  icon: string; // e.g., 'person-circle-outline'
  allowed: boolean; // Whether the user has access
}




export interface User{
    id?:any,
    roll_no?:any,
     first_name?:string,
      last_name?:string,
       email?:string,
        password?:string,
         mobile?:any,
          DOB?:string,
           father_name?:string,
            mother_name?:string,
             is_active?:boolean,
             course_id?:any,
             session_id?:any,
             semester_id?:any
           university_id?:any,
            father_phone?:any,
             mother_phone?:any,
              house_no?:string,
               locality?:string,
                area?:any,
                 pin?:string,
                  qualification?:any,
                   registration_no?:string,
                    subject_in_10_2?:string
                     percentage_in_10_2?:string,
                      passing_year_ten?:string,
                       passing_year_twelve?:string,
                        board?:any,
                         marks_ten?:string,
                          division?:any,
                           marks_twelve?:string,
                           university_registration_no?:any,
                           university_roll_no?:any,
                           aadhar_card?:any,
                           gender?:any,
                           blood_group?:any,
                           identification_mark?:any,
                           martial_status?:any,
                           caste_category?:any,
                           mobile_two?:any,
                           mobile_whatsapp?:any,
                           state?:any
  }
  export interface Agent {
    id?: number;               // Unique Agent ID (Optional for new entries)
    agent_name: string;        // Full Name of the Agent
    bank_name?: string;        // Bank Name for Payment (Optional)
    email: string;             // Agent's Email Address
    mobile: string;            // Mobile Number
    organisation?: string;     // Associated Organization Name (Optional)
    gender?: any;  // Enum for Gender (Optional)
    office_address?: string;   // Office Address of the Agent (Optional)
    aadhar_card?: string;      // Aadhar Card Number (Optional)
    pan_card?: string;         // PAN Card Number (Optional)
    password: string;          // Password for Authentication
    is_active?: boolean;       // Status: Active/Inactive (Optional)
    mobile_two?:any,
    mobile_whatsapp?:any,
    account_name?:string,
    account_no?:string,
    IFSC_code?:string
  }
  
export interface Table {
  id: any;
  module_id: any;
  table: string;
}

  export interface Module {
  id?: number;
  module_name: string;
}
export interface Syllabus{
  id?:number,
   semester_id?:any,
    file_name?:any,
     file_path?:any,
      updated_at?:any,
       is_active?:boolean,
        course_id?:any
}
export interface Semester{
    id?:any,
     semester_name?:string,
      is_active?:boolean
}

export interface Course{
    id?:number,
    session_id?:any,
    semester_id?:any
      university_id?:any,
       course_name?:string,
        course_shortname?:string,
         course_start_session?:any,
          course_end_session?:any, course_current?:any,
           course_in_use?:any,
            is_active?:boolean,
            
}
export interface Template_Field{
  id?:number,
   module_id?:number,
    table_id?:number,
     field_name?:string,
      created_at?:any,
       is_active?:boolean
}

export interface Session{
    id?:number,
     session_name?:string,
      session_short_name?:string,
       session_end_year?:any,
        session_in_use?:any,
         session_current?:any,
          is_active?:boolean
}


export interface Subject{
    id?:any,
     university_id?:any,
      subject_name?:string,
       subject_short_name?:string,
        course_id?:any,
         subject_club_id?:number,
          elective_id?:number,
           specialisation_id?:number
           semester_id?:any
}

export interface admin{
    id?:number,
     first_name?:string,
      last_name?:string,
       email?:string,
        password?:string,
         DOB?:Date,
          mobile?:string,
           father_name?:string,
            mother_name?:string,
             is_active?:boolean
}


export interface Country{
	id?: number,
	 country_name?: string,
	  country_shortname?: string,
	   is_active?:boolean
}

export interface State{
	id?: any,
  country_id:any,
	 state_name?: string,
	  state_shortname?: string,
	   is_active?:boolean
}


export interface Elective{
    id?:number,
     elective_paper?:string,
      is_active?:boolean
      course_id?:any,
      semester_id?:any 
}

export interface Specialisation{
    id?:number,
    specialisation_name?:string,
    course_id?:any,
    semester_id?:any,
      is_active?:boolean
}


// using both admin and user dashboard 
export interface Common {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    DOB?: Date;
    mobile?: string;
    father_name?: string; // Optional for users
    mother_name?: string; // Optional for users
    is_active?: boolean;
    aadhar_no?:string;
    role: 'admin' | 'user'| 'student' | 'agent'; // Role to differentiate between admin and user
    permissions?: Permission[]; // Add permissions array
  }
  export interface Chapter {
  id?: number;
  course_id: number;
  semester_id: number;
  subject_id: number;
  chapter_no: string;
  chapter_name: string;
  is_active?: number;
}


  export interface Documents{
    id?:number,
     user_id?:any,
      file_name?:string,
       file_path?:string,
        is_active?:boolean,
         updated_at?:Date
  }



  export interface Office{
    id?:number,
     first_name?:string,
      last_name?:string,
       DOB?:any,
        email?:string,
         password?:string,
          aadhar_no?:string,
           is_active?:boolean,
            mobile:any,
            father_name?:string,
            mother_name?:string
  }


  export interface city{
    id?:number,
     state_id?:any,
      city_name?:string,
       is_active?:boolean}



       export interface ApplyOnline {
        id?: any;
        first_name?: string;
        last_name?: string;
        ten_passing_year?: string;
        ten_marks?: string;
        twelve_passing_year?: string;
        twelve_marks?: string;
        full_name?: string;
        gender?: any
        blood_group?: any
        email?: string;
        mobile?: string;
        mobile_whatsapp?: string;
        father_name?: string;
        mother_name?: string;
        father_phone?: string;
        mother_phone?: string;
        DOB?: string; // Use string to handle date formats easily
        is_active?: boolean;
        course_id?:any;
        application_no?: string;
        agent_name?:string;
        step1_complete?: boolean;
  step2_complete?: boolean;
  step3_complete?: boolean;
  incompleteSteps?: string[];
      }
      
// interface.ts (or wherever your interfaces are defined)
export interface Module {
  id?: number;
  module_name: string;
}

export interface Category {
  id: number;
  module_id?: number; // Optional if categories are linked to modules
  category_name: string;
  category_shortname?: string;
}

export interface Subcategory {
  id: number;
  category_id: number;
  subcategory_name: string;
}

export interface Template {
  id: number;
  module_id: number;
  category_id: number;
  subcategory_id: number;
  template_shortname: string;
  template_name: string;
  variables?: string;
}
export interface TemplateVariable {
  id?: number;
  module_id: number;
  table_id:number;
  table_field_id: number;
  variable_key: string;
  variable_description: string;
  is_active?: number;
}

      
      export interface Course_Student{
        id?:number,
         course_name?:string,
          is_active?:boolean}

          export interface Question_Bank{
            id?:number,
             semester_id?:any,
              subject_id?:any,
              course_id?:any,
              name?:string,
               file_name?:any,
                file_path?:any, updated_at?:any,
                 is_active?:boolean
          }


          export interface Assignment {
            id?:number,
             semester_id?:any,
              subject_id?:any,
              course_id?:any,
              name?:string,
               file_name?:any,
                file_path?:any,
                 updatede_at?:any,
                  is_active?:boolean
          }