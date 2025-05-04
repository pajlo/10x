<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => items.every(item => 
      typeof item === 'object' && 
      'label' in item && 
      'action' in item
    )
  },
  buttonContent: {
    type: String,
    default: 'Menu'
  },
  position: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right'].includes(value)
  }
})
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
      {{ buttonContent }}
      <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems 
        :class="[
          'absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
          position === 'left' ? 'origin-top-left left-0' : 'origin-top-right right-0'
        ]"
      >
        <div class="py-1">
          <MenuItem v-for="(item, index) in items" :key="index" v-slot="{ active }">
            <button
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'w-full text-left block px-4 py-2 text-sm'
              ]"
              @click="item.action"
            >
              {{ item.label }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>