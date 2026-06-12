<template>
  <teleport to="body">
    <transition name="drawer-fade">
      <div v-if="open" class="drawer-backdrop" role="presentation" @click="close">
        <aside class="drawer-panel" role="dialog" aria-modal="true" :aria-label="title" @click.stop>
          <header class="drawer-header">
            <div>
              <p v-if="eyebrow" class="drawer-eyebrow">{{ eyebrow }}</p>
              <h2>{{ title }}</h2>
            </div>
            <button type="button" class="drawer-close" :aria-label="closeLabel" @click="close">
              <span class="drawer-close-icon" aria-hidden="true"></span>
            </button>
          </header>

          <div class="drawer-body">
            <slot />
          </div>
        </aside>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'DrawerMenu',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    eyebrow: {
      type: String,
      default: ''
    },
    closeLabel: {
      type: String,
      default: 'Close menu'
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const close = () => emit('close')

    return {
      close
    }
  }
}
</script>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(0, 0, 0, 0.52);
}

.drawer-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: min(320px, 86vw);
  height: 100%;
  background: #171717;
  color: #f8f1e7;
  border-right: 1px solid #333;
  box-shadow: 18px 0 44px rgba(0, 0, 0, 0.42);
  display: flex;
  flex-direction: column;
  padding: 18px;
}

.drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #2e2e2e;
}

.drawer-eyebrow {
  margin: 0;
  color: #c8aa65;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.drawer-header h2 {
  margin: 0;
  font-size: 1rem;
}

.drawer-close {
  border: 0;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  background: #252525;
  color: #f8f1e7;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.drawer-close-icon {
  position: relative;
  width: 14px;
  height: 14px;
}

.drawer-close-icon::before,
.drawer-close-icon::after {
  content: '';
  position: absolute;
  inset: 50% auto auto 50%;
  width: 14px;
  height: 2px;
  background: currentColor;
  border-radius: 999px;
  transform-origin: center;
}

.drawer-close-icon::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.drawer-close-icon::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.drawer-body {
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  min-height: 0;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.18s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-fade-enter-active .drawer-panel,
.drawer-fade-leave-active .drawer-panel {
  transition: transform 0.22s ease;
}

.drawer-fade-enter-from .drawer-panel,
.drawer-fade-leave-to .drawer-panel {
  transform: translateX(-100%);
}

@media (max-width: 620px) {
  .drawer-panel {
    width: min(300px, 88vw);
    padding: 16px;
  }
}
</style>
