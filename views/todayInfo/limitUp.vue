<template>
  <div class="app-container">

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="dataList"
      border
      fit
      max-height="700"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="股票代码" prop="id" sortable="custom" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.f12 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="股票名称" prop="id" sortable="custom" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.f14 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="涨跌幅" prop="id" sortable="custom" align="center" min-width="80">
        <template slot-scope="{row}">
          <span style="color: red">{{ row.f3 }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="涨跌额" prop="id" sortable="custom" align="center" min-width="80">
        <template slot-scope="{row}">
          <span style="color: red">{{ row.f4 }}</span>元
        </template>
      </el-table-column>
      <el-table-column label="k线图" prop="id" sortable="custom" align="center" min-width="280">
        <template slot-scope="{row}">
          <line-chart :chart-data="lineChartData" />
        </template>
      </el-table-column>
      <el-table-column label="最新价" prop="id" sortable="custom" align="center" min-width="80">
        <template slot-scope="{row}">
          <span style="color: red">{{ row.f2 }}</span>元
        </template>
      </el-table-column>
      <el-table-column label="成交手" prop="id" sortable="custom" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.f5 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交额" prop="id" sortable="custom" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.f6 }}</span>元
        </template>
      </el-table-column>
      <el-table-column label="最高价" prop="id" sortable="custom" align="center" min-width="80">
      <template slot-scope="{row}">
        <span style="color: red">{{ row.f15 }}</span>元
      </template>
    </el-table-column>
      <el-table-column label="最低价" prop="id" sortable="custom" align="center" min-width="80">
        <template slot-scope="{row}">
          <span style="color: red">{{ row.f16 }}</span>元
        </template>
      </el-table-column>
      <el-table-column label="今开" prop="id" sortable="custom" align="center" min-width="80">
        <template slot-scope="{row}">
          <span style="color: red"> {{ row.f17 }}</span>元
        </template>
      </el-table-column>
      <el-table-column label="昨收" prop="id" sortable="custom" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.f18 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">

          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            +自选
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getLimitUp } from '@/api/todayInfo/todayInfo'
import LineChart from './components/LineChart'
import { getKlineByCode } from '@/api/shareDetail/shareDetail'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination, LineChart },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      lineChartData: {
        line0: [100, 120, 161, 134, 105, 160, 165],
        line1: [100, 120, 161, 134, 105, 160, 165],
        line2: [100, 120, 161, 134, 105, 160, 165],
        line3: [],
        line4: [],
        line5: [],
        line6: [],
        line7: [],
        line8: [],
        line9: [],
        line10: [],
        line11: [],
        line12: [],
        line13: [],
        line14: []

      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      dataList: [],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getLimitUpList()
  },
  methods: {
    getLimitUpList() {
      this.listLoading = true
      getLimitUp().then(res => {
        this.listLoading = false

        if (res) {
          const data = res.substring(res.indexOf('(') + 1, res.lastIndexOf(')'))
          const info = JSON.parse(data)
          this.dataList = info.data.diff

        }
      })
    },
    getKLineByCode() {
      getKlineByCode().then(res => {
        if (res) {
          const data = res.substring(res.indexOf('(') + 1, res.lastIndexOf(')'))
          console.log(JSON.parse(data))
          const info = JSON.parse(data)
          const kl = info.data.klines
          const obj = {
            line0: [],
            line1: [],
            line2: [],
            line3: [],
            line4: [],
            line5: [],
            line6: [],
            line7: [],
            line8: [],
            line9: [],
            line10: [],
            line11: [],
            line12: [],
            line13: [],
            line14: [],
            line15: []

          }
          kl.forEach((item, i) => {
              const arr = item.split(',')
              for (const i2 in arr) {
                obj['line' + i2].push(arr[i2])
              }
            }
          )
          console.log(obj)
          this.lineChartData = obj
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
