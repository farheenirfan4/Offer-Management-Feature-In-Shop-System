<script lang="ts" setup>
import { useDisplay } from 'vuetify'
import VerticalNav from '@layouts/components/VerticalNav.vue'

// reactive state
const isOverlayNavActive = ref(false)
const isLayoutOverlayVisible = ref(false)
const toggleIsOverlayNavActive = useToggle(isOverlayNavActive)

// route and display helpers
const route = useRoute()
const { mdAndDown } = useDisplay()

// sync overlay state
syncRef(isOverlayNavActive, isLayoutOverlayVisible)

</script>

<template>
  <div
    class="layout-wrapper layout-nav-type-vertical layout-navbar-static layout-footer-static layout-content-width-fluid"
    :class="[
      mdAndDown && 'layout-overlay-nav',
      route.meta.layoutWrapperClasses,
    ]"
  >
    <VerticalNav
      :is-overlay-nav-active="isOverlayNavActive"
      :toggle-is-overlay-nav-active="toggleIsOverlayNavActive"
    >
      <template #nav-header="slotProps">
        <slot
          name="vertical-nav-header"
          v-bind="slotProps"
        />
      </template>

      <template #before-nav-items>
        <slot name="before-vertical-nav-items" />
      </template>

      <template #default>
        <slot name="vertical-nav-content" />
      </template>

      <template #after-nav-items>
        <slot name="after-vertical-nav-items" />
      </template>
    </VerticalNav>

    <div class="layout-content-wrapper">
      <header class="layout-navbar navbar-blur">
        <div class="navbar-content-container">
          <slot
            name="navbar"
            :toggle-vertical-overlay-nav-active="toggleIsOverlayNavActive"
          />
        </div>
      </header>

      <main class="layout-page-content">
        <div class="page-content-container">
          <slot />
        </div>
      </main>

      <footer class="layout-footer">
        <div class="footer-content-container">
          <slot name="footer" />
        </div>
      </footer>
    </div>

    <div
      class="layout-overlay"
      :class="{ visible: isLayoutOverlayVisible }"
      @click="isLayoutOverlayVisible = !isLayoutOverlayVisible"
    />
  </div>
</template>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/placeholders";
@use "@layouts/styles/mixins";

.layout-wrapper.layout-nav-type-vertical {
  block-size: 100%;

  .layout-content-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-block-size: 100dvh;
    transition: padding-inline-start 0.2s ease-in-out;
    will-change: padding-inline-start;

    @media screen and (min-width: 1280px) {
      padding-inline-start: variables.$layout-vertical-nav-width;
    }
  }

  .layout-navbar {
    z-index: variables.$layout-vertical-nav-layout-navbar-z-index;

    .navbar-content-container {
      block-size: variables.$layout-vertical-nav-navbar-height;
    }

    @at-root {
      .layout-wrapper.layout-nav-type-vertical {
        .layout-navbar {
          @if variables.$layout-vertical-nav-navbar-is-contained {
            @include mixins.boxed-content;
          }

          @else {
            .navbar-content-container {
              @include mixins.boxed-content;
            }
          }
        }
      }
    }
  }

  &.layout-navbar-sticky .layout-navbar {
    @extend %layout-navbar-sticky;
  }

  &.layout-navbar-hidden .layout-navbar {
    @extend %layout-navbar-hidden;
  }

  .layout-footer {
    @include mixins.boxed-content;
  }

  .layout-overlay {
    position: fixed;
    z-index: variables.$layout-overlay-z-index;
    background-color: rgb(0 0 0 / 60%);
    cursor: pointer;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease-in-out;
    will-change: transform;

    &.visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &.layout-vertical-nav-collapsed .layout-content-wrapper {
    padding-inline-start: variables.$layout-vertical-nav-collapsed-width;
  }

  &.layout-content-height-fixed {
    .layout-content-wrapper {
      max-block-size: 100dvh;
    }

    .layout-page-content {
      display: flex;
      overflow: hidden;

      .page-content-container {
        inline-size: 100%;

        > :first-child {
          max-block-size: 100%;
          overflow-y: auto;
        }
      }
    }
  }
}
</style>