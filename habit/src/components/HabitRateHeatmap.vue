<script setup lang="ts">
import {ref, computed} from "vue";
import chroma from 'chroma-js';

interface Props {
  items: any,
}

const props = withDefaults(defineProps<Props>(), {});

const days = computed(() => {
  return props.items ? props.items[0].clock_days.split(',').reverse() : [];
});
const habits = computed(() => {
  return props.items?.map((item: any) => {
    return item.habit_name
  });
});
const data = computed(() => {
  const habitData: (number | string)[][] = [];
  if (!props.items) {
    return habitData;
  }

  for (let i = 0; i < props.items.length; i++) {
    const rateReverse = [...props.items[i]['rate']].reverse();
    rateReverse.forEach((rate: number, idx: number) => {
      habitData.push([idx, i, rate > 0 ? rate : '-']);
    });
  }

  return habitData;
});

const option = ref({
  tooltip: {
    position: 'top',
    trigger: 'item',
    backgroundColor: 'gray',
    textStyle: {
      color: 'snow',
    },
  },
  grid: {
    height: '80%',
    top: '2%',
    right: '0',
    left: '0',
  },
  xAxis: {
    type: 'category',
    data: days,
    splitArea: {
      show: false
    },
    axisLabel: {
      color: 'snow',
    },
    axisLine: {
      lineStyle: {
        color: 'snow',
      },
    },
    axisTick: {
      lineStyle: {
        color: 'snow',
      },
    },
  },
  yAxis: {
    type: 'category',
    data: habits,
    splitArea: {
      show: false
    },
    axisLabel: {
      color: 'snow',
    },
    axisLine: {
      lineStyle: {
        color: 'snow',
      },
    },
    axisTick: {
      lineStyle: {
        color: 'snow',
      },
    },
  },
  visualMap: {
    min: 0,
    max: 100,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '0',
    textStyle: {
      fontSize: 0 // 字体大小为0，实际隐藏
    },
    inRange: {
      color: chroma.scale(['#e8f5e8', '#2d5a2d']).mode('lch').colors(20),
    },
  },
  series: [
    {
      name: '完成率',
      type: 'heatmap',
      data: data,
      label: {
        show: false,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'snow'
        }
      }
    }
  ]
});
</script>

<template>
  <v-chart :option="option" style="height: 100%; width: 100%"/>
</template>
