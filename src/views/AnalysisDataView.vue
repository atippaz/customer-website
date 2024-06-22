<template>
  <main>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-text class="mt-3 mx-3">
              <div class="d-flex align-center">
                <v-select
                  class="mr-4"
                  v-model="optionData.province"
                  label="จังหวัด"
                  item-value="id"
                  item-title="value"
                  multiple
                  :items="provinceDropdown"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.title }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ optionData.province.length - 1 }} others)
                    </span>
                  </template>
                  <template v-slot:prepend-item>
                    <v-list-item
                      ripple
                      @mousedown.prevent
                      @click="
                        optionData.province =
                          optionData.province.length > 0 ? [] : provinceDropdown.map((x) => x.id)
                      "
                    >
                      <v-list-item-action>
                        <v-icon :color="provinceDropdown.length > 0 ? 'indigo darken-4' : ''">
                          {{ icon(optionData.province as [], provinceDropdown as []) }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title> Select All </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-select>
                <v-select
                  v-model="optionData.favorite"
                  class="mr-4"
                  item-value="id"
                  item-title="value"
                  label="ความสนใจ"
                  multiple
                  :items="favoriteDropdown"
                  ><template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.title }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ optionData.favorite.length - 1 }} others)
                    </span>
                  </template>
                  <template v-slot:prepend-item>
                    <v-list-item
                      ripple
                      @mousedown.prevent
                      @click="
                        optionData.favorite =
                          optionData.favorite.length > 0 ? [] : favoriteDropdown.map((x) => x.id)
                      "
                    >
                      <v-list-item-action>
                        <v-icon :color="provinceDropdown.length > 0 ? 'indigo darken-4' : ''">
                          {{ icon(optionData.favorite as [], favoriteDropdown as []) }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title> Select All </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider> </template
                ></v-select>
              </div>
              <div class="d-flex">
                <v-text-field
                  density="compact"
                  class="mr-4"
                  width="300"
                  v-model="optionData.search"
                  label="ชื่อลูกค้า"
                ></v-text-field>

                <div class="d-flex mr-4">
                  <v-text-field
                    density="compact"
                    class="mr-2"
                    type="number"
                    label="อายุเริ่มต้น"
                    v-model="optionData.minAge"
                  ></v-text-field>
                  <v-text-field
                    density="compact"
                    type="number"
                    label="อายุสิ้นสุด"
                    v-model="optionData.maxAge"
                  ></v-text-field>
                </div>
                <v-btn color="success" @click="downloadExcel" :disabled="disableDownload"
                  >ดาวน์โหลด Excel</v-btn
                >
                <v-btn @click="getData" class="ml-4" color="info">ดึงข้อมูลใหม่ </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col>
          <div class="bg-white">
            <v-card-title>
              <p class="text-h5 font-weight-bold">ข้อมูลลูกค้าที่สินใจสินค้าเเต่ละชนิด</p>
            </v-card-title>
            <v-card-text>
              <apexchart
                type="bar"
                width="500"
                :options="favoriteData.chartOptions"
                :series="favoriteData.series"
              ></apexchart>
            </v-card-text>
          </div>
        </v-col>
        <v-col>
          <div class="bg-white">
            <v-card-title>
              <p class="text-h5 font-weight-bold">ข้อมูลลูกค้าเเต่ละช่วงอายุ</p>
            </v-card-title>
            <v-card-text>
              <apexchart
                type="bar"
                width="500"
                :options="ageData.chartOptions"
                :series="ageData.series"
              ></apexchart>
            </v-card-text></div
        ></v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <p class="text-h5 font-weight-bold">ข้อมูลลูกค้าในเเต่ละจังหวัด</p>
            </v-card-title>
            <v-card-text>
              <apexchart
                class="bg-white"
                type="bar"
                height="300"
                :options="provinceData.chartOptions"
                :series="provinceData.series"
              ></apexchart>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <p class="text-h5 font-weight-bold">
                ข้อมูลลูกค้าจังหวัด
                {{ provinceSelect?.value || '"ยังไม่ได้เลือก"' }} ในเเต่ละช่วงอายุ
              </p>
            </v-card-title>
            <v-card-text>
              <apexchart
                class="bg-white"
                type="bar"
                height="350"
                :options="analysisData.chartOptions"
                :series="analysisData.series"
              ></apexchart>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>
<script lang="ts" setup>
import { useFavoriteApi } from '@/composables/api'
import useCustomerApi, { type CustomerData } from '@/composables/api/customer'
import type { FavoriteDropdown } from '@/composables/api/favoriteApi'
import { provincePluginSymbol } from '@/plugin/province'
import { computed, inject, onMounted, ref, watch } from 'vue'
const customerApi = useCustomerApi()
const favoriteApi = useFavoriteApi()
const favoriteDropdown = ref<FavoriteDropdown[]>([])
const { provinceDropdown } = inject(provincePluginSymbol)!
const ageInterval = ref<{ min: number; max: number }[]>([])
const selectProvinceIndex = ref<number | null>(null)

const optionData = ref<{
  limitItem: number | null
  search: string
  favorite: number[]
  province: number[]
  minAge: number | null
  maxAge: number | null
}>({
  favorite: [],
  limitItem: null,
  maxAge: null,
  minAge: null,
  province: [],
  search: ''
})
function icon(item: [], compare: []) {
  if (item.length >= compare.length) return 'mdi-close-box'
  if (item.length > 0 && item.length < compare.length) return 'mdi-minus-box'
  return 'mdi-checkbox-blank-outline'
}
const disableDownload = ref(false)
watch(
  () => optionData.value,
  (e) => {
    disableDownload.value = true
  },
  {
    deep: true
  }
)
onMounted(async () => {
  for (let index = 1; index <= 100; index += 10) {
    ageInterval.value.push({ min: index, max: index + 9 })
  }
  await fetchFavoriteData()
  optionData.value.favorite = favoriteDropdown.value.map((x) => x.id)
  optionData.value.province = provinceDropdown.value.map((x) => x.id)
  await getData()
})
const provinceSelect = computed(() =>
  selectProvinceIndex.value == null ? null : provinceDropdown.value[selectProvinceIndex.value - 1]
)
async function fetchFavoriteData() {
  favoriteDropdown.value = await favoriteApi.getDropdown()
}
const customerData = ref<CustomerData[]>([])
async function downloadExcel() {
  const response = await customerApi.downloadExcel({
    limit: optionData.value.limitItem,
    age: {
      min: optionData.value.minAge ? +optionData.value.minAge : null,
      max: optionData.value.maxAge ? +optionData.value.maxAge : null
    },
    fav: optionData.value.favorite,
    page: 1,
    province: optionData.value.province,
    search: optionData.value.search
  })
  if (!response) {
    alert('เกิดข้อผิดพลาด')
    return
  }
  console.log(response)
  const blob = new Blob([response], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = 'customer_data.xlsx'

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)
}
async function getData() {
  const result = await customerApi.getAll({
    limit: optionData.value.limitItem,
    age: {
      min: optionData.value.minAge ? +optionData.value.minAge : null,
      max: optionData.value.maxAge ? +optionData.value.maxAge : null
    },
    fav: optionData.value.favorite,
    page: 1,
    province: optionData.value.province,
    search: optionData.value.search
  })
  customerData.value = result!.data
  disableDownload.value = false
}
const favoriteData = computed(() => {
  return {
    series: [
      {
        name: 'จำนวนคนที่สนใจ',
        data: favoriteDropdown.value
          .filter((t) => optionData.value.favorite.some((x) => x == t.id))
          .map((x) => customerData.value.filter((y) => y.customerFavId == x.id).length)
      }
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: 'bar'
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: string) {
          return val + 'คน'
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758']
        }
      },

      xaxis: {
        categories: favoriteDropdown.value
          .filter((t) => optionData.value.favorite.some((x) => x == t.id))
          .map((x) => x.value),
        position: 'bottom',
        axisBorder: {
          show: false
        },

        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        labels: {
          show: true,
          formatter: function (val: number) {
            return val.toFixed() + 'คน'
          }
        }
      }
    }
  }
})
const provinceData = computed(() => {
  return {
    series: [
      {
        name: 'จำนวนคนที่อยู่ในจังหวัด',
        data: provinceDropdown.value
          .filter((x) => optionData.value.province.some((t) => t == x.id))
          .map((x) => customerData.value.filter((y) => y.customerProvinceId == x.id).length)
      }
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: 'bar',
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const index = config.selectedDataPoints[0]
            selectProvinceIndex.value = optionData.value.province[index]
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: string) {
          return val + 'คน'
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758']
        }
      },

      xaxis: {
        categories: provinceDropdown.value
          .filter((x) => optionData.value.province.some((t) => t == x.id))
          .map((x) => x.value),
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        labels: {
          show: true,
          formatter: function (val: number) {
            return val.toFixed() + 'คน'
          }
        }
      }
    }
  }
})
const ageData = computed(() => {
  return {
    series: [
      {
        name: 'จำนวนลูกค้าในเเต่ละช่วงอายุ',
        data: ageInterval.value.map(
          (x) =>
            customerData.value.filter((y) => y.customerAge >= x.min && y.customerAge <= x.max)
              .length
        )
      }
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: 'bar'
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: string) {
          return val + ' คน'
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758']
        }
      },

      xaxis: {
        categories: ageInterval.value.map((x) => `${x.min} - ${x.max}`),
        position: 'bottom',
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        labels: {
          show: true,
          formatter: function (val: number) {
            return val.toFixed() + 'คน'
          }
        }
      }
    }
  }
})
const analysisData = computed(() => {
  return {
    series: favoriteDropdown.value.map((x) => {
      return {
        name: x.value,
        data: ageInterval.value.map(
          (m) =>
            customerData.value.filter(
              (y) =>
                y.customerAge >= m.min &&
                y.customerAge <= m.max &&
                y.customerFavId == x.id &&
                y.customerProvinceId == provinceSelect.value?.id
            ).length
        )
      }
    }),
    chartOptions: {
      chart: {
        height: 350,
        type: 'bar'
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: string) {
          return val + ' คน'
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758']
        }
      },

      xaxis: {
        categories: ageInterval.value.map((x) => `ช่วงอายุ ${x.min} - ${x.max} ปี`),
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        }
      },
      yaxis: {
        min: 0,
        max: customerData.value,
        axisBorder: {
          show: false
        },

        axisTicks: {
          show: true
        },
        labels: {
          show: true,
          formatter: function (val: number) {
            return val.toFixed() + 'คน'
          }
        }
      }
    }
  }
})
</script>
