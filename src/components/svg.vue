<template>
    <svg :class="svgClass" aria-hidden="true">
      <use :xlink:href="symbolId" :fill="color"></use>
    </svg>
  </template>
  
  <script lang="ts">
  import { computed, defineComponent,defineProps } from 'vue';
  export default defineComponent({
    props: {
      iconClass: {
        type: String,
        required: true,
      },
      className: {
        type: String,
        default: '',
      },
      color: {
        type: String,
        default: '#889aa4',
      },
    },
    setup(props) {
        interface IPROPS {
            iconClass:String
        }
      return {
        props:defineProps<IPROPS>(),
        symbolId: computed(() => `#icon-${props.iconClass}`),
        svgClass: computed(() => {
          if (props.className) {
            return `svg-icon ${props.className}`;
          }
          return 'svg-icon';
        }),
      };
    },
  });
  </script>
  
  <style scope>
  .svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
  }
  </style>