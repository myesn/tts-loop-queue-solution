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