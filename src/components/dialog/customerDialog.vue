<template>
  <v-dialog width="1000" :model-value="props.open" persistent>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text class="border-t-md border-b-md">
        <v-text-field label="ชื่อลูกค้า" v-model="formCustomer.name"></v-text-field>
        <v-select
          v-model="formCustomer.fav"
          item-value="id"
          item-title="value"
          label="ความสนใจ"
          :items="favoriteDropdown"
        >
          <template v-slot:prepend-item>
            <v-list-item ripple @mousedown.prevent @click="">
              <v-list-item-content>
                <v-list-item-title>
                  <div class="d-flex">
                    <v-text-field label="ชื่อ" v-model="newFavName" density="compact" class="mb-n4">
                    </v-text-field>
                    <v-btn
                      class="ml-4"
                      color="primary"
                      @click="addNewFavorite"
                      :disabled="newFavName == ''"
                      >เพิ่มรายการใหม่</v-btn
                    >
                  </div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider> </template
        ></v-select>
        <v-text-field
          v-model="formCustomer.age"
          label="อายุ"
          type="number"
          @update:model-value="
            (e) => {
              if (+e <= 0) {
                formCustomer.age = null
              }
            }
          "
        ></v-text-field>
        <v-select
          v-model="formCustomer.province"
          label="จังหวัด"
          item-value="id"
          item-title="value"
          :items="provinceDropdown"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="close"> ยกเลิก </v-btn>
        <v-btn @click="submit"> บันทึก </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed, ref, watch, type PropType, inject, onMounted } from 'vue'
import { useFavoriteApi } from '@/composables/api'
import { provincePluginSymbol } from '@/plugin/province'
import type { FavoriteDropdown } from '@/composables/api/favoriteApi'
export interface FormCustomer {
  id: number | null
  name: string | null
  fav: number | null
  province: number | null
  age: number | null
}
const favoriteApi = useFavoriteApi()
const favoriteDropdown = ref<FavoriteDropdown[]>([])
async function fetchFavoriteData() {
  favoriteDropdown.value = await favoriteApi.getDropdown()
}
const newFavName = ref('')
const { provinceDropdown } = inject(provincePluginSymbol)!
onMounted(async () => {
  await fetchFavoriteData()
})
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  customerData: {
    type: Object as PropType<FormCustomer | null>,
    required: false
  }
})
const emit = defineEmits<{
  (e: 'save', customerData: FormCustomer): void
  (e: 'update', customerData: FormCustomer): void
  (e: 'close'): void
}>()
const title = computed(() => (!props.customerData ? 'เพิ่มลูกค้าใหม่' : 'แก้ไขข้อมูลลูกค้า'))
function close() {
  emit('close')
}
async function addNewFavorite() {
  const newId = await favoriteApi.create(newFavName.value)
  if (!newId) {
    alert('ชื่อซ้ำ')
    return
  }
  await fetchFavoriteData()
  formCustomer.value.fav = newId
  newFavName.value = ''
}
function submit() {
  if (
    formCustomer.value.age === null ||
    formCustomer.value.age <= 0 ||
    formCustomer.value.fav == null ||
    formCustomer.value.province == null ||
    formCustomer.value.name == '' ||
    formCustomer.value.name == null
  ) {
    alert('ฟอร์มไม่ถูกต้อง')
    return
  }
  if (!props.customerData) {
    emit('save', formCustomer.value)
    return
  }
  if (formCustomer.value.id == null) {
    alert('ฟอร์มไม่ถูกต้อง')
    return
  }
  emit('update', formCustomer.value)
}
function initFormData(): FormCustomer {
  return {
    age: null,
    fav: null,
    id: null,
    name: null,
    province: null
  }
}
const formCustomer = ref<FormCustomer>(initFormData())
watch(
  () => props.customerData,
  (e) => {
    if (e != null) {
      formCustomer.value = e as FormCustomer
      return
    }
    formCustomer.value = initFormData()
  }
)
</script>
