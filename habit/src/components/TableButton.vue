<script setup lang="ts">
import type {Component} from "vue";
import {NIcon, NP} from 'naive-ui'

interface Props {
  title: string,
  color?: string,
  backgroundColor: string,
  icon: Component,
  confirmComponent?: Component,
  confirmShowIcon?: boolean,
  click?: Function,
  confirm?: boolean,
  confirmText?: string,
  size?: string,
}

const props = withDefaults(defineProps<Props>(), {
  color: 'snow',
  confirm: false,
  confirmShowIcon: true,
  confirmText: '',
  size: 'tiny',
  confirmComponent: null,
  click: () => {
  }
});
</script>

<template>
  <n-popconfirm v-if="props.confirm"
                :show-icon="props.confirmShowIcon"
                positive-text="确认"
                :negative-text="null"
                @positive-click="props.click">
    <template #trigger>
      <n-button
          :title="props.title"
          :color="props.backgroundColor"
          :style="{color: props.color}"
          :size="props.size"
          circle>
        <template #icon>
          <n-icon>
            <component :is="icon"/>
          </n-icon>
        </template>
      </n-button>
    </template>
    <span v-if="!props.confirmComponent">
      {{ props.confirmText }}
    </span>
    <component v-if="props.confirmComponent" :is="confirmComponent"/>
  </n-popconfirm>
  <n-button v-if="!props.confirm"
            :title="props.title"
            :color="props.backgroundColor"
            :style="{color: props.color}"
            @click="props.click"
            :focusable="false"
            :size="props.size"
            circle>
    <template #icon>
      <n-icon>
        <component :is="icon"/>
      </n-icon>
    </template>
  </n-button>
</template>

