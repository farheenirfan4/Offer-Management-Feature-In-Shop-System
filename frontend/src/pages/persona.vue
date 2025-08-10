<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/Authentication/useAuth'
import { usePersonaService, PersonaConfig } from '../../composables/Persona/usePersonaService'

const router = useRouter()
const { personasConfig, loading, error, notAuthorized, fetchPersonasConfig, createPersona, updatePersona } = usePersonaService()
const { user, token } = useAuth()

// Dialog + form state
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formPersona = ref<Omit<PersonaConfig, 'id' | 'createdAt' | 'updatedAt'>>({
  name: '',
  forPayingUsers: false,
  maxLevel: 0,
  minLevel: 0,
  maxMmr: 0,
  minMmr: 0,
  maxDeposits: 0,
  minDeposits: 0
})

const openCreateDialog = () => {
  resetForm()
  isEditing.value = false
  editingId.value = null
  dialogVisible.value = true
}

const openEditDialog = (persona: PersonaConfig) => {
  isEditing.value = true
  editingId.value = persona.id
  formPersona.value = {
    name: persona.name,
    forPayingUsers: persona.forPayingUsers,
    maxLevel: persona.maxLevel,
    minLevel: persona.minLevel,
    maxMmr: persona.maxMmr,
    minMmr: persona.minMmr,
    maxDeposits: persona.maxDeposits,
    minDeposits: persona.minDeposits
  }
  dialogVisible.value = true
}

const resetForm = () => {
  formPersona.value = {
    name: '',
    forPayingUsers: false,
    maxLevel: 0,
    minLevel: 0,
    maxMmr: 0,
    minMmr: 0,
    maxDeposits: 0,
    minDeposits: 0
  }
}

const submitForm = async () => {
  let persona: PersonaConfig | null = null

  if (isEditing.value && editingId.value !== null) {
    persona = await updatePersona(editingId.value, formPersona.value)
  } else {
    persona = await createPersona(formPersona.value)
  }

  if (persona) {
    await fetchPersonasConfig()
    dialogVisible.value = false
    resetForm()
  }
}
onMounted(async () => {
  await fetchPersonasConfig()
  if (error.value === 'Not logged in') {
    router.push('/login')
  }
})
</script>

<template>
  <VContainer>
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>Personas Configuration</span>
        <VBtn icon="ri-add-box-line" color="primary" @click="openCreateDialog" />
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
              <th>Name</th>
              <th>Paying Users</th>
              <th>Level Range</th>
              <th>MMR Range</th>
              <th>Deposit Range</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in personasConfig" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.forPayingUsers ? 'Yes' : 'No' }}</td>
              <td>{{ item.minLevel }} - {{ item.maxLevel }}</td>
              <td>{{ item.minMmr }} - {{ item.maxMmr }}</td>
              <td>{{ item.minDeposits }} - {{ item.maxDeposits }}</td>
              <td>{{ new Date(item.createdAt).toLocaleString() }}</td>
              <td>
                <VBtn small icon="ri-edit-line" @click="openEditDialog(item)" />
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>

    <!-- Unified Create/Edit Persona Dialog -->
    <VDialog v-model="dialogVisible" max-width="600px">
      <VCard>
        <VCardTitle>{{ isEditing ? 'Edit Persona' : 'Create New Persona' }}</VCardTitle>
        <VCardText>
          <VTextField label="Name" v-model="formPersona.name" outlined />

          <VSwitch label="For Paying Users" v-model="formPersona.forPayingUsers" />

          <VRow>
            <VCol cols="6">
              <VTextField label="Min Level" type="number" v-model.number="formPersona.minLevel" />
            </VCol>
            <VCol cols="6">
              <VTextField label="Max Level" type="number" v-model.number="formPersona.maxLevel" />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="6">
              <VTextField label="Min MMR" type="number" v-model.number="formPersona.minMmr" />
            </VCol>
            <VCol cols="6">
              <VTextField label="Max MMR" type="number" v-model.number="formPersona.maxMmr" />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="6">
              <VTextField label="Min Deposits" type="number" v-model.number="formPersona.minDeposits" />
            </VCol>
            <VCol cols="6">
              <VTextField label="Max Deposits" type="number" v-model.number="formPersona.maxDeposits" />
            </VCol>
          </VRow>
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
