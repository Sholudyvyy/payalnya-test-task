<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const chartData = {
  labels: ['January', 'February', 'March'],
  datasets: [{ data: [40, 20, 12] }],
}
const chartOptions = {
  responsive: true,
}
</script>

<template>
  <Pie id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>
