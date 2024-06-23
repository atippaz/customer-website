<template>
  <main class="container">
    <div class="mt-12 mb-6 d-flex justify-end">
      <v-btn class="bg-info" @click="router.push({ name: 'analysis' })">สรุปข้อมูล</v-btn>
    </div>
    <div>
      <v-card>
        <v-card-title>
          <div class="d-flex justify-space-between">
            <div>ข้อมูลลูกค้า</div>
            <v-btn class="bg-primary" @click="dialog = true">เพิ่มรายการลูกค้า</v-btn>
          </div></v-card-title
        >
        <v-card-text>
          <v-data-table-server
            :loading="loading"
            :items="customerDataTable"
            :headers="headers"
            :items-length="tableOption.totalData"
            v-model:items-per-page="tableOption.limit"
            @update:options="loadItems"
          >
            <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
              <tr class="bg-indigo">
                <template v-for="column in columns" :key="column.key">
                  <td>
                    <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{
                      column.title
                    }}</span>
                    <template v-if="isSorted(column)">
                      <v-icon :icon="getSortIcon(column)"></v-icon>
                    </template>
                  </td>
                </template>
              </tr>
            </template>
            <template v-slot:item="{ item }">
              <tr class="row">
                <td>{{ item.customerName }}</td>
                <td>{{ item.customerProvince }}</td>
                <td>{{ item.customerAge }}</td>
                <td>{{ item.customerFavorite }}</td>
                <td>
                  <v-icon class="me-2" size="small" @click="editHandler(item.customerId)">
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    size="small"
                    @click="
                      () => {
                        deleteCustomerId = item.customerId
                        dialogDelete = true
                      }
                    "
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary"> Reset </v-btn>
            </template>
          </v-data-table-server>
        </v-card-text>
      </v-card>
    </div>
    <DialogCustomer
      :open="dialog"
      :customerData="editCustomer"
      @close="onClose"
      @save="onSave"
      @update="onUpdate"
    />

    <v-dialog v-model="dialogDelete" width="auto">
      <v-card
        width="350"
        prepend-icon="mdi-delete"
        text="คุณต้องการลบผู้ใช้คนนี้หรือไม่"
        title="ต้องการลบข้อมูลหรือไม่ ?"
      >
        <template v-slot:actions>
          <v-btn
            class="bg-error"
            text="ยกเลิก"
            @click="
              () => {
                dialogDelete = false
                deleteCustomerId = null
              }
            "
          ></v-btn>

          <v-btn text="ตกลง" class="bg-primary" @click="deleteCustomer"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DialogCustomer, { type FormCustomer } from '@/components/dialog/customerDialog.vue'
import { useCustomerApi } from '@/composables/api'
import type { CustomerData, InsertCustomer } from '@/composables/api/customer'
import { useRouter } from 'vue-router'
const deleteCustomerId = ref<number | null>(null)
const dialogDelete = ref(false)
const editCustomer = ref<FormCustomer | null>(null)
const dialog = ref<boolean>(false)
const loading = ref(false)
const customerDataTable = ref<CustomerData[]>([])
const router = useRouter()
const tableOption = ref({
  totalData: 0,
  limit: 10,
  search: '',
  fav: [],
  province: [],
  age: null,
  page: 1
})
async function loadItems({ page, itemsPerPage }: { page: number; itemsPerPage: number }) {
  tableOption.value.page = page
  tableOption.value.limit = itemsPerPage
  await fetchCustomerData()
}
const customerApi = useCustomerApi()
async function fetchCustomerData() {
  loading.value = true
  const result = await customerApi.getAll({
    limit: tableOption.value.limit,
    age: tableOption.value.age,
    fav: tableOption.value.fav,
    page: tableOption.value.page,
    province: tableOption.value.province,
    search: tableOption.value.search
  })
  loading.value = false
  if (!result) {
    alert('ไม่พบข้อมูล')
    return
  }
  tableOption.value = {
    ...tableOption.value,
    limit: 10,
    totalData: result.total
  }
  customerDataTable.value = result.data
}
onMounted(async () => {
  await fetchCustomerData()
})

async function onSave(data: FormCustomer) {
  try {
    const payload: InsertCustomer = {
      customerAge: +data.age!,
      customerFavorite: data.fav!,
      customerName: data.name!,
      customerProvince: data.province!
    }
    if (Object.values(payload).some((x) => x === null || x === '')) {
      alert('กรอกข้อมูลให้ครบ')
      return
    }
    const result = await customerApi.create(payload)
    if (!result) {
      alert('แก้ไขไม่สำเร็จ')
      return
    }
    dialog.value = false
  } catch (ex) {
    alert('เกิดข้อผิดพลาด')
    console.log(ex)
  }

  await fetchCustomerData()
}
async function onUpdate(data: FormCustomer) {
  try {
    if (Object.values(data).some((x) => x === null || x === '')) {
      alert('กรอกข้อมูลให้ครบ')
      return
    }
    const result = await customerApi.update({
      customerAge: data.age!,
      customerFavorite: data.fav!,
      customerId: data.id!,
      customerName: data.name!,
      customerProvince: data.province!
    })
    if (!result) {
      alert('แก้ไขไม่สำเร็จ')
      return
    }
    dialog.value = false
    await fetchCustomerData()
  } catch (ex) {
    alert('เกิดข้อผิดพลาด')
    console.log(ex)
  }
}
function onClose() {
  editCustomer.value = null
  dialog.value = false
}
async function editHandler(customerId: number) {
  const result = await customerApi.findById(customerId)
  if (!result) {
    alert('ไม่พบข้อมูล')
    await fetchCustomerData()
    return
  }
  await fetchCustomerData()

  editCustomer.value = {
    age: result.customerAge,
    fav: result.customerFavorite,
    id: result.customerId,
    name: result.customerName,
    province: result.customerProvince
  }
  dialog.value = true
  console.log('click')
}
async function deleteCustomer() {
  if (!deleteCustomerId.value) {
    alert('เกิดข้อผิดพลาด')
    return
  }
  try {
    const result = await customerApi.delete(deleteCustomerId.value!)
    if (!result) {
      alert('ไม่สำเร็จ')
      await fetchCustomerData()
      return
    }
    await fetchCustomerData()
  } catch (ex) {
    alert('เกิดข้อผิดพลาด')
    console.log(ex)
  }
  dialogDelete.value = false
}
const headers = [
  { title: 'ชื่อ', value: 'age' },
  { title: 'ที่อยู่', value: 'customer_name' },
  { title: 'อายุ', value: 'fav' },
  { title: 'ความสนใจ', value: 'province' },
  { title: 'Action', key: 'actions', sortable: false }
]
</script>
<style scoped>
.row:nth-child(odd) {
  background-color: #e8eaf6;
}
@media (min-width: 1281px) {
  .container {
    margin: 0px 400px;
  }
}
@media (min-width: 400px) {
  .container {
    margin: 0px 50px;
  }
}
</style>
