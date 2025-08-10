// Inside your <script setup> block
import { ref, onMounted } from 'vue';

const userData = ref([]);

const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:3030/users');
    const data = await response.json();
    userData.value = data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

onMounted(() => {
  fetchUsers();
});