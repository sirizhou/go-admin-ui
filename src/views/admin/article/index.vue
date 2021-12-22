
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!--inline好像没有必要用v-bind -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="120px">
          <el-form-item label="标题" prop="title"><el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="作者" prop="author"><el-input
            v-model="queryParams.author"
            placeholder="请输入作者"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="内容" prop="content"><el-input
            v-model="queryParams.content"
            placeholder="请输入内容"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="状态" prop="status"><el-input
            v-model="queryParams.status"
            placeholder="请输入状态"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="发布时间-起始" prop="publishAtBeg"><el-date-picker
            v-model="queryParams.publishAtBeg"
            placeholder="请输入发布发布起始时间"
            type="datetime"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>

          <el-form-item label="发布时间-终止" prop="publishAtEnd"><el-date-picker
            v-model="queryParams.publishAtEnd"
            placeholder="请输入发布终止时间"
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
              v-permisaction="['admin:article:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <!-- diabled 不能勾选多个 -->
            <el-button
              v-permisaction="['admin:article:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:article:remove']"
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
        <el-table v-loading="loading" :data="articleList" @selection-change="handleSelectionChange" @sort-change="handleSortChang">
          <!--prob对应数据response.data.list中的键-->
          <el-table-column type="selection" width="55" align="center" /><el-table-column
            label="序号"
            align="center"
            prop="id"
            sortable="custom"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="标题"
            align="center"
            prop="title"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="作者"
            align="center"
            prop="author"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="内容"
            align="center"
            prop="content"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="状态"
            align="center"
            prop="status"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="解析"
            align="center"
            prop="calData"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="发布时间"
            align="center"
            prop="publishAt"
            sortable="custom"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.publishAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要修改吗?"
                confirm-button-text="修改"
                @onConfirm="handleUpdate(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['admin:article:edit']"
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
                @onConfirm="handleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['admin:article:remove']"
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

        <!-- 添加或修改对话框（弹窗，visible.sync=true弹出） -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="标题"
              />
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input
                v-model="form.author"
                placeholder="作者"
              />
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <el-input
                v-model="form.content"
                placeholder="内容"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-input
                v-model="form.status"
                placeholder="状态"
              />
            </el-form-item>
            <el-form-item label="发布时间" prop="publishAt">
              <el-date-picker
                v-model="form.publishAt"
                type="datetime"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-form>
          <!-- 按钮控件 -->
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
// import从其他模板（代码）中导入（其他模板中export）
import { addArticle, delArticle, getArticle, listArticle, updateArticle } from '@/api/admin/article' // @为调用的js文件名
// export 导出
export default {
  name: 'Article',
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
      articleList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        title: undefined,
        author: undefined,
        content: undefined,
        status: undefined,
        publishAtBeg: undefined,
        publishAtEnd: undefined,
        formula: undefined
      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: { title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        author: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        publishAt: [{ required: true, message: '发布时间不能为空', trigger: 'blur' }]
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
      // this.addDateRange 在src/utils/costum中定义，在main中全局挂载，
      // 将dateRange赋值到queryParams中的begTime和emdTime
      // 在这个函数中，dateRange为空，queryParams没有begTime和endTime，查询请求中begTime和endTime为空
      // listArticle(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

      // 注释掉addDateRange函数，没有作用
      listArticle(this.queryParams).then(response => {
        // response.data.list 对于响应的json文件
        this.articleList = response.data.list
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
        title: undefined,
        author: undefined,
        content: undefined,
        status: undefined,
        publishAtBeg: undefined,
        publishAtEnd: undefined
      }
      // resetForm在util/src/costum中
      // resetForm(refName) 表单重置
      this.resetForm('form')
    },
    // 没调用
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    // 没调用
    fileClose: function() {
      this.fileOpen = false
    },
    // 关系
    // 文件
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加文章'
      // isEdit不知道有什么用
      this.isEdit = false
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      // 没有输入row的情况下使用this.ids
      const id =
                row.id || this.ids
      // 调用getAritlce(id)获得Aritcle详细
      getArticle(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改文章'
        // 不清楚isEdit作用，改成false好像也没有影响
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 有id调用更新，无调用插入
          if (this.form.id !== undefined) {
            updateArticle(this.form).then(response => {
              if (response.code === 200) {
                // mgs：查询成功
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addArticle(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
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
        return delArticle({ 'ids': Ids })
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
