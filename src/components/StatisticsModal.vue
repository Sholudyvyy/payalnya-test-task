<script setup lang="ts">
import ModalWindow from './ModalWindow.vue'
import { useProjectsStore } from '@/stores/projects'
import PieChart from './PieChart.vue'
import { useTasksStore } from '@/stores/tasks'
import { computed } from 'vue'

const tasksStore = useTasksStore()
const countOfTodoTask = computed(
  () => tasksStore.tasks.filter((task) => task.status === 'To Do').length,
)

const countOfInProgressTask = computed(
  () => tasksStore.tasks.filter((task) => task.status === 'In Progress').length,
)

const countOfDoneTodoTask = computed(
  () => tasksStore.tasks.filter((task) => task.status === 'Done').length,
)

const chartData = computed(() => ({
  labels: ['To do', 'In progress', 'Done'],
  datasets: [
    {
      data: [countOfTodoTask.value, countOfInProgressTask.value, countOfDoneTodoTask.value],
      backgroundColor: ['#E46651', '#cccc33', '#41B883'],
    },
  ],
}))
const chartOptions = { responsive: true }
</script>

<template>
  <ModalWindow name="Статистика">
    <template v-slot:main
      ><div class="container">
        <PieChart class="container__chart" :data="chartData" :options="chartOptions" /></div
    ></template>
    <template v-slot:footer><template></template></template>
  </ModalWindow>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;

  height: auto;

  &__chart {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  overflow: hidden;
}
}
</style>
