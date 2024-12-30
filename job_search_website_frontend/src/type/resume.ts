// interface SKill {
//   id: number
//   resumeId: number
//   skillId: number
//   skill: {
//     id: number
//     name: string
//   }
// }

interface experienceDetail {
  id: number
  companyName: string
  startMonth: number
  startYear: number
  endMonth: number
  endYear: number
  description: string
}

interface educationDetail {
  id: number
  university: string
  startYear: number
  endYear: number
  degree: string
}

export interface Resume {
  id: string
  name: string
  description: string
  skill: string
  experience: string
  field: string
  employeeId: string
  employee: {
    id: number
    fullName: string
    userId: string
  }
  resumeSkills: number[]
  experienceDetails: experienceDetail[]
  educations: educationDetail[]
  updatedAt: string
}
