import { reactive } from 'vue'

export interface IconSet {
  path: string
  viewBox: string
}

const defaultIcon: IconSet = {
  path: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z',
  viewBox: '0 0 24 24',
}

const courseIcons: Record<string, IconSet> = {
  CSC: {
    viewBox: '0 0 24 24',
    path: 'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z',
  },
  ICT: {
    viewBox: '0 0 24 24',
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  },
  ELE: { viewBox: '0 0 24 24', path: 'M7 2v11h3v9l7-12h-4l4-8z' },
  MCE: {
    viewBox: '0 0 24 24',
    path: 'M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  },
  CVE: {
    viewBox: '0 0 24 24',
    path: 'M15 3V5H17V9H19V11H15V13H21V15H15V21H13V15H11V13H7V11H11V9H9V5H11V3H15zM3 7V21H21V7H3z',
  },
  CHE: {
    viewBox: '0 0 24 24',
    path: 'M7 2v2h1v14c0 2.21 1.79 4 4 4s4-1.79 4-4V4h1V2H7zm4 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
  },
  AGE: {
    viewBox: '0 0 24 24',
    path: 'M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 12.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  },
  MTH: {
    viewBox: '0 0 24 24',
    path: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.5 8h-1v1h1c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1h-2v-1.5h1.5v-1h-1c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1h2V7.5h-1.5V6H14v1zm1.5 2.5h-1v1h1v1h-1v1h1v1h-1v1h1v1h-1v1h1c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1h-1v1h1z',
  },
  PHY: {
    viewBox: '0 0 24 24',
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  },
  GST: {
    viewBox: '0 0 24 24',
    path: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
  },
  LAB: {
    viewBox: '0 0 24 24',
    path: 'M7 2v2h1v14c0 2.21 1.79 4 4 4s4-1.79 4-4V4h1V2H7zm2 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
  },
  WSP: {
    viewBox: '0 0 24 24',
    path: 'M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 7h12v2H6V7zm0 4h12v2H6v-2zm0 4h8v2H6v-2z',
  },
  default: defaultIcon,
}

const courseDescriptions: Record<string, string> = {
  CSC: 'Computer Science',
  ICT: 'Information & Communication Technology',
  ELE: 'Electrical Engineering',
  MCE: 'Mechanical Engineering',
  CVE: 'Civil Engineering',
  CHE: 'Chemical Engineering',
  AGE: 'Agricultural Engineering',
  MTH: 'Mathematics',
  PHY: 'Physics',
  GST: 'General Studies',
  LAB: 'Laboratory',
  WSP: 'Workshop',
  ICT215: 'Robotics and Automation',
}

const levelDescriptions: Record<string, string> = {
  '100': 'Foundation Level',
  '200': 'Intermediate Level',
  '300': 'Advanced Level',
  '400': 'Final Year',
  '500': 'Postgraduate',
}

function extractCourseInfo(folderName: string): { code: string; level: string } {
  const match = folderName.match(/^([A-Za-z]+)(\d+)/)
  if (match && match[1] && match[2]) {
    const code = match[1].toUpperCase()
    return { code: code, level: match[2].charAt(0) + '00' }
  }
  return { code: '', level: '' }
}

function getIconForCourse(folderName: string): IconSet {
  const { code } = extractCourseInfo(folderName)
  if (code && courseIcons[code]) return courseIcons[code] || defaultIcon

  const keywords = folderName.toUpperCase()

  if (keywords.includes('ROBOT')) return courseIcons['ICT'] || defaultIcon
  if (keywords.includes('COMPUTER') || keywords.includes('CODE') || keywords.includes('PROGRAM'))
    return courseIcons['CSC'] || defaultIcon
  if (keywords.includes('NETWORK') || keywords.includes('INTERNET') || keywords.includes('WEB'))
    return courseIcons['ICT'] || defaultIcon
  if (keywords.includes('ELECTRIC') || keywords.includes('CIRCUIT'))
    return courseIcons['ELE'] || defaultIcon
  if (keywords.includes('MECHANIC') || keywords.includes('GEAR') || keywords.includes('MACHINE'))
    return courseIcons['MCE'] || defaultIcon
  if (keywords.includes('CIVIL') || keywords.includes('BUILD') || keywords.includes('STRUCTURE'))
    return courseIcons['CVE'] || defaultIcon
  if (keywords.includes('CHEMICAL') || keywords.includes('CHEM'))
    return courseIcons['CHE'] || defaultIcon
  if (keywords.includes('AGRICULTURAL') || keywords.includes('AGRI'))
    return courseIcons['AGE'] || defaultIcon
  if (keywords.includes('MATH') || keywords.includes('CALCULUS'))
    return courseIcons['MTH'] || defaultIcon
  if (keywords.includes('PHYSICS') || keywords.includes('SCIENCE'))
    return courseIcons['PHY'] || defaultIcon
  if (keywords.includes('BOOK') || keywords.includes('READ') || keywords.includes('STUDY'))
    return courseIcons['GST'] || defaultIcon
  if (keywords.includes('LAB')) return courseIcons['LAB'] || defaultIcon
  if (keywords.includes('WORKSHOP') || keywords.includes('PRACTICAL'))
    return courseIcons['WSP'] || defaultIcon

  return defaultIcon
}

function generateDescription(folderName: string): string {
  const { code, level } = extractCourseInfo(folderName)
  if (courseDescriptions[folderName]) return courseDescriptions[folderName]
  if (code && courseDescriptions[code]) {
    const levelDesc = levelDescriptions[level] || ''
    return levelDesc ? `${courseDescriptions[code]} - ${levelDesc}` : courseDescriptions[code]
  }

  const keywords = folderName.toUpperCase()
  if (keywords.includes('ROBOTICS') || keywords.includes('ROBOT')) return 'Robotics and Automation'
  if (keywords.includes('PROGRAMMING') || keywords.includes('CODE'))
    return 'Programming and Software Development'
  if (keywords.includes('DATA') || keywords.includes('DATABASE'))
    return 'Data Management and Database Systems'
  if (keywords.includes('NETWORK')) return 'Computer Networking and Communications'
  if (keywords.includes('WEB') || keywords.includes('INTERNET'))
    return 'Web Technologies and Internet'
  if (keywords.includes('AI') || keywords.includes('INTELLIGENT'))
    return 'Artificial Intelligence and Machine Learning'
  if (keywords.includes('SECURITY') || keywords.includes('CYBER'))
    return 'Cybersecurity and Information Protection'
  if (keywords.includes('CLOUD')) return 'Cloud Computing and Services'
  if (keywords.includes('MOBILE')) return 'Mobile Application Development'
  if (keywords.includes('PROJECT')) return 'Project Management'
  if (keywords.includes('BUSINESS')) return 'Business and Enterprise'
  if (keywords.includes('MATH') || keywords.includes('CALCULUS'))
    return 'Mathematics and Quantitative Methods'
  if (keywords.includes('PHYSICS') || keywords.includes('MECHANICS'))
    return 'Physics and Physical Sciences'
  if (keywords.includes('LAB')) return 'Laboratory Work'
  if (keywords.includes('WORKSHOP')) return 'Workshop and Practical'

  if (level && levelDescriptions[level]) return `${levelDescriptions[level]} Course`
  return 'Course Materials and Resources'
}

const store = {
  currentFolder: '',
  currentDescription: '',
  currentIcon: defaultIcon,

  setFolder(name: string, description: string = '') {
    this.currentFolder = name
    this.currentDescription = name ? description || generateDescription(name) : ''
    this.currentIcon = getIconForCourse(name)
  },
}

export const libraryStore = reactive(store)

export { courseIcons }
