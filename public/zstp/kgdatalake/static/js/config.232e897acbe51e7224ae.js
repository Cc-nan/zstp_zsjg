webpackJsonp([80],{

/***/ "gBqZ":
/***/ (function(module, exports) {

window.customConfig = {
  syncMenuId: 303,
  datasetMenuId: 301,
  fileSystemMenuId: 302,
  syncDefaultState: false,
  datasetDefaultState: false,
  fileSystemDefaultState: false,
  errorCode: {
    400: '请求失败',
    401: '登录失效，请重新登录',
    403: '暂无权限，无法操作',
    404: '请求资源不存在',
    500: '服务器内部错误'
  },
  switch: {
    log: true,
    completeness: true,
    length: true,
    specialCharacter: false
  },
  valueCheckConfig: {
    limitMap: {
      taskName: 20, // 名称（含搜索）
      taskDesc: 200, // 描述
      fileName: 256, // 文件名
      shortText: 200, // 短文本型
      longText: 10000, // 文本型
      number: 15, // 浮点
      floatInteger: 9, // 浮点前整数
      floatZero: 5, // 浮点前后
      integer: 9, // 整数
      authorizationName: 54, // 权限管理 （新增用户名）
      operator: { // 数据加工
        operatorName: 20, // 算子名称
        rule: 500, // 算子规则
        test: 500 // 算子测试
      },
      tableData: {
        dataSetName: 20, // 数据集名称
        tableName: 20 // 数据表名称
      },
      connection: { // 通过数据库连接创建
        url: 100, // ip、远程路径
        minPort: 1, // 端口最小值
        maxPort: 65535, // 端口最大值
        userName: 50, // 用户名
        password: 20 // 密码
      }
    },
    regularMap: {
      // corn: new RegExp('^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?)*))$')
    }
  }
};

/***/ })

},["gBqZ"]);