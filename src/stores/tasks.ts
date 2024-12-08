import type { Task } from '@/types/Task'
import { getFromLocalStorage } from '@/utils/getFromLocalStorage'
import { getData } from '@/utils/httpClient'
import { defineStore } from 'pinia'
import { POSITION, useToast } from 'vue-toastification'

const toast = useToast()

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    isLoading: true as boolean,
    error: null as string | null,
  }),

  getters: {
    taskByProjectId(state) {
      return (projectId: number) => state.tasks.filter((task) => task.projectId === projectId)
    },
    NumberOfTasksByProjctId(state) {
      return (projectId: number) => this.taskByProjectId(projectId).length
    },
    taskById(state) {
      return (taskId: number) => state.tasks.find((task) => task.id === taskId)
    },
    newTaskId(state) {
      return state.tasks.reduce((max, cur) => (max < cur.id ? cur.id : max), -1) + 1
    },
  },
  actions: {
    async fetchTasks() {
      const projectsInLocalStorage: Task[] | null = getFromLocalStorage<Task[]>('tasks')

      if (projectsInLocalStorage) {
        this.tasks = projectsInLocalStorage
      } else {
        try {
          this.tasks = await getData<Task[]>('api/tasks.json')
        } catch {
          this.error = 'Помилка завантаження завдань'
        }
      }

      this.isLoading = false
    },
    addTask(
      projectId: number,
      name: string,
      performer: string,
      status: string,
      deadline: Date,
    ) {
      const isoString = deadline.toISOString()

      this.tasks.push({ id: this.newTaskId, projectId, name, performer, status, deadline:isoString })

      localStorage.setItem('tasks', JSON.stringify(this.tasks))

      toast.success('Завдання успішно додано', {
        position: POSITION.BOTTOM_RIGHT,
      })
    },
    updateTaskStatus(id: number, newStatus: string) {
      const taskIndex = this.tasks.findIndex((task) => task.id === id)
      this.tasks[taskIndex].status = newStatus;

      localStorage.setItem('tasks', JSON.stringify(this.tasks))

      toast.success('Cтатус завдання змінено', {
        position: POSITION.BOTTOM_RIGHT,
      })
    },
  },
})
