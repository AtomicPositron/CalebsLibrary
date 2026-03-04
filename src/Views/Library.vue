<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { libraryStore } from '../stores/library'

const API_KEY = 'AIzaSyBbEt7LD6wUK1svHbZ_Cnqw68I6mW0geic'
const DRIVE_ID = '1Au60m0ngWUTCOe-AZt8CuJ5LmfvM_DTR'

const loading = ref(false)
const allFiles = ref<any[]>([])
const searchResults = ref<any[]>([])
const currentFolderId = ref(DRIVE_ID)
const breadcrumbs = ref([{ id: DRIVE_ID, name: 'Library' }])
const searchQuery = ref('')
const activeFilter = ref<string | null>(null)
const filterOpen = ref(false)
const isSearching = ref(false)
const bookmarks = ref<string[]>([])
const showBookmarksOnly = ref(false)
const previewFile = ref<any | null>(null)

const fileTypes = [
  'PDF',
  'DOC',
  'DOCX',
  'XLS',
  'XLSX',
  'PPT',
  'PPTX',
  'JPG',
  'PNG',
  'GIF',
  'MP4',
  'MP3',
  'ZIP',
]

const levelOptions = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level']
const departmentOptions = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
]
const semesterOptions = ['First Semester', 'Second Semester']

const selectedLevel = ref<string | null>(null)
const selectedDepartment = ref<string | null>(null)
const selectedSemester = ref<string | null>(null)
const levelDropdownOpen = ref(false)
const departmentDropdownOpen = ref(false)
const semesterDropdownOpen = ref(false)

onMounted(() => {
  loadFiles(DRIVE_ID)
  loadBookmarks()
})

const loadBookmarks = () => {
  const saved = localStorage.getItem('calebsLibraryBookmarks')
  if (saved) {
    bookmarks.value = JSON.parse(saved)
  }
}

const saveBookmarks = () => {
  localStorage.setItem('calebsLibraryBookmarks', JSON.stringify(bookmarks.value))
}

const toggleBookmark = (file: any, event: Event) => {
  event.stopPropagation()
  const index = bookmarks.value.indexOf(file.id)
  if (index > -1) {
    bookmarks.value.splice(index, 1)
  } else {
    bookmarks.value.push(file.id)
  }
  saveBookmarks()
}

const isBookmarked = (fileId: string) => {
  return bookmarks.value.includes(fileId)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${day}/${month}`
}

const getFileExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return ext.toUpperCase()
}

const getFileSvg = (filename: string, isFolder: boolean): string => {
  if (isFolder) {
    return `<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />`
  }

  const ext = filename.split('.').pop()?.toLowerCase() || ''

  if (['pdf'].includes(ext)) {
    return `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15h6" /><path d="M9 11h6" />`
  }

  if (['doc', 'docx', 'txt'].includes(ext)) {
    return `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />`
  }

  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /><line x1="8" y1="9" x2="16" y2="9" />`
  }

  if (['ppt', 'pptx'].includes(ext)) {
    return `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><rect x="8" y="12" width="8" height="6" rx="1" />`
  }

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    return `<rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />`
  }

  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
    return `<polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />`
  }

  if (['mp3', 'wav', 'flac', 'aac'].includes(ext)) {
    return `<path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />`
  }

  if (['zip', 'rar', '7z'].includes(ext)) {
    return `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />`
  }

  return `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />`
}

const searchAllFiles = async (query: string): Promise<any[]> => {
  const results: any[] = []
  const searchQuery = `name contains '${query}' and trashed = false`
  const fields = 'files(id,name,mimeType,webViewLink,createdTime)'
  let pageToken = ''

  do {
    const url = `https://www.googleapis.com/drive/v3/files?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}&fields=${fields}${pageToken ? '&pageToken=' + pageToken : ''}&pageSize=100`

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.files) {
        results.push(
          ...data.files.map((f: any) => ({
            ...f,
            isFolder: f.mimeType === 'application/vnd.google-apps.folder',
          })),
        )
      }
      pageToken = data.nextPageToken || ''
    } catch (error) {
      console.error('Search error:', error)
      break
    }
  } while (pageToken)

  return results
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    isSearching.value = false
    searchResults.value = []
    return
  }

  isSearching.value = true
  loading.value = true

  searchResults.value = await searchAllFiles(searchQuery.value)

  loading.value = false
}

