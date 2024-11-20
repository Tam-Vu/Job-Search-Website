export default interface jobs {
  id: number
  title: string
  description: string
  location: string
  district: string
  salaryRange: string
  jobType: string
  requirements: string
  numberOfApplications: number
  jobStatus: string
  status: string
  professionalPosition: string
  industry: string
  jobField: string
  experience: string
  employerId: number
  employer: {
    companyName: string
    id: number
  }
}

export interface CreateJobs {
  title: string
  description: string
  location: string
  salaryRange: string
  jobType: string
  requirements: string
  industry: string
  jobField: string
  professionalPosition: string
  experience: string
}
