
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
            <el-button type="primary" plain icon="el-icon-circle-plus-outline" size="mini" @click="selectFormula">公式解析</el-button>
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
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:dato:plot']"
              type="primary"
              icon="el-icon-caret-right"
              size="mini"
              :disabled="multiple"
              @click="handlePlot"
            >绘图
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
            width="300"
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
            width="300"
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
        <el-dialog title="绘图" :visible.sync="plotOpen" width="1100px" @open="plot">
          <template>
            <div id="echarts_box" style="width: 1000px;height:600px;" />
          </template>
        </el-dialog>
        <el-dialog title="解析公式库" :visible.sync="formulaOpen" width="1300px">
          <el-form ref="queryFormulaForm" :model="queryFormulaParams" :inline="true" label-width="120px">
            <el-form-item label="id" prop="id"><el-input
              v-model="queryFormulaParams.id"
              placeholder="请输入编号"
              clearable
              size="small"
              @keyup.enter.native="handleFormulaQuery"
            />
            </el-form-item>
            <el-form-item label="代号" prop="codename"><el-input
              v-model="queryFormulaParams.codename"
              placeholder="请输入代号"
              clearable
              size="small"
              @keyup.enter.native="handleFormulaQuery"
            />
            </el-form-item>
            <el-form-item label="名称" prop="name"><el-input
              v-model="queryFormulaParams.name"
              placeholder="请输入名称"
              clearable
              size="small"
              @keyup.enter.native="handleFormulaQuery"
            />
            </el-form-item>
            <!-- 搜索按钮 -->
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleFormulaQuery">搜索公式</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetFormulaQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-button
              v-permisaction="['admin:formula:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleFormulaAdd"
            >新增
            </el-button>
          </el-row>
          <el-table
            v-loading="loadingFormula"
            :data="formulaList"
            @selection-change="handleFormulaSelectionChange"
            @sort-change="handleFormulaSortChange"
          >
            <el-table-column
              type="selection"
              label="(单选！)"
              width="50"
              align="center"
            /><el-table-column
              label="序号"
              width="150"
              align="center"
              prop="id"
              sortable="custom"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="代号"
              width="150"
              align="center"
              prop="codename"
              sortable="custom"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="名称"
              width="150"
              align="center"
              prop="name"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="数据类型"
              width="50"
              align="center"
              prop="dataType"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="处理方法"
              width="150"
              align="center"
              prop="processingFormula"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="相关参数"
              width="150"
              align="center"
              prop="formulaParameter"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="起始处理位置"
              width="100"
              align="center"
              prop="positionBeg"
              sortable="custom"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="截止处理位置"
              width="100"
              align="center"
              prop="positionEnd"
              sortable="custom"
              :show-overflow-tooltip="true"
            /><el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-popconfirm
                  class="delete-popconfirm"
                  title="确认要修改吗?"
                  confirm-button-text="修改"
                  @onConfirm="handleFormulaUpdate(scope.row)"
                >
                  <el-button
                    slot="reference"
                    v-permisaction="['admin:formula:edit']"
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                  >修改
                  </el-button>
                </el-popconfirm>
                <el-popconfirm
                  class="delete-popconfirm"
                  title="确认要删除吗?"
                  confirm-button-text="删除"
                  @onConfirm="handleFormulaDelete(scope.row)"
                >
                  <el-button
                    slot="reference"
                    v-permisaction="['admin:formula:remove']"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                  >删除
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="totalFormula>0"
            :total="totalFormula"
            :page.sync="queryFormulaParams.pageIndex"
            :limit.sync="queryFormulaParams.pageSize"
            @pagination="getFormulaList"
          />
        </el-dialog>
        <el-dialog :title="formulaTitle" :visible.sync="editFormulaOpen" width="500px">
          <el-form ref="formulaForm" :model="formulaForm" :rules="formulaRules" label-width="80px">
            <el-form-item label="代号" prop="codename">
              <el-input
                v-model="formulaForm.codename"
                placeholder="代号"
              />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="formulaForm.name"
                placeholder="名称"
              />
            </el-form-item>
            <el-form-item label="数据类型" prop="dataType">
              <el-input
                v-model="formulaForm.dataType"
                placeholder="float,int"
              />
            </el-form-item>
            <el-form-item label="处理公式" prop="processingFormula">
              <el-input
                v-model="formulaForm.processingFormula"
                placeholder="y=a*sqrt(x)+b, y=a*x+b, direct"
              />
            </el-form-item>
            <el-form-item label="相关参数" prop="formulaParameter">
              <el-input
                v-model="formulaForm.formulaParameter"
                placeholder="公式参数，按顺序填入，用空格隔开"
              />
            </el-form-item>
            <el-form-item label="起始位置" prop="positionBeg">
              <el-input
                v-model="formulaForm.positionBeg"
                placeholder="起始位置"
                type="number"
              />
            </el-form-item>
            <el-form-item label="截止位置" prop="positionEnd">
              <el-input
                v-model="formulaForm.positionEnd"
                placeholder="截止位置"
                type="number"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitFormulaForm">确 定</el-button>
            <el-button @click="cancelEditFormula">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
