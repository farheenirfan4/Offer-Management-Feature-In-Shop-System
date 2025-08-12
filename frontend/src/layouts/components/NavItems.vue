<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
</script>

<template>
  <!-- 👉 Dashboards -->
  <VerticalNavGroup
    :item="{
      title: 'Dashboards',
      icon: 'ri-home-smile-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Analytics',
        to: '/dashboard',
      }"
    />
  </VerticalNavGroup>

  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Offers',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Account Settings',
      icon: 'ri-user-settings-line',
      to: '/account-settings',
    }"
  />

  <!--  ><VerticalNavLink
    :item="{
      title: 'Login',
      icon: 'ri-login-box-line',
      to: '/login',
    }"
  />-->
  <VerticalNavLink
    :item="{
      title: 'Persona',
      icon: 'ri-information-line',
      to: '/persona',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Offers',
      icon: 'ri-play-list-add-line',
      to: '/offers',
    }"
  />


  <!-- 👉 User Interface -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'User Interface',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Display Configure',
      icon: 'ri-computer-line',
      to: '/typography',
    }"
  />
  <!-- ><VerticalNavLink
    :item="{
      title: 'Icons',
      icon: 'ri-remixicon-line',
      to: '/icons',
    }"
  />-->
  <!-- ><VerticalNavLink
    :item="{
      title: 'Cards',
      icon: 'ri-bar-chart-box-line',
      to: '/cards',
    }"
  />-->

  <!-- 👉 Forms & Tables 
  <VerticalNavSectionTitle
    :item="{
      heading: 'Forms & Tables',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Form Layouts',
      icon: 'ri-layout-4-line',
      to: '/form-layouts',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Tables',
      icon: 'ri-table-alt-line',
      to: '/tables',
    }"
  />-->

  <!-- 👉 Others 
  <VerticalNavSectionTitle
    :item="{
      heading: 'Others',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Documentation',
      icon: 'ri-article-line',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/documentation/',
      target: '_blank',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Raise Support',
      href: 'https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free/issues',
      icon: 'ri-lifebuoy-line',
      target: '_blank',
    }"
  />-->
</template>
