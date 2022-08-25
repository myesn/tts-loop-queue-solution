<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import { Item } from './type'
import TTS from './TTS.vue';

const name = ref<string>('');
const itemLength = ref<number>(0);
const items: Item[] = reactive([{id: 1, name: '张三'}]);

function handleAppendClick() {
  if (!name.value || items.some((item) => item.name === name.value)) {
    return;
  }

  items.push({
    id: Date.now(),
    name: name.value,
  });
  name.value = '';
}

function handleUpdateClick(id: number) {
  const item = items.find((item) => item.id === id);
  if (!item) {
    return;
  }

  const newName = prompt('name:', item.name) as string;
  if (!newName) {
    return;
  }

  item.name = newName;
}

function handleRemoveClick(id: number) {
  const index = items.findIndex((item) => item.id === id);
  if (index > -1) {
    items.splice(index, 1);
  }
}

watchEffect(() => {
  // 计算人员总数
  itemLength.value = items.length;
});
</script>

<template>
  <a-space>
    <a-input :style="{ width: '320px' }" placeholder="typing your name" allow-clear v-model="name" />
    <a-button type="primary" @click="handleAppendClick">append</a-button>
    <TTS :items="items" />
  </a-space>

  <a-typography-title :heading="6">
    There are currently
    <a-tag color="#00b42a">{{ itemLength }}</a-tag>
    people.
  </a-typography-title>
  <a-space v-if="items.length" direction="vertical" fill>
    <a-space v-for="{ id, name } in items" :key="id">
      {{ name }}
      <a-button type="primary" size="mini" @click="() => handleUpdateClick(id)">update</a-button>
      <a-button type="primary" size="mini" status="danger" @click="() => handleRemoveClick(id)">remove</a-button>
    </a-space>
  </a-space>
  <a-empty v-else />
</template>
