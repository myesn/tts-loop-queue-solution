<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import { TTSPlayer } from '../utils/ttsPlayer';

interface Item {
  id: number;
  name: string;
}

const name = ref<string>('');
const itemLength = ref<number>(0);
const items: Item[] = reactive([]);
const nameReadQueue: string[] = reactive([]);
const isNameReadQueueLoopFinished = ref(true);
const tts = new TTSPlayer();
/** 当前朗读的索引 */
const index = ref(0);

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

  // 生成要朗读的文本数组（当阅读队列中的数据朗读完毕后才开始生成新的阅读列表）
  if (!isNameReadQueueLoopFinished.value) {
    return;
  }

  nameReadQueue.length = 0;
  nameReadQueue.push.apply(
    nameReadQueue,
    items.map((item) => `${item.name}入住`)
  );
});

watchEffect(async () => {
  if (!nameReadQueue.length) {
    return;
  }

  // 只要开始朗读，就代表阅读队列中的数据未读取完毕（标记阅读队列未循环完毕）
  isNameReadQueueLoopFinished.value = false;

  if (index.value === -1) {
    index.value = 0;
  }
  
  await tts.speak(nameReadQueue[index.value]);

  // 依次朗读阅读队列中的文本，当朗读完最后一项时，又从头开始朗读
  if (index.value < nameReadQueue.length - 1) {
    setTimeout(() => {
      // 索引加1，阅读下一个文本
      index.value++;
    }, 0);
  } else {
    // 标记阅读队列已循环朗读完毕
    isNameReadQueueLoopFinished.value = true;
    setTimeout(() => {
      // 当阅读队列中的数据朗读完毕之后（loop end），必须将索引值改为 -1，因为当队列中只有一条数据时，索引将始终为 0，这导致源数据始终不会发生变化，从而不会引发 watchEffect 执行
      index.value = -1;
    }, 0);
  }
});
</script>

<template>
  <a-space>
    <a-input :style="{ width: '320px' }" placeholder="typing your name" allow-clear v-model="name" />
    <a-button type="primary" @click="handleAppendClick">append</a-button>
    <!-- <TTS :queue="speakNames" /> -->
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
