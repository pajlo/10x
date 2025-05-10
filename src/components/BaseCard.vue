<script setup>
  import { ref } from 'vue';
  import { Transition } from 'vue';

  const props = defineProps({
    flippable: {
      type: Boolean,
      default: false,
    },
    elevation: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
  });

  const isFlipped = ref(false);

  const toggleFlip = () => {
    if (props.flippable) {
      isFlipped.value = !isFlipped.value;
    }
  };

  const elevationClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
</script>

<template>
  <div
    :class="[
      'bg-white rounded-lg overflow-hidden',
      elevationClasses[elevation],
      { 'cursor-pointer': flippable },
    ]"
    @click="toggleFlip"
  >
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="!isFlipped" class="front">
        <slot name="front" />
      </div>
      <div v-else class="back">
        <slot name="back" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .front,
  .back {
    @apply p-6;
  }
</style>