// import从其他模板（代码）中导入（其他模板中export）getDato 用于显示详情
import { listDato, delDato } from '@/api/admin/data-dato' // @为调用的js文件名
import { listFormula, getFormula, updateFormula, addFormula, delFormula } from '@/api/admin/formula'
import echarts from 'echarts'
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
      // 选中数组的值 用于绘图
      times: [],
      values: [],
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
      // 显示绘图
      plotOpen: false,
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
        createAtEnd: undefined,
        // 公式
        formulaId: undefined
      },
      // 表单参数
      form: {
      },
      formulaOpen: false,
      loadingFormula: false,
      totalFormula: 0,
      formulaList: [],
      queryFormulaParams: {
        pageIndex: 1,
        pageSize: 10,
        id: undefined,
        codename: undefined,
        name: undefined,
        dataType: undefined,
        processingFormula: undefined,
        formulaParameter: undefined,
        positionBeg: undefined,
        posigionEnd: undefined
      },
      formulaForm: {},
      // 非单个禁用 判断是否只选一个
      formulaSingle: true,
      // 增加或修改公式的弹出层
      formulaTitle: undefined,
      editFormulaOpen: false
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
      // 重置选定的公式 写法不优雅
      this.queryParams.formulaId = undefined
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
      this.times = selection.map(item => item.createAt)
      this.values = selection.map(item => item.calRes)
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
    },
    handlePlot() {
      //  绘图框 出发plot函数
      this.plotOpen = true
    },
    plot() {
      this.$nextTick(() => {
        this.plotData = []
        var myChart = echarts.init(document.getElementById('echarts_box'))
        var option = {
          tooltip: {},
          dataZoom: [
            {
              type: 'slider', // 图表下方的伸缩条
              show: true, // 是否显示
              realtime: true, // 拖动滚动条时是否动态的更新图表数据
              height: 15, // 滚动条高度
              start: 0, // 滚动条开始位置（共100等份）
              end: 30 // 结束位置（共100等份）
            },
            {
              type: 'inside', // 鼠标滚轮
              realtime: true
              // 还有很多属性可以设置，详见文档
            }
          ],
          xAxis: {
            type: 'category',
            data: this.times
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: this.values,
              type: 'line'
            }
          ]
        }
        option && myChart.setOption(option)
      })
    },
    /** 公式选择弹窗 **/
    selectFormula() {
      this.formulaOpen = true
      this.getFormulaList()
    },
    getFormulaList() {
      this.loadingFormula = true
      listFormula(this.queryFormulaParams).then(response => {
        this.formulaList = response.data.list
        this.totalFormula = response.data.count
        this.loadingFormula = false
      }
      )
    },
    handleFormulaSortChange(column, prop, order) {
      prop = column.prop
      order = column.order
      // 传到后台的是idOrder=desc
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryFormulaParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryFormulaParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryFormulaParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryFormulaParams[prop + 'Order'] = undefined
      }
      this.getFormulaList()
    },
    handleFormulaQuery() {
      this.queryFormulaParams.pageIndex = 1
      this.getFormulaList()
    },
    resetFormulaQuery() {
      this.resetForm('queryFormulaForm')
      this.handleFormulaQuery()
    },
    handleFormulaSelectionChange(selection) {
      this.formulaSingle = selection.length !== 1
      if (selection.length > 1) {
        this.msgError('单选（多选还没开发出来T.T）')
      }
      if (selection.length === 1) {
        this.msgSuccess('您选择了一个公式,点右上角的x，然后开始搜索吧！')
        this.queryParams.formulaId = selection.map(item => item.id)[0]
        // this.getFormulaList()
      }
    },
    resetFormula() {
      this.formulaForm = {
        id: undefined,
        codename: undefined,
        name: undefined,
        dataType: undefined,
        processingFormula: undefined,
        formulaParameter: undefined,
        positionBeg: undefined,
        posigionEnd: undefined
      }
      this.resetForm('formulaForm')
    },
    /** 新增按钮操作 */
    handleFormulaAdd() {
      this.resetFormula()
      this.editFormulaOpen = true
      this.title = '添加公式'
    },
    /** 修改按钮操作 */
    handleFormulaUpdate(row) {
      this.resetFormula()
      // 没有输入row的情况下使用this.ids
      const id = row.id
      // 调用getAritlce(id)获得Aritcle详细
      getFormula(id).then(response => {
        this.formulaForm = response.data
        this.editFormulaOpen = true
        this.title = '修改公式'
        // 不清楚isEdit作用，改成false好像也没有影响
        // this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitFormulaForm: function() {
      this.$refs['formulaForm'].validate(valid => {
        if (valid) {
          // 有id调用更新，无调用插入
          if (this.formulaForm !== undefined) {
            updateFormula(this.formulaForm).then(response => {
              if (response.code === 200) {
                // mgs：查询成功
                this.msgSuccess(response.msg)
                this.editFormulaOpen = false
                this.getFormulaList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            this.msgSuccess('add new formula')
            addFormula(this.formulaForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.editFormulaOpen = false
                this.getFormulaList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /* 公式编辑框取消按钮 */
    cancelEditFormula() {
      this.editFormulaOpen = false
      this.resetFormula()
    },
    handleFormulaDelete(row) {
      var Ids = (row.id && [row.id])
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delFormula({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.getFormulaList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {
      })
    }
  }
}
</script>
