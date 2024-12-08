<script setup lang="ts">
import { useProjectsStore } from '@/stores/projects'
import { onMounted, reactive, defineEmits, ref, watch } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const emit = defineEmits(['updateStatus'])
const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
})

type Task = {
  id: number
}

const ProjectsStore = useProjectsStore()

const tasks = reactive({
  todo: [] as Task[],
  inProgress: [] as Task[],
  done: [] as Task[],
})

let currentStatus = props.status;

onMounted(() => {
  switch (props.status) {
    case 'To Do':
      tasks.todo.push({ id: 1 })
      break

    case 'In Progress':
      tasks.inProgress.push({ id: 1 })
      break
    case 'Done':
      tasks.done.push({ id: 1 })
      break
  }
})

function updateStatus () {
  const newStatus = tasks.todo.length === 1 ? 'To Do' : tasks.inProgress.length === 1 ? 'In Progress' : 'Done'

  if (newStatus === currentStatus) {
    return
  }

  currentStatus = newStatus;

  emit('updateStatus', currentStatus , props.id);
}
</script>

<template>
  <div class="task-board">
    <!-- Секція To Do -->
    <div class="task-column">
      <draggable
        :list="tasks.todo"
        :group="`tasks_${id}`"
        class="task-list"
        item-key="id"
        :options="{ draggable: '.creator' }"
        @end="updateStatus"
      >
        <div v-for="element in tasks.todo" :key="element.id" class="status-item todo">To Do</div>
      </draggable>
    </div>

    <!-- Секція In Progress -->
    <div class="task-column">
      <draggable
        :list="tasks.inProgress"
        :group="`tasks_${id}`"
        class="task-list"
        item-key="id"
        :options="{ draggable: '.creator' }"
        @end="updateStatus"
      >
        <div v-for="element in tasks.inProgress" :key="element.id" class="status-item in-progress">
          In Progress
        </div>
      </draggable>
    </div>

    <!-- Секція Done -->
    <div class="task-column">
      <draggable
        :list="tasks.done"
        :group="`tasks_${id}`"
        class="task-list"
        @end="updateStatus"
      >
        <div v-for="element in tasks.done" :key="element.id" class="status-item done">Done</div>
      </draggable>
    </div>
  </div>
</template>

<style lang="scss">
$color-red-50: #fecaca;
$color-red-900: #7f1d1d;

$color-orange-50: #fef3c7;
$color-orange-900: #78350f;

$color-green-50: #d1fae5;
$color-green-900: #064e3b;

.task-board {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.item-dropzone-area {
  height: 2rem;
  background: #888;
  opacity: 0.8;
  animation-duration: 0.5s;
  animation-name: nodeInserted;
}

.status-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 0.75rem;
  font-weight: 500;

  border-radius: 10%;

  &.todo {
    background-color: $color-red-50;
    color: $color-red-900;
  }

  &.in-progress {
    background-color: $color-orange-50;
    color: $color-orange-900;
  }

  &.done {
    background-color: $color-green-50;
    color: $color-green-900;
  }
}
</style>
