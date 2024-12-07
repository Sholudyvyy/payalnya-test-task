import type { Project } from '@/types/Project'
import { getFromLocalStorage } from '@/utils/getFromLocalStorage'
import { getData } from '@/utils/httpClient'
import { defineStore } from 'pinia'
import { POSITION, useToast } from 'vue-toastification'

const toast = useToast()

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    isLoading: true as boolean,
    error: null as string | null,
  }),

  getters: {
    projectById(state) {
      return (projectId: number) => state.projects.find((projects) => projects.id === projectId)
    },
    newProjectId(state) {
      return state.projects.reduce((max, cur) => (max < cur.id ? cur.id : max), -1) + 1
    },
  },
  actions: {
    async fetchProjects() {
      const projectsInLocalStorage: Project[] | null = getFromLocalStorage<Project[]>('projects')

      if (projectsInLocalStorage) {
        this.projects = projectsInLocalStorage
      } else {
        try {
          this.projects = await getData<Project[]>('api/projects.json')
          localStorage.setItem('projects', JSON.stringify(this.projects))
        } catch {
          this.error = 'Помилка завантаження проєктів'
        }
      }

      this.isLoading = false
    },
    addProject(name: string, status: string, description: string) {
      const now = new Date()
      const isoString = now.toISOString()

      this.projects.push({
        id: this.newProjectId,
        name,
        status,
        creationDate: isoString,
        description,
      })

      localStorage.setItem('projects', JSON.stringify(this.projects))

      toast.success('Проект успішно додано', {
        position: POSITION.BOTTOM_RIGHT,
      })
    },
  },
})
