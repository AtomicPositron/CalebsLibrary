import { ref } from 'vue'

const ApiKey = ''
const RootFolderId = ''

const loading = ref(false)
const files = ref([])
const currentRootFolderId = ref(RootFolderId)
const breadcrumbs = ref([
  {
    id: RootFolderId,
    name: 'Library',
  },
])

let getFileExtension = (filename: string) => {}
