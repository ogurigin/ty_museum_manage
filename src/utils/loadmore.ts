
/**
 * v-selectLoadMore
 * select 触底加载
 */
import type { Directive, DirectiveBinding } from "vue";
 
const loadMore: Directive = {
    mounted(el: any, binding: DirectiveBinding) {
        const selectDom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        function loadMores(this: any) {
            
            const isBase = this.scrollHeight - this.scrollTop <= this.clientHeight
            if (isBase) {
                binding.value && binding.value()
            }
        }
        el.selectDomInfo = selectDom
        el.userLoadMore = loadMores
        selectDom?.addEventListener('scroll', loadMores)
    },
    beforeUnmount(el: any) {
        if (el.userLoadMore) {
            el.selectDomInfo.removeEventListener('scroll', el.userLoadMore)
            delete el.selectDomInfo
            delete el.userLoadMore
        }
    }
}
export default loadMore