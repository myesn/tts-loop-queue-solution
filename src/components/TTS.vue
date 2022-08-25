<script setup lang="ts">
import { readonly, ref, reactive, watchEffect } from 'vue';
import { TTSPlayer } from '../utils/ttsPlayer';

export interface Item {
  id: number;
  name: string;
}
export interface TTSComponentProps {
  items: Item[];
}

// withDefaults(为 defineProps 提供默认值): https://cn.vuejs.org/api/sfc-script-setup.html#typescript-only-features
// 导入的 interface 无法在 SFC 的 defineProps<TTSComponentProps>() 中使用：https://github.com/vuejs/core/issues/4294#issuecomment-1216479946
// 所以目前只能将类型定义到当前 SFC 中
const props = withDefaults(defineProps<TTSComponentProps>(), {
  items: () => [],
});
const { items } = readonly(props);
const tts = new TTSPlayer();
const nameReadQueue: string[] = reactive([]);
const isNameReadQueueLoopFinished = ref(true);
/** 当前朗读的索引 */
const index = ref(0);

watchEffect(() => {
  // 生成要朗读的文本数组（当队列中的数据循环完一次后才开始生成新的阅读列表）
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

  // 如果等于 -1，则代表从头开始朗读，由于 -1 只是为了引起数据源发生变化导致 watchEffect 执行，所以这里还需要将 -1 矫正为 0
  if (index.value === -1) {
    index.value = 0;
  }

  await tts.init();
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
      // 当阅读队列中的数据朗读完毕之后（loop end），必须将索引值改为 -1，因为当队列中只有一条数据时，索引将始终为0，这导致源数据始终不会发生变化，从而不会引发 watchEffect 执行
      index.value = -1;
    }, 0);
  }
});
</script>
<template></template>
