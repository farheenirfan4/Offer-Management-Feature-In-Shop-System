<!-- pages/index.vue (or any other Nuxt page/component) -->
<template>
  <div class="container">
    <h1>User Level Filter</h1>
    <p>Click the button below to fetch users with levels between 50 and 100.</p>
    <button @click="fetchUsers" :disabled="loading" class="fetch-button">
      {{ loading ? 'Fetching...' : 'Fetch Users (Level 50-100)' }}
    </button>

    <p v-if="error" class="error-message">Error: {{ error }}</p>

    <div v-if="users.length > 0" class="user-list">
      <h2>Filtered Users:</h2>
      <ul>
        <li v-for="user in users" :key="user.id" class="user-item">
          <strong>ID:</strong> {{ user.id }} <br />
          <strong>Email:</strong> {{ user.email || 'N/A' }} <br />
          <strong>Level:</strong> {{ user.metadata?.CareerProgressData?.Level || 'N/A' }}
        </li>
      </ul>
    </div>

    <p v-else-if="!loading && !error" class="no-users-message">
      No users found yet. Click the button to fetch.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNuxtApp } from '#app' // Import useNuxtApp for Nuxt 3

const { $feathers } = useNuxtApp() // Access the injected Feathers client
const users = ref([])
const loading = ref(false)
const error = ref(null)

const fetchUsers = async () => {
  loading.value = true
  error.value = null
  try {
    // Call the find method on your 'players-data' service
    const result = await $feathers.service('players-data').find({
      query: {
        $levelRange50to100: true, // This triggers your custom backend logic
        $limit: 20 // Optional: Adjust limit as needed
      }
    })
    users.value = result.data // Feathers `find` returns a paginated object
  } catch (err) {
    console.error('Error fetching users:', err)
    error.value = err.message || 'Failed to fetch users.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: 'Inter', sans-serif; /* Using Inter as per instructions */
  max-width: 800px;
  margin: 0 auto;
  background-color: #f8f8f8;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

p {
  color: #34495e;
  text-align: center;
}

.fetch-button {
  display: block;
  margin: 20px auto;
  padding: 12px 25px;
  font-size: 18px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(145deg, #4CAF50, #45a049);
  color: white;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  outline: none;
}

.fetch-button:hover {
  background: linear-gradient(145deg, #45a049, #3e8e41);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.fetch-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}

.user-list {
  margin-top: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.user-list h2 {
  color: #2c3e50;
  margin-bottom: 15px;
  text-align: center;
}

.user-list ul {
  list-style-type: none;
  padding: 0;
}

.user-item {
  background-color: #ecf0f1;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.user-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-item strong {
  color: #2c3e50;
}

.no-users-message {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
}
</style>