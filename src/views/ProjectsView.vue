<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import GeneralTable from '@/components/GeneralTable.vue'
import type { Project } from '@/types/Project'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { convertToShortDate } from '@/utils/convertToShortDate'
import ModalWindow from '@/components/AddProjectModal.vue'
import router from '@/router'
import { POSITION, useToast } from 'vue-toastification'
import { getFromLocalStorage } from '@/utils/getFromLocalStorage'
import StatisticsModal from '@/components/StatisticsModal.vue'

const toast = useToast()
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const { isLoading: isLoadingProject, error: errorProject, projects } = toRefs(projectsStore)
const { isLoading: isLoadingTasks, error: errorTasks } = toRefs(tasksStore)
const { NumberOfTasksByProjctId } = tasksStore

const isModalOpen = ref(false)
const isModalStatisticsOpen = ref(false)

const query = ref(getFromLocalStorage<string>('projectsQuery') || '')
const status = ref(getFromLocalStorage<string>('projectsStatus') || '')

const visibleProjects = computed(() => {
  return projects.value.filter((project) => {
    const matchesQuery =
      !query.value || project.name.toLowerCase().includes(query.value.trim().toLowerCase())
    const matchesStatus = !status.value || project.status === status.value

    return matchesQuery && matchesStatus
  })
})

onMounted(() => {
  projectsStore.fetchProjects()
  tasksStore.fetchTasks()
})

watch(status, (newVal) => {
  localStorage.setItem('projectsStatus', JSON.stringify(newVal))
})

watch(query, (newVal) => {
  localStorage.setItem('projectsQuery', JSON.stringify(newVal))
})

function ToggleModal() {
  isModalOpen.value = !isModalOpen.value
}

function ToggleStatisticsModal() {
  isModalStatisticsOpen.value = !isModalStatisticsOpen.value
}
function goToTasks(projectId: string) {
  router.push(`/tasks/${projectId}`)

  toast.info(
    `Ви перейшли до проекту №${projectId} "${projects.value.find((project) => project.id === +projectId)?.name}"`,
    {
      position: POSITION.BOTTOM_RIGHT,
    },
  )
}
</script>

<template>
  <ModalWindow v-if="isModalOpen" @close="ToggleModal"></ModalWindow>
  <StatisticsModal v-if="isModalStatisticsOpen" @close="ToggleStatisticsModal"></StatisticsModal>
  <header class="projects-container">
    <div class="projects-header">
      <span class="projects-title">Проекти</span>

      <div class="projects-buttons">
        <button type="button" class="add-project-btn" @click="ToggleModal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Додати проект
        </button>
        <button type="button" class="add-project-btn" @click="ToggleStatisticsModal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Статистика
        </button>
      </div>
    </div>

    <div class="forms-container">
      <div class="form-group">
        <form @submit.prevent="">
          <input
            type="text"
            placeholder="Введіть назву проекту"
            v-model="query"
            class="project-input"
          />
        </form>
      </div>

      <div class="form-group">
        <form @submit.prevent="">
          <select name="status" v-model="status" class="project-select">
            <option value="" selected>Всі статуси</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </form>
      </div>
    </div>
  </header>

  <h1 v-if="isLoadingProject || isLoadingTasks">Завантаження...</h1>
  <h1 v-if="errorProject || errorTasks">Помилка: {{ errorProject || errorTasks }}</h1>

  <GeneralTable
    v-if="!isLoadingProject && !isLoadingTasks && !errorProject && !errorTasks"
    @goToItem="goToTasks"
    name="projects"
    :key="visibleProjects.length"
    :isRowsDraggable="false"
    :customColumns="[
      { name: 'Id', width: 150, sort: true },
      { name: 'Назва', width: 150, sort: true },
      { name: 'Кількість завдань', width: 150, sort: true },
      { name: 'Статус', width: 150, sort: true },
      { name: 'Дата створення', width: 150, sort: false },
    ]"
    :customRows="
      visibleProjects.map((project: Project) => [
        project.id.toString(),
        project.name,
        NumberOfTasksByProjctId(project.id).toString(),
        project.status,
        convertToShortDate(project.creationDate),
      ])
    "
  />
</template>

<style>
.projects-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 15px;
  font-family: Arial, sans-serif;
}

.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.projects-title {
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.add-project-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
}

.add-project-btn:hover {
  background-color: #2980b9;
}

.forms-container {
  display: flex;
  gap: 20px;
}

.form-group {
  flex: 1;
}

.project-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.project-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

.project-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M1 4l5 5 5-5z' fill='%23999'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.projects-buttons {
  display: flex;
  gap: 20px;
}

.project-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}
</style>
