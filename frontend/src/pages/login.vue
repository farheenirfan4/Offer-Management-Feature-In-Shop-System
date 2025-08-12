<script setup lang="ts">
import { useTheme } from 'vuetify'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'

import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { ref } from 'vue'
import { useAuth } from '../../composables/Authentication/useAuth'

import { useRouter } from 'vue-router'
import { useValidator } from "../../composables/validators/useValidator";
import type { ErrorObject } from "ajv";

const errors = ref<ErrorObject[]>([]);

const router = useRouter()


const { login,error } = useAuth()
const email = ref('')
const password = ref('')
const remember = ref('false')
const { validateLoginForm } = useValidator();

function formatError(err: ErrorObject) {
  if (err.keyword === "minLength") return "Password must be at least 6 characters";
  if (err.keyword === "format" && err.params.format === "email") return "Please enter a valid email";
  if (err.keyword === "required") return `${err.params.missingProperty} is required`;
  return "Invalid input";
}



const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const handleLogin = async () => {
 const { valid, errors: ajvErrors } = validateLoginForm({
    email: email.value,
    password: password.value
  });

  if (!valid) {
    errors.value = ajvErrors;
    return;
  }

  errors.value = [];
  // Proceed with API call
  console.log("Login data is valid");
  try {
    console.log('Email:', email.value)
    console.log('Password:', password.value)
   const loggedUser = await login(email.value, password.value)
    
    console.log('Logged in user:', loggedUser) // This will now show
    router.push('/dashboard')
    
   
  } catch {
    // Error already handled in composable
  }
}

const isPasswordVisible = ref(false)
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <RouterLink
          to="/"
          class="d-flex align-center gap-3"
        >
          
          <h2 class="font-weight-medium text-2xl text-uppercase">
            Shop System
          </h2>
        </RouterLink>
      </VCardItem>

      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1">
          Welcome to CMS! 👋🏻
        </h4>
        <p class="mb-0">
          Please sign-in to your account
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="email"
                label="Email"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap my-6">
                <VCheckbox
                  v-model="remember"
                  label="Remember me"
                />

                <a
                  class="text-primary"
                  href="javascript:void(0)"
                >
                  Forgot Password?
                </a>
              </div>

              <!-- login button -->
              <VBtn
                @click="handleLogin"
                block
                type="submit"
               
              >
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
               <ul v-if="errors.length" class="error-list">
      <li class="color-red" v-for="(err, index) in errors" :key="index">
        {{ formatError(err) }}
      </li>
    </ul>
            </VCol>

            <VCol
              cols="12"
              class="d-flex align-center"
            >
              
            </VCol>

            <!-- auth providers -->
            
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />

    <VAlert
  v-if="error"
  type="error"
  variant="tonal"
  class="mt-4"
>
  {{ error }}
</VAlert>
  </div>
  
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>