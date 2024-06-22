import { useProvinceApi } from '@/composables/api'
import type { ProvinceDropdown } from '@/composables/api/provinceApi'
import { type Plugin, type InjectionKey, ref, computed } from 'vue'
export type PluginInstance = ReturnType<typeof $province>
export const provincePluginSymbol: InjectionKey<PluginInstance> = Symbol('$auth')

function $province() {
  const provinceApi = useProvinceApi()
  const provinceDropdown = ref<ProvinceDropdown[]>([])
  ;(async () => {
    provinceDropdown.value = await provinceApi.getDropdown()
  })()
  return {
    provinceDropdown: computed(() => provinceDropdown.value)
  }
}

const plugin: Plugin = {
  install: (app, options) => {
    const sample = $province()
    app.provide(provincePluginSymbol, sample)
  }
}
export default plugin
