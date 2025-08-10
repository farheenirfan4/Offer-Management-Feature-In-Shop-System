<script setup lang="ts">
import trophy from '@images/misc/trophy.png'
</script>

<template>
  <VCard class="position-relative">
    <VCardText>
      <div class="mb-2">
        <h5 class="text-h5">
          Congratulations John! <span class="text-high-emphasis">🎉</span>
        </h5>
        <div class="text-body-1">
          Best seller of the month
        </div>
      </div>
      <h4 class="text-h4 text-primary">
        $42.8k
      </h4>
      <div class="text-body-1 mb-2">
        78% of target <span class="text-high-emphasis">🚀</span>
      </div>
      <VBtn size="small">
        View Sales
      </VBtn>
    </VCardText>

    <!-- Trophy -->
    <VImg
      :src="trophy"
      class="trophy"
    />
  </VCard>
</template>

<style lang="scss">
.v-card .trophy {
  position: absolute;
  inline-size: 5.188rem;
  inset-block-end: 1.25rem;
  inset-inline-end: 1.25rem;

  animation-name: up-and-down;
  animation-duration: 2s; /* The total duration of one cycle */
  animation-iteration-count: infinite; /* The animation will repeat forever */
  animation-direction: alternate; /* The animation will reverse direction on each cycle */
  animation-timing-function: ease-in-out; /* The animation will start and end slowly */
}

@keyframes up-and-down {
  0%, 100% {
    transform: translateY(0); /* Start and end at the original position */
  }
  50% {
    transform: translateY(-1rem); /* Move the trophy up by 1rem (you can adjust this value) */
  }
}
</style>
