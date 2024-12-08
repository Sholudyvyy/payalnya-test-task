<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { sortTable } from '@/utils/sortTable'
import { POSITION, useToast } from 'vue-toastification'
import { getFromLocalStorage } from '@/utils/getFromLocalStorage'
import StatusController from './StatusController.vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const emit = defineEmits(['updateStatus', 'goToItem'])
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  isRowsDraggable: {
    type: Boolean,
    required: true,
  },
  customColumns: {
    type: Array as () => Array<{ name: string; width: number; sort: boolean }>,
    required: true,
  },
  customRows: {
    type: Array as () => Array<Array<string>>,
    required: true,
  },
})
const toast = useToast()
const isModalOpen = ref(false)
const columns = reactive(props.customColumns.map((column) => ({ ...column })))
const rows = reactive(props.customRows.map((row) => [...row]))
const indexOfSortColumn = ref(
  getFromLocalStorage<number>(`${props.name}IndexOfSortColumn`) === null
    ? -1
    : getFromLocalStorage<number>(`${props.name}IndexOfSortColumn`),
)
const sortOrder = ref(getFromLocalStorage<string>(`${props.name}SortOrder`) || '')
const query = ref('')
const status = ref('')
const isResizing = ref(false)
const currentColumn = ref<number>()
const startX = ref(0)
const startWidth = ref(0)

onMounted(() => {
  if (indexOfSortColumn.value !== null && indexOfSortColumn.value >= 0) {
    rows.splice(0, rows.length, ...sortTable(rows, sortOrder.value, indexOfSortColumn.value))
  }
})

watch(indexOfSortColumn, (newVal) => {
  localStorage.setItem(`${name}IndexOfSortColumn`, JSON.stringify(newVal))
})

watch(sortOrder, (newVal) => {
  localStorage.setItem(`${name}SortOrder`, JSON.stringify(newVal))
})

function startResize(event: MouseEvent, index: number) {
  isResizing.value = true
  currentColumn.value = index
  startX.value = event.clientX
  startWidth.value = columns[index].width

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}
function handleResize(event: MouseEvent) {
  if (!isResizing.value) return

  const deltaX = event.clientX - startX.value
  const newWidth = startWidth.value + deltaX

  columns[currentColumn.value as number].width = Math.min(Math.max(50, newWidth), 300)
}

function stopResize() {
  isResizing.value = false
  currentColumn.value = undefined

  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

function sortColumns(rowIndex: number) {
  toast.success('Таблиця відсортована', {
    position: POSITION.BOTTOM_RIGHT,
  })

  if (indexOfSortColumn.value === rowIndex) {
    sortOrder.value = sortOrder.value === '' ? 'asc' : sortOrder.value === 'asc' ? 'desc' : ''
  } else {
    sortOrder.value = 'asc'
  }

  if (sortOrder.value === '') {
    rows.splice(0, rows.length, ...props.customRows.map((row) => [...row]))
    indexOfSortColumn.value = -1

    return
  }

  indexOfSortColumn.value = rowIndex

  rows.splice(0, rows.length, ...sortTable(rows, sortOrder.value, indexOfSortColumn.value))
}

function endDrag() {
  toast.success('Порядок завдань змінено', {
    position: POSITION.BOTTOM_RIGHT,
  })
}

function updateStatus(newStatus: string, id: number) {
  emit('updateStatus', newStatus, id)
}
</script>

<template>
  <div class="table-container">
    <table class="elegant-table">
      <thead>
        <tr>
          <th
            scope="col"
            v-for="(column, index) of columns"
            :key="index"
            :style="{ width: column.width + 'px' }"
            class="table-header"
          >
            <div class="header-content">
              {{ column.name }}
              <span v-if="column.sort" @click="sortColumns(index)" class="sort-icon">
                {{ index === indexOfSortColumn ? sortOrder : '↕' }}
              </span>
            </div>
            <div class="resizer" @mousedown="startResize($event, index)"></div>
          </th>
        </tr>
      </thead>

      <draggable
        v-if="rows.length"
        :list="rows"
        tag="tbody"
        item-key="id"
        :disabled="!isRowsDraggable"
        @update="endDrag"
      >
        <transition-group type="transition" name="flip-list">
          <tr
            class="table-row"
            v-for="element in rows"
            :key="element[0]"
            @click="$emit('goToItem', element[0])"
            :class="{ 'hover-effect': true }"
          >
            <template v-for="(rowDate, index) of element" :key="index">
              <th scope="row" v-if="index === 0" class="table-row-header">
                {{ rowDate }}
              </th>
              <td v-else-if="index === 3" class="status-cell">
                <StatusController
                  :id="+element[0]"
                  :status="rowDate"
                  @updateStatus="updateStatus"
                ></StatusController>
              </td>
              <td v-else class="table-cell">{{ rowDate }}</td>
            </template>
          </tr>
        </transition-group>
      </draggable>

      <tbody v-else>
        <tr class="empty-table">
          <td colspan="5">
            <div class="empty-state">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="empty-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 class="empty-text">
                Немає даних для відображення, але Ви завжди можете їх додати
              </h2>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
$color-white: #ffffff;
$color-gray-50: #f9fafb;
$color-gray-200: #e5e7eb;
$color-gray-400: #9ca3af;
$color-gray-500: #6b7280;
$color-gray-600: #4b5563;
$color-gray-700: #374151;

$color-blue-500: #3b82f6;

$color-red-50: #fecaca;
$color-red-900: #7f1d1d;

$color-orange-50: #fef3c7;
$color-orange-900: #78350f;

$color-green-50: #d1fae5;
$color-green-900: #064e3b;

@mixin box-shadow-light {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@mixin transition-smooth {
  transition: all 0.2s ease;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  @include box-shadow-light;

  .elegant-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background-color: $color-white;

    .table-header {
      position: relative;
      background-color: $color-gray-50;
      color: $color-gray-700;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      padding: 12px 16px;
      border-bottom: 1px solid $color-gray-200;
      @include transition-smooth;

      .header-content {
        display: flex;
        justify-content: center;
        align-items: center;

        .sort-icon {
          cursor: pointer;
          margin-left: 8px;
          opacity: 0.5;
          @include transition-smooth;

          &:hover {
            opacity: 1;
          }
        }
      }

      .resizer {
        position: absolute;
        top: 0;
        right: 0;
        width: 5px;
        height: 100%;
        cursor: col-resize;
        background-color: transparent;
        @include transition-smooth;

        &:hover {
          background-color: $color-blue-500;
        }
      }
    }

    .table-row {
      @include transition-smooth;

      &.hover-effect:hover {
        background-color: $color-gray-50;
      }

      .table-row-header {
        font-weight: 500;
        color: $color-gray-600;
        background-color: $color-gray-50;
      }

      .table-cell {
        padding: 12px 16px;
        border-bottom: 1px solid $color-gray-200;
        color: $color-gray-500;
        text-align: center;
      }

      .status-cell {
        padding: 0;
      }
    }

    .empty-table {
      text-align: center;

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
        color: $color-gray-500;

        .empty-icon {
          width: 48px;
          height: 48px;
          color: $color-blue-500;
          margin-bottom: 16px;
        }

        .empty-text {
          font-size: 1rem;
          color: $color-gray-600;
        }
      }
    }
  }
}
</style>
