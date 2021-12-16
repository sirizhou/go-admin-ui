
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!--inline好像没有必要用v-bind -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="120px">
          <el-form-item label="id" prop="id"><el-input
            v-model="queryParams.id"
            placeholder="请输入编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="_id" prop="mongoId"><el-input
            v-model="queryParams.mongoId"
            placeholder="请输入_id"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="vc头" prop="vcid"><el-input
            v-model="queryParams.vcid"
            placeholder="请输入vcid"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="pk头" prop="pkid"><el-input
            v-model="queryParams.pkid"
            placeholder="请输入pkid"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="入库时间-起始" prop="createAtBeg"><el-date-picker
            v-model="queryParams.createAtBeg"
            placeholder="请输入起始时间"
            type="datetime"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>

          <el-form-item label="入库时间-终止" prop="createAtEnd"><el-date-picker
            v-model="queryParams.createAtEnd"
            placeholder="请输入终止时间"
            type="datetime"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <!-- 搜索按钮 -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 第二栏操作按钮 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:dato:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
          <!-- 上页码 -->
          <el-col>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageIndex"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </el-col>
        </el-row>
        <!-- 列表 -->
        <el-table v-loading="loading" :data="datoList" @selection-change="handleSelectionChange" @sort-change="handleSortChang">
          <!--prob对应数据response.data.list中的键-->
          <el-table-column type="selection" width="55" align="center" /><el-table-column
            label="序号"
            align="center"
            prop="id"
            sortable="custom"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="_id"
            align="center"
            prop="mongoId"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="vc头"
            align="center"
            prop="vcid"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="pk头"
            align="center"
            prop="pkid"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="内容"
            align="center"
            prop="content"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="解析值"
            align="center"
            prop="calRes"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="入库时间"
            align="center"
            prop="createAt"
            sortable="custom"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要删除吗?"
                confirm-button-text="删除"
                @onConfirm="handleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['admin:dato:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                >删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部分页 -->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
// import从其他模板（代码）中导入（其他模板中export）getDato 用于显示详情
import { listDato, delDato } from '@/api/admin/data-dato' // @为调用的js文件名
// export 导出
export default {
  name: 'DataDato',
  components: {
  },
  // data定义变量，并赋初值
  data() {
    return {
      // 遮罩层 用于加载表格
      loading: true,
      // 选中数组 列表中选择
      ids: [],
      // 非单个禁用 判断是否只选一个
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // isEdit在html中没有出现
      isEdit: false,
      // 类型数据字典 在html中没有出现
      typeOptions: [],
      datoList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        id: undefined,
        mongoId: undefined,
        vcid: undefined,
        pkid: undefined,
        content: undefined,
        createAtBeg: undefined,
        createAtEnd: undefined
      },
      // 表单参数
      form: {
      }
    }
  },
  // 实例创建时调用
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listDato(this.queryParams).then(response => {
        // response.data.list 对于响应的json文件
        this.datoList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置,搜索栏
    reset() {
      // form表单参数
      this.form = {
        id: undefined,
        mongoId: undefined,
        vcid: undefined,
        pkid: undefined,
        content: undefined,
        createAtBeg: undefined,
        createAtEnd: undefined
      }
      // resetForm在util/src/costum中
      // resetForm(refName) 表单重置
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      // 没用
      // this.dateRange = []
      // 重置搜索表达
      this.resetForm('queryForm')
      // 搜索 更新列表
      this.handleQuery()
    },
    // 多选框选中数据
    // <el-table-column type="selection"
    // prop：id
    handleSelectionChange(selection) {
      // 获取选中的id
      this.ids = selection.map(item => item.id)
      // 判断单选还是多选
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 排序回调函数 */
    // 没明白怎么传入的参数
    handleSortChang(column, prop, order) {
      prop = column.prop
      order = column.order
      // 传到后台的是idOrder=desc
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryParams[prop + 'Order'] = undefined
      }
      this.getList()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDato({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {
      })
    }
  }
}
</script>
