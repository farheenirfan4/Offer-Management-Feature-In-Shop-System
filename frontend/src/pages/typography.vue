<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/Authentication/useAuth'
import { useDisplayConfigService, DisplayConfig } from '../../composables/DisplayConfigure/useDisplayConfig'

const router = useRouter()
const { displayConfigs, loading, error, notAuthorized, fetchDisplayConfig, createDisplayConfig, updateDisplayConfig } = useDisplayConfigService()
const { user, token } = useAuth()

// Dialog + form state
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formDisplayConfig = ref<Omit<DisplayConfig, 'id' | 'createdAt' | 'updatedAt'>>({
  displaySection: '',
  height: '',
  width: '',
  priority: ''
})

const openCreateDialog = () => {
  resetForm()
  isEditing.value = false
  editingId.value = null
  dialogVisible.value = true
}

const openEditDialog = (config: DisplayConfig) => {
  isEditing.value = true
  editingId.value = config.id
  formDisplayConfig.value = {
    displaySection: config.displaySection,
    height: config.height,
    width: config.width,
    priority: config.priority
  }
  dialogVisible.value = true
}

const resetForm = () => {
  formDisplayConfig.value = {
    displaySection: '',
    height: '',
    width: '',
    priority: ''
  }
}

const submitForm = async () => {
  let config: DisplayConfig | null = null

  if (isEditing.value && editingId.value !== null) {
    config = await updateDisplayConfig(editingId.value, formDisplayConfig.value)
  } else {
    config = await createDisplayConfig(formDisplayConfig.value)
  }

  if (config) {
    await fetchDisplayConfig()
    dialogVisible.value = false
    resetForm()
  }
}

onMounted(async () => {
  await fetchDisplayConfig()
  if (error.value === 'Not logged in') {
    router.push('/login')
  }
})
</script>

<template>
  <VContainer>
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center mb-4 ms-2">
        <span class="text-h4 font-weight-bold">Display Configuration</span>
        <VBtn
  icon="ri-add-large-fill"
  color="primary"
  class="square-btn"
  @click="openCreateDialog"
/>
      </VCardTitle>

      <VCardText>
        <VProgressLinear indeterminate v-if="loading" />
        <VAlert type="error" v-if="error">{{ error }}</VAlert>
        <VAlert type="error" v-if="notAuthorized">
          You are not authorized to view this page.
        </VAlert>

        <VTable v-if="!loading && !error && !notAuthorized">
          <thead>
            <tr>
              <th>ID</th>
              <th>Display Section</th>
              <th>Height</th>
              <th>Width</th>
              <th>Priority</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in displayConfigs" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.displaySection }}</td>
              <td>{{ item.height }}</td>
              <td>{{ item.width }}</td>
              <td>{{ item.priority }}</td>
              <td>{{ new Date(item.createdAt).toLocaleString() }}</td>
              <td>
                <VBtn small icon="ri-edit-line" variant="flat" color="purple" @click="openEditDialog(item)" />
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>

    <!-- Create/Edit Dialog -->
    <VDialog v-model="dialogVisible" max-width="600px">
      <VCard>
        <VCardTitle>{{ isEditing ? 'Edit Display Config' : 'Create New Display Config' }}</VCardTitle>
        <VCardText>
          <div class="d-flex flex-column gap-4">
  <VTextField label="Display Section" v-model="formDisplayConfig.displaySection" outlined />
  <VTextField label="Height" v-model="formDisplayConfig.height" outlined />
  <VTextField label="Width" v-model="formDisplayConfig.width" outlined />
  <VTextField label="Priority" v-model="formDisplayConfig.priority" outlined />
</div>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn @click="dialogVisible = false">Cancel</VBtn>
          <VBtn color="primary" @click="submitForm">
            {{ isEditing ? 'Update' : 'Save' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
</template>
<style scoped>
.square-btn {
  border-radius: 8px; /* Slightly rounded corners, not fully round */
  width: 48px;        /* Square size */
  height: 48px;       /* Square size */
  min-width: 36px;    /* Ensure Vuetify doesn't override width */
  min-height: 36px;   /* Ensure Vuetify doesn't override height */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>