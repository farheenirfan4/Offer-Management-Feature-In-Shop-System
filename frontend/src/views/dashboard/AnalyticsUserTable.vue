<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'

import { ref, onMounted, computed } from 'vue'

interface User {
  id: number;
  email: string;
  roles: string[];
  username: string;
}

const headers = [
  { title: 'User', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'roles' },
]

const userData = ref<User[]>([]) 
const getToken = () => localStorage.getItem('feathers-jwt')

// Snackbar state
const snackbar = ref({ show: false, text: '', color: 'error' })
const showMessage = (text: string, color: 'success' | 'error' = 'error') => {
  snackbar.value = { show: true, text, color }
}

const showError = async (res: Response) => {
  try {
    const errData = await res.json()
    if (errData?.message?.includes('permissions')) {
      showMessage('You don’t have permission to perform this action.')
    } else if (errData?.message) {
      showMessage(errData.message)
    } else {
      showMessage(`Unexpected error (${res.status})`)
    }
  } catch {
    showMessage(`Unexpected error (${res.status})`)
  }
}

const fetchUsers = async () => {
  const token = getToken()
  if (!token) return showMessage('No authentication token found.')

  try {
    const response = await fetch('http://localhost:3030/users', {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) return await showError(response)
    const data = await response.json()
    userData.value = data.data
  } catch {
    showMessage('Failed to fetch users. Please try again later.')
  }
}
onMounted(fetchUsers)

const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const newUser = ref({ username: "", email: "", password: "", roles: [] as string[] })
const editUser = ref<User>({ id: 0, email: '', roles:[], username: '' })

const createUser = async (newUserData: { username: string; email: string; password: string; roles?: string[] }) => {
  const token = getToken()
  if (!token) return
  try {
    const res = await fetch("http://localhost:3030/users", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(newUserData),
    })
    if (!res.ok) return await showError(res)
    const data = await res.json()
    userData.value.push(data)
    showMessage('User created successfully!', 'success')
  } catch {
    showMessage('Failed to create user.')
  }
}

const handleAddUser = async () => {
  if (!newUser.value.username || !newUser.value.email || !newUser.value.password) {
    return showMessage('Please fill all required fields.')
  }
  await createUser(newUser.value)
  isAddDialogOpen.value = false
  newUser.value = { username: "", email: "", password: "", roles: [] }
}

const openEditDialog = (user: User) => {
  editUser.value = { ...user }
  isEditDialogOpen.value = true
}

const updateUser = async () => {
  if (!editUser.value) return
  const token = getToken()
  if (!token) return

  try {
    const { username, email, roles } = editUser.value;
    const res = await fetch(`http://localhost:3030/users/${editUser.value.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, roles }),
    })
    if (!res.ok) return await showError(res)
    const updatedUser = await res.json()
    const idx = userData.value.findIndex(u => u.id === updatedUser.id)
    if (idx !== -1) userData.value[idx] = updatedUser
    isEditDialogOpen.value = false
    showMessage('User updated successfully!', 'success')
  } catch {
    showMessage('Failed to update user.')
  }
}

const deleteUser = async (id: number) => {
  if (!confirm("Are you sure you want to delete this user?")) return
  const token = getToken()
  if (!token) return

  try {
    const res = await fetch(`http://localhost:3030/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return await showError(res)
    userData.value = userData.value.filter(u => u.id !== id)
    showMessage('User deleted successfully!', 'success')
  } catch {
    showMessage('Failed to delete user.')
  }
}

// Avatars
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8]
const mappedUserData = computed(() => {
  if (!Array.isArray(userData.value)) return []
  return userData.value.map(user => ({
    ...user,
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
  }))
})
const headersWithActions = [
  { title: 'Avatar', key: 'avatar', sortable: false },
  ...headers,
  { title: "Actions", key: "actions", sortable: false },
]
</script>




<template>
  <VCard>
    <VDataTable
      :headers="headersWithActions"
      :items="mappedUserData"
      item-value="id"
      class="text-no-wrap"
    >
      <!-- Avatar Column -->
      <template #item.avatar="{ item }">
        <VAvatar size="36" :variant="!item.avatar ? 'tonal' : undefined" :color="!item.avatar ? 'primary' : undefined">
          <VImg v-if="item.avatar" :src="item.avatar" />
        </VAvatar>
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <VBtn icon="ri-edit-line" size="small" color="white" variant="flat" @click="openEditDialog(item)" />
        <VBtn icon="ri-delete-bin-line" size="small" color="error" variant="flat" @click="deleteUser(item.id)" />
      </template>
    </VDataTable>

    <!-- Add User Button -->
    <VCardActions>
      <VBtn color="primary" @click="isAddDialogOpen = true">Add New User</VBtn>
    </VCardActions>

    <!-- Add User Dialog -->
    <VDialog v-model="isAddDialogOpen" max-width="500px">
      <VCard>
        <VCardTitle>Add User</VCardTitle>
        <VCardText>
          <VTextField v-model="newUser.username" label="Username" required />
          <VTextField v-model="newUser.email" label="Email" required />
          <VTextField v-model="newUser.password" label="Password" type="password" required />
          <VSelect v-model="newUser.roles" :items="['admin', 'editor', 'viewer', 'subscriber']" label="Role" multiple />
        </VCardText>
        <VCardActions>
          <VBtn @click="isAddDialogOpen = false">Cancel</VBtn>
          <VBtn color="primary" @click="handleAddUser">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Edit User Dialog -->
    <VDialog v-model="isEditDialogOpen" max-width="500px">
      <VCard>
        <VCardTitle>Edit User</VCardTitle>
        <VCardText>
          <VTextField v-model="editUser.username" label="Username" required />
          <VTextField v-model="editUser.email" label="Email" required />
          <VSelect    v-model="editUser.roles" :items="['admin', 'editor', 'viewer']" label="Role" multiple />
        </VCardText>
        <VCardActions>
          <VBtn @click="isEditDialogOpen = false">Cancel</VBtn>
          <VBtn color="primary" @click="updateUser">Update</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>

  <v-snackbar
  v-model="snackbar.show"
  :color="snackbar.color"
  timeout="3000"
  location="top right"
>
  {{ snackbar.text }}
</v-snackbar>

</template>


