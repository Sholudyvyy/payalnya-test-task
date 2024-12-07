import { createWebHashHistory, createRouter } from 'vue-router'

import Projects from './views/ProjectsView.vue'
import Tasks from './views/TasksView.vue'

const routes = [
  { path: '/', component: Projects },
  { path: '/tasks/:projectId', component: Tasks },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
