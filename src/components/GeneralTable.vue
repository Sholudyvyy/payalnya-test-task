<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { sortTable } from '@/utils/sortTable'
import draggable from 'vuedraggable'
import { POSITION, useToast } from 'vue-toastification'
import { getFromLocalStorage } from '@/utils/getFromLocalStorage'

export default defineComponent({
  name: 'GeneralTable',
  components: { draggable },
  props: {
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
  },
  setup(props) {
    const toast = useToast()
    const isModalOpen = ref(false)
    const columns = ref(props.customColumns.map((column) => ({ ...column })))
    const rows = ref(props.customRows.map((row) => [...row]))
    const indexOfSortColumn = ref(
      getFromLocalStorage<number>(`${props.name}IndexOfSortColumn`) === null
        ? -1
        : getFromLocalStorage<number>(`${props.name}IndexOfSortColumn`),
    )
    const sortOrder = ref(getFromLocalStorage<string>(`${props.name}SortOrder`) || '')

    const tasks = {
      todo: [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ],
      inProgress: [{ id: 3, title: 'Task 3' }],
      done: [{ id: 4, title: 'Task 4' }],
    }

    const state = reactive({
      query: '',
      status: '',
      isResizing: false,
      currentColumn: null as number | null,
      startX: 0,
      startWidth: 0,
    })

    return {
      toast,
      tasks,
      isModalOpen,
      indexOfSortColumn,
      sortOrder,
      columns,
      rows,
      ...state,
    }
  },

  mounted() {
    if (this.indexOfSortColumn !== null && this.indexOfSortColumn >= 0) {
      this.rows = sortTable(this.rows, this.sortOrder, this.indexOfSortColumn)
    }
  },

  watch: {
    indexOfSortColumn(newVal) {
      localStorage.setItem(`${this.name}IndexOfSortColumn`, JSON.stringify(newVal))
    },
    sortOrder(newVal) {
      localStorage.setItem(`${this.name}SortOrder`, JSON.stringify(newVal))
    },
  },

  methods: {
    startResize(event: MouseEvent, index: number) {
      this.isResizing = true
      this.currentColumn = index
      this.startX = event.clientX
      this.startWidth = this.columns[index].width

      document.addEventListener('mousemove', this.handleResize)
      document.addEventListener('mouseup', this.stopResize)
    },
    handleResize(event: MouseEvent) {
      if (!this.isResizing) return

      const deltaX = event.clientX - this.startX
      const newWidth = this.startWidth + deltaX

      this.columns[this.currentColumn as number].width = Math.min(Math.max(50, newWidth), 300)
    },
    stopResize() {
      this.isResizing = false
      this.currentColumn = null

      document.removeEventListener('mousemove', this.handleResize)
      document.removeEventListener('mouseup', this.stopResize)
    },
    sortColumns(rowIndex: number) {
      this.toast.success('Таблиця відсортована', {
        position: POSITION.BOTTOM_RIGHT,
      })

      if (this.indexOfSortColumn === rowIndex) {
        this.sortOrder = this.sortOrder === '' ? 'asc' : this.sortOrder === 'asc' ? 'desc' : ''
      } else {
        this.sortOrder = 'asc'
      }

      if (this.sortOrder === '') {
        this.rows = this.customRows.map((row) => [...row])
        this.indexOfSortColumn = -1

        return
      }

      this.indexOfSortColumn = rowIndex

      this.rows = sortTable(this.rows, this.sortOrder, this.indexOfSortColumn)
    },
    endDrag() {
      this.toast.success('Порядок завдань змінено', {
        position: POSITION.BOTTOM_RIGHT,
      })
    },
  },
})
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
        v-model="rows"
        tag="tbody"
        item-key="name"
        :disabled="!isRowsDraggable"
        @end="endDrag"
      >
        <template #item="{ element }">
          <tr
            class="table-row"
            @click="$emit('goToItem', element[0])"
            :class="{ 'hover-effect': true }"
          >
            <template v-for="(date, index) of element" :key="index">
              <th scope="row" v-if="index === 0" class="table-row-header">
                {{ date }}
              </th>
              <td v-else-if="index === 3" class="status-cell">
                <div class="status-container">
                  <div class="status-item todo" :style="{ visibility: date === 'To Do' ? 'visible' : 'hidden' }">To Do</div>
                  <div class="status-item in-progress" :style="{ visibility: date === 'In Progress' ? 'visible' : 'hidden' }">In Progress</div>
                  <div class="status-item done" :style="{ visibility: date === 'Done' ? 'visible' : 'hidden' }">Done</div>
                </div>
              </td>
              <td v-else class="table-cell">{{ date }}</td>
            </template>
          </tr>
        </template>
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
        justify-content: space-between;
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
      }

      .status-cell {
        padding: 0;

        .status-container {
          display: flex;
          height: 100%;

          .status-item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            font-size: 0.75rem;
            font-weight: 500;

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
        }
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