watch(searchQuery, (newVal) => {
  if (!newVal.trim()) {
    isSearching.value = false
    searchResults.value = []
  }
})

const files = computed(() => {
  let source = isSearching.value ? searchResults.value : allFiles.value

  if (showBookmarksOnly.value) {
    source = source.filter((f) => bookmarks.value.includes(f.id))
  }

  if (activeFilter.value) {
    const ext = activeFilter.value.toLowerCase()
    source = source.filter((f) => {
      const fileExt = f.name.split('.').pop()?.toLowerCase() || ''
      return fileExt === ext
    })
  }

  return source
})

const folders = computed(() => files.value.filter((f) => f.isFolder))
const regularFiles = computed(() => files.value.filter((f) => !f.isFolder))

const loadFiles = async (folderId: string) => {
  loading.value = true

  const query = `'${folderId}' in parents and trashed = false`
  const fields = 'files(id,name,mimeType,webViewLink,createdTime)'

  const url = `https://www.googleapis.com/drive/v3/files?key=${API_KEY}&q=${encodeURIComponent(query)}&fields=${fields}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    allFiles.value = (data.files || []).map((file: any) => ({
      ...file,
      isFolder: file.mimeType === 'application/vnd.google-apps.folder',
    }))
  } catch (error) {
    console.error('Error loading files:', error)
    allFiles.value = []
  }

  loading.value = false
}

const handleClick = (file: any) => {
  if (file.isFolder) {
    navigateIntoFolder(file)
  } else {
    openFile(file)
  }
}

const navigateIntoFolder = (folder: any) => {
  currentFolderId.value = folder.id
  breadcrumbs.value.push({ id: folder.id, name: folder.name })
  searchQuery.value = ''
  activeFilter.value = null
  isSearching.value = false
  libraryStore.setFolder(folder.name)
  loadFiles(folder.id)
}

const navigateTo = (folderId: string, index: number) => {
  if (index === breadcrumbs.value.length - 1) return

  if (index === 0) {
    currentFolderId.value = DRIVE_ID
    breadcrumbs.value = [{ id: DRIVE_ID, name: 'Library' }]
    searchQuery.value = ''
    activeFilter.value = null
    isSearching.value = false
    libraryStore.setFolder('')
    loadFiles(DRIVE_ID)
    return
  }

  const targetFolder = breadcrumbs.value[index]
  currentFolderId.value = folderId
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
  searchQuery.value = ''
  activeFilter.value = null
  isSearching.value = false
  if (targetFolder) {
    libraryStore.setFolder(targetFolder.name)
  }
  loadFiles(folderId)
}

const openFile = (file: any) => {
  if (file.webViewLink) {
    window.open(file.webViewLink, '_blank')
  }
}

const previewFileFunc = (file: any, event: Event) => {
  event.stopPropagation()
  previewFile.value = file
}

const closePreview = () => {
  previewFile.value = null
}

const downloadFile = async (file: any, event: Event) => {
  event.stopPropagation()

  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${API_KEY}`

  try {
    const response = await fetch(downloadUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download error:', error)
    window.open(file.webViewLink, '_blank')
  }
}

const toggleFilter = () => {
  filterOpen.value = !filterOpen.value
}

const setFilter = (type: string | null) => {
  activeFilter.value = type
  filterOpen.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  isSearching.value = false
}

const toggleLevelDropdown = () => {
  levelDropdownOpen.value = !levelDropdownOpen.value
  departmentDropdownOpen.value = false
  semesterDropdownOpen.value = false
}

const toggleDepartmentDropdown = () => {
  departmentDropdownOpen.value = !departmentDropdownOpen.value
  levelDropdownOpen.value = false
  semesterDropdownOpen.value = false
}

const toggleSemesterDropdown = () => {
  semesterDropdownOpen.value = !semesterDropdownOpen.value
  levelDropdownOpen.value = false
  departmentDropdownOpen.value = false
}

const selectLevel = (level: string) => {
  selectedLevel.value = level
  levelDropdownOpen.value = false
}

const selectDepartment = (dept: string) => {
  selectedDepartment.value = dept
  departmentDropdownOpen.value = false
}

const selectSemester = (sem: string) => {
  selectedSemester.value = sem
  semesterDropdownOpen.value = false
}

const applyFilter = () => {
  filterOpen.value = false
}

const closeModal = () => {
  filterOpen.value = false
  levelDropdownOpen.value = false
  departmentDropdownOpen.value = false
  semesterDropdownOpen.value = false
}
</script>

<template>
  <!-- Preview Modal -->
  <Transition name="fade">
    <div
      v-if="previewFile"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      @click="closePreview"
    >
      <div class="bg-[#1C2330] rounded-lg p-4 max-w-4xl w-full mx-4" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-white text-xl">{{ previewFile.name }}</h3>
          <button @click="closePreview" class="text-white hover:text-red-400 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <iframe
          :src="previewFile.webViewLink"
          class="w-full h-[60vh] rounded border-0"
          allow="autoplay"
        ></iframe>
      </div>
    </div>
  </Transition>

  <!-- Filter Modal -->
  <Transition name="modal">
    <div
      v-if="filterOpen"
      class="fixed inset-0 bg-[#0e1117c4] flex items-center justify-center z-30"
      @click="closeModal"
    >
      <div class="p-px bg-linear-to-b from-[#151A22] to-[#A8D0E4] rounded-lg w-140" @click.stop>
        <div
          class="modalContainer flex flex-col gap-8 p-10 bg-[#0e1117] w-full text-white rounded-lg"
        >
          <div class="top flex justify-between items-center">
            <h1 class="text-5xl font-bold">Filter</h1>
            <button @click="closeModal" class="hover:rotate-90 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="37"
                height="37"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <!-- Level Dropdown -->
          <div class="relative">
            <button
              @click="toggleLevelDropdown"
              class="w-full text-left p-4 rounded-lg text-xl flex justify-between items-center bg-[#1C2330] hover:bg-[#252d3a] transition-colors"
            >
              <span>{{ selectedLevel || 'Level' }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :class="{ 'rotate-180': levelDropdownOpen }"
                class="transition-transform duration-300"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div
                v-if="levelDropdownOpen"
                class="absolute top-full left-0 w-full mt-2 bg-[#1C2330] rounded-lg overflow-hidden shadow-xl z-10"
              >
                <button
                  v-for="level in levelOptions"
                  :key="level"
                  @click="selectLevel(level)"
                  class="w-full text-left p-3 text-lg hover:bg-[#5D737E] transition-colors"
                  :class="{ 'bg-[#5D737E]': selectedLevel === level }"
                >
                  {{ level }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Department Dropdown -->
          <div class="relative">
            <button
              @click="toggleDepartmentDropdown"
              class="w-full text-left p-4 rounded-lg text-xl flex justify-between items-center bg-[#1C2330] hover:bg-[#252d3a] transition-colors"
            >
              <span>{{ selectedDepartment || 'Department' }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :class="{ 'rotate-180': departmentDropdownOpen }"
                class="transition-transform duration-300"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div
                v-if="departmentDropdownOpen"
                class="absolute top-full left-0 w-full mt-2 bg-[#1C2330] rounded-lg overflow-hidden shadow-xl z-10"
              >
                <button
                  v-for="dept in departmentOptions"
                  :key="dept"
                  @click="selectDepartment(dept)"
                  class="w-full text-left p-3 text-lg hover:bg-[#5D737E] transition-colors"
                  :class="{ 'bg-[#5D737E]': selectedDepartment === dept }"
                >
                  {{ dept }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Semester Dropdown -->
          <div class="relative">
            <button
              @click="toggleSemesterDropdown"
              class="w-full text-left p-4 rounded-lg text-xl flex justify-between items-center bg-[#1C2330] hover:bg-[#252d3a] transition-colors"
            >
              <span>{{ selectedSemester || 'Semester' }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :class="{ 'rotate-180': semesterDropdownOpen }"
                class="transition-transform duration-300"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div
                v-if="semesterDropdownOpen"
                class="absolute top-full left-0 w-full mt-2 bg-[#1C2330] rounded-lg overflow-hidden shadow-xl z-10"
              >
                <button
                  v-for="sem in semesterOptions"
                  :key="sem"
                  @click="selectSemester(sem)"
                  class="w-full text-left p-3 text-lg hover:bg-[#5D737E] transition-colors"
                  :class="{ 'bg-[#5D737E]': selectedSemester === sem }"
                >
                  {{ sem }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Bookmarks Toggle -->
          <button
            @click="showBookmarksOnly = !showBookmarksOnly"
            class="w-full text-left p-4 rounded-lg text-xl flex justify-between items-center transition-all duration-300"
            :class="showBookmarksOnly ? 'bg-[#5D737E]' : 'bg-[#1C2330]'"
          >
            <span>Show Bookmarks Only</span>
            <svg
              v-if="showBookmarksOnly"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="text-yellow-400"
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
          </button>

          <button
            @click="applyFilter"
            class="text-center p-4 rounded-lg text-xl bg-[#5D737E] hover:bg-[#6d848e] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Main Content -->
  <div
    class="libraryBody p-4 md:p-6 lg:p-10 w-full h-full flex gap-4 md:gap-6 lg:gap-10 flex-col overflow-hidden"
  >
    <nav class="flex flex-row gap-3 md:gap-6 lg:gap-10 shrink-0">
      <!-- Filter Button -->
      <button
        @click="toggleFilter"
        class="justify-between hover:shadow-[#232C3D90] hover:shadow-2xl items-center text-white bg-[#1C2330] border-[#5D737E] border-2 h-12 md:h-14 lg:h-18 rounded-lg p-2 md:p-3 w-28 md:w-36 lg:w-50 flex flex-row padding-3 md:padding-5 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <p class="text-lg md:text-2xl lg:text-3xl">{{ activeFilter ? activeFilter : 'Filter' }}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          class="w-5 h-5 md:w-6 md:h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M2 5h20" />
          <path d="M6 12h12" />
          <path d="M9 19h6" />
        </svg>
      </button>

      <!-- Search Input -->
      <div class="input p-3 md:p-5 flex flex-row items-center bg-[#1C2330] rounded-lg w-full">
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          class="rounded-lg w-full h-full placeholder:text-xl md:text-2xl lg:text-3xl outline-none border-none text-white placeholder:text-[#FFFFFF52] text-lg md:text-2xl lg:text-2xl"
          type="text"
          placeholder="Search..."
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="ml-2 mr-2 hover:rotate-90 transition-transform duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            class="w-4 h-4 md:w-5 md:h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <button @click="handleSearch" class="hover:scale-110 transition-transform duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            class="w-5 h-5 md:w-6 md:h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Breadcrumbs -->
    <div class="tree flex items-center gap-1 md:gap-2 shrink-0 overflow-hidden">
      <span v-for="(crumb, index) in breadcrumbs" :key="crumb.id" class="flex items-center min-w-0">
        <span
          @click="navigateTo(crumb.id, index)"
          class="transition-all duration-200 truncate text-sm md:text-base lg:text-xl"
          :class="
            index === breadcrumbs.length - 1
              ? 'text-white text-base md:text-xl cursor-default'
              : 'text-[#5D737E] text-base md:text-xl cursor-pointer hover:text-white'
          "
        >
          {{ crumb.name }}
        </span>
        <span
          v-if="index < breadcrumbs.length - 1"
          class="text-[#5D737E] text-sm md:text-lg mx-1 md:mx-2 shrink-0"
          >></span
        >
      </span>
    </div>

    <!-- Loading/Empty/Files State -->
    <div v-if="loading" class="text-white text-2xl flex items-center justify-center py-10">
      <svg
        class="animate-spin h-8 w-8 mr-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Loading...
    </div>
    <div
      v-else-if="files.length === 0"
      class="text-[#9AA4B2] text-base md:text-xl lg:text-2xl flex flex-col items-center justify-center py-6 md:py-8 lg:py-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        class="mb-4 opacity-50"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      {{ searchQuery || activeFilter ? 'No files match your search' : 'This folder is empty' }}
    </div>
    <div v-else class="files h-full overflow-y-auto flex flex-col gap-5 pb-10">
      <!-- Search Results Header -->
      <Transition name="fade">
        <div v-if="isSearching" class="text-[#9AA4B2] text-xl mb-2">
          Found {{ searchResults.length }} file(s) matching "{{ searchQuery }}"
        </div>
      </Transition>

      <!-- Folders First -->
      <TransitionGroup name="list" tag="div" class="flex flex-col gap-4">
        <div
          v-for="file in folders"
          :key="file.id"
          class="folder bg-linear-to-r p-3 md:p-4 lg:p-6 rounded flex gap-4 md:gap-6 lg:gap-8 flex-col from-[#5D737E]/80 to-[#AEB9BE]/60 cursor-pointer hover:shadow-[#232C3D90] hover:shadow-2xl transition-all duration-300"
          @click="handleClick(file)"
        >
          <div class="topPart flex flex-row justify-between">
            <p class="text-white text-lg md:text-2xl lg:text-3xl">{{ file.name }}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              class="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:scale-110 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
              />
            </svg>
          </div>
        </div>
      </TransitionGroup>

      <!-- Files Second -->
      <TransitionGroup name="list" tag="div" class="flex flex-col gap-4">
        <div
          v-for="file in regularFiles"
          :key="file.id"
          class="file bg-[#1C2330] p-3 md:p-4 lg:p-6 rounded flex gap-4 md:gap-6 lg:gap-8 flex-col hover:shadow-[#232C3D90] hover:shadow-2xl cursor-pointer transition-all duration-300"
          @click="handleClick(file)"
        >
          <div class="topPart flex flex-row justify-between">
            <p class="text-white text-lg md:text-2xl lg:text-3xl truncate flex-1">
              {{ file.name }}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              class="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:scale-110 transition-transform duration-200 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="getFileSvg(file.name, file.isFolder)"
            />
          </div>
          <div class="bottomPart flex justify-between flex-row items-center">
            <p class="text-[#9AA4B2] text-base md:text-xl">{{ formatDate(file.createdTime) }}</p>
            <div
              class="PurposeButtons flex gap-3 md:gap-4 lg:gap-5 justify-center flex-row items-center"
            >
              <p class="text-base md:text-lg lg:text-xl text-[#9AA4B2]">
                {{ getFileExtension(file.name) }}
              </p>
              <button
                @click="toggleBookmark(file, $event)"
                class="hover:scale-125 transition-transform duration-200"
                :class="{ 'animate-bounce': isBookmarked(file.id) }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                  viewBox="0 0 24 24"
                  :fill="isBookmarked(file.id) ? 'currentColor' : 'none'"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :class="isBookmarked(file.id) ? 'text-yellow-400' : ''"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
              </button>
              <button
                @click="previewFileFunc(file, $event)"
                class="hover:scale-125 transition-transform duration-200 hover:text-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button
                @click="downloadFile(file, $event)"
                class="hover:scale-125 transition-transform duration-200 hover:text-green-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 17V3" />
                  <path d="m6 11 6 6 6-6" />
                  <path d="M19 21H5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.libraryBody {
  height: 100%;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .p-px,
.modal-leave-active .p-px {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
}

.modal-enter-from .p-px {
  transform: scale(0.9);
  opacity: 0;
}

.modal-leave-to .p-px {
  transform: scale(0.9);
  opacity: 0;
}

/* Dropdown transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* List transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}

/* Scrollbar styling */
.files::-webkit-scrollbar {
  width: 8px;
}

.files::-webkit-scrollbar-track {
  background: #1c2330;
  border-radius: 4px;
}

.files::-webkit-scrollbar-thumb {
  background: #5d737e;
  border-radius: 4px;
}

.files::-webkit-scrollbar-thumb:hover {
  background: #6d848e;
}
</style>
