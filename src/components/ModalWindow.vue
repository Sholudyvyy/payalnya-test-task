<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-container">
      <div class="modal">
        <header class="modal__header">
          <slot name="header">
            <h1 class="modal__title">{{ name }}</h1>
            <button
              type="button"
              class="modal__close-btn"
              @click="$emit('close')"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </slot>
        </header>

        <main class="modal__main">
          <slot name="main"> </slot>
        </main>

        <footer class="modal__footer">
          <slot name="footer">
            <button type="button" class="modal__btn modal__btn--cancel" @click="$emit('close')">
              Скасувати
            </button>
            <button type="button" class="modal__btn modal__btn--confirm" @click="$emit('add')">
              Додати
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$color-white: #ffffff;
$color-black: rgba(0, 0, 0, 0.5);

$color-gray-50: #f9fafb;
$color-gray-100: #f3f4f6;
$color-gray-200: #e5e7eb;
$color-gray-400: #9ca3af;
$color-gray-500: #6b7280;
$color-gray-600: #4b5563;
$color-gray-700: #374151;
$color-gray-900: #111827;

$color-blue-500: #3b82f6;
$color-blue-600: #2563eb;

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@mixin transition-smooth {
  transition:
    background-color 0.2s,
    color 0.2s,
    transform 0.1s;
}

@mixin hover-effect {
  &:hover {
    background-color: $color-gray-100;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-container {
  width: 100%;
  max-width: 600px;
  margin: 0 20px;
}

.modal {
  background: $color-white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  animation: modal-appear 0.3s ease-out;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background-color: $color-gray-50;
    border-bottom: 1px solid $color-gray-200;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: $color-gray-900;
    margin: 0;
  }

  &__close-btn {
    background: none;
    border: none;
    color: $color-gray-500;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    @include transition-smooth;
    @include hover-effect;

    &:hover {
      color: $color-gray-900;
    }
  }

  &__main {
    padding: 20px;
    flex-grow: 1;
    overflow-y: auto;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    background-color: $color-gray-50;
    border-top: 1px solid $color-gray-200;
    gap: 12px;
  }

  &__btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    @include transition-smooth;

    &:active {
      transform: scale(0.98);
    }

    &--cancel {
      background-color: $color-gray-100;
      color: $color-gray-700;
      @include hover-effect;

      &:hover {
        background-color: $color-gray-200;
      }
    }

    &--confirm {
      background-color: $color-blue-500;
      color: $color-white;

      &:hover {
        background-color: $color-blue-600;
      }
    }
  }
}
</style>
