<script setup lang="ts">
import { ref } from 'vue'
import ModalWindow from './ModalWindow.vue'
import { useTasksStore } from '@/stores/tasks'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { POSITION, useToast } from 'vue-toastification'

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
})

const toast = useToast()
const tasksStore = useTasksStore()
const taskName = ref('')
const taskPerformer = ref('')
const taskStatus = ref('')
const taskDeadline = ref()

function addItem() {
  if (!taskName.value || !taskPerformer.value || !taskStatus.value || !taskDeadline.value) {
    toast.error('Всі поля мають бути заповнені!', {
      position: POSITION.BOTTOM_RIGHT,
    })

    return
  }

  tasksStore.addTask(
    props.projectId,
    taskName.value,
    taskPerformer.value,
    taskStatus.value,
    taskDeadline.value,
  )

  taskName.value = ''
  taskPerformer.value = ''
  taskStatus.value = ''
  taskDeadline.value = null
}
</script>

<template>
  <ModalWindow name="Нове завдання" @add="addItem">
    <template v-slot:main>
      <form class="task-form">
        <div class="form-group">
          <label for="taskName" class="form-label">Назва завдання</label>
          <div class="input-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="input-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <input
              id="taskName"
              type="text"
              placeholder="Введіть назву завдання"
              v-model="taskName"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="taskPerformer" class="form-label">Виконавець</label>
          <div class="input-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="input-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <input
              id="taskPerformer"
              type="text"
              placeholder="Оберіть виконавця"
              v-model="taskPerformer"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="taskStatus" class="form-label">Статус</label>
          <div class="input-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="input-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <select name="status" v-model="taskStatus" class="form-input" required>
              <option disabled value="">Обрати статус</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="taskDeadline" class="form-label">Термін закінчення</label>
          <div class="input-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="input-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <VueDatePicker
              id="taskDeadline"
              v-model="taskDeadline"
              placeholder="Оберіть термін закінчення"
              :min-date="new Date()"
              class="form-input"
              required
            />
          </div>
        </div>
      </form>
    </template>
  </ModalWindow>
</template>

<style lang="scss" scoped>
$color-gray-50: #9ca3af;
$color-gray-400: #6b7280;
$color-gray-600: #374151;
$color-gray-200: #e5e7eb;

$color-blue-500: #3b82f6;
$color-blue-100: rgba(59, 130, 246, 0.1);

.task-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: $color-gray-600;
  margin-left: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .input-icon {
    position: absolute;
    left: 12px;
    width: 20px;
    height: 20px;
    color: $color-gray-400;
    z-index: 10;
  }

  .form-input {
    width: 100%;
    padding: 12px 12px 12px 44px;
    border: 1px solid $color-gray-200;
    border-radius: 8px;
    font-size: 1rem;
    color: $color-gray-600;
    transition: {
      property: border-color, box-shadow;
      duration: 0.2s;
      timing-function: ease;
    }

    &:focus {
      outline: none;
      border-color: $color-blue-500;
      box-shadow: 0 0 0 3px $color-blue-100;
    }

    &::placeholder {
      color: $color-gray-50;
    }
  }
}

.v-picker {
  width: 100%;
}
</style>
