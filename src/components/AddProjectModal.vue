<script setup lang="ts">
import { ref } from 'vue'
import ModalWindow from './ModalWindow.vue'
import { useProjectsStore } from '@/stores/projects'
import { POSITION, useToast } from 'vue-toastification'

const toast = useToast()
const ProjectsStore = useProjectsStore()
const projectName = ref('')
const projectPerformer = ref('')
const projectStatus = ref('')

function addItem() {
  if (!projectName.value || !projectPerformer.value || !projectStatus.value) {
    toast.error('Всі поля мають бути заповнені!', {
      position: POSITION.BOTTOM_RIGHT,
    })

    return
  }

  ProjectsStore.addProject(projectName.value, projectPerformer.value, projectStatus.value)

  projectName.value = ''
  projectPerformer.value = ''
  projectStatus.value = ''
}
</script>

<template>
  <ModalWindow name="Новий проект" @add="addItem">
    <template v-slot:main>
      <form class="form">
        <input
          class="form__input form__input--text"
          type="text"
          placeholder="Введіть назву проекту"
          v-model="projectName"
          required
        />
        <input
          class="form__input form__input--text"
          type="text"
          placeholder="Введіть опис"
          v-model="projectPerformer"
          required
        />
        <select name="status" v-model="projectStatus" class="form__input form__input--status" required>
          <option disabled value="">Обрати статус</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </form>
    </template>
  </ModalWindow>
</template>

<style lang="scss" scoped>
$color-primary: #3b82f6;
$color-gray-50: #f9fafb;
$color-gray-100: #f3f4f6;
$color-gray-200: #e5e7eb;
$color-gray-400: #9ca3af;
$color-gray-600: #4b5563;
$color-gray-900: #111827;

@mixin transition-smooth {
  transition: all 0.2s ease-in-out;
}

@mixin input-focus {
  &:focus {
    border-color: $color-primary;
    outline: none;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
  }
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  margin-inline: 20px;
  padding: 20px 0;

  &__input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid $color-gray-200;
    border-radius: 8px;
    font-size: 1rem;
    color: $color-gray-900;
    background-color: $color-gray-50;

    @include transition-smooth;
    @include input-focus;

    &::placeholder {
      color: $color-gray-400;
    }

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    &--status {
      cursor: pointer;
    }
  }
}
</style>
