export interface ResumeData {
  download: string

  header: {
    name: string
    location: string
    contact: string
    website: string
  }

  sections: {
    summary: {
      title: string
      text: string
    }

    skills: {
      title: string
      items: {
        label: string
        value: string
      }[]
    }

    experience: {
      title: string
      roles: {
        title: string
        company: string
        location: string
        period: string
        points: string[]
      }[]
    }

    education: {
      title: string
      items: {
        institution: string
        degree: string
        period?: string
      }[]
    }
  }
}