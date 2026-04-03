# uniapp+vite+vue3+pinia+ts 框架

<a href='https://gitee.com/IT-bear/uniapp-framework/stargazers'><img src='https://gitee.com/IT-bear/uniapp-framework/badge/star.svg?theme=dark' alt='star'></img></a>

#### 介绍

- **uniapp Vue3 Vite pinia TypeScript scss TSX 基础框架**
- [开源地址](https://gitee.com/IT-bear/uniapp-framework)

#### 架构

- 技术栈采用了vue3+vite+TS+pinia+uview-plus
- 框架支持tsx、scss语法
- 配置了按需引入以及自动导入
- 配置了eslint和prettier代码规范，可根据自己喜好修改

#### 使用说明

- 推荐使用vscode进行开发;
- 框架完全基于 Vue3 `<script setup lang='ts'>` 写法,不支持 Vue2;
- 可用于学习与交流;
- 如发现问题或建议可在评论区留言, 看到会及时处理;
- 如有需求亦可在评论区留言,或在此项目基础上增加;

## 目录结构

```shell

├─ src
│ ├─api # 接口文件目录
│ ├─directives # 自定义指令
│ ├─components # 组件目录
│ ├─tsx # TSX组件目录
│ ├─pages # 页面
│ ├─static # 静态文件
│ ├─store # 状态管理（pinia）
│ │ ├─ modules # 数据模块
│ │ │ ├─user.ts
│ │ │ └─...
│ │ │
│ │ └─ index.ts #配置文件
│ ├─style # 全局样式
│ │
│ ├─utils # 工具类
│ │	└─ request.ts #网络请求拦截
│ └─config.ts #全局变量
│
└─ # 其他配置文件

```

## 安装使用

- 安装依赖

```bash
npm install
```

- 运行

```bash
# 其他端请查看 package.json
npm run dev:h5
```

- 打包

```bash
# 其他端请查看 package.json
npm run build:h5
```
## 分包

### pages_A 出行服务
 1、路况查询
 2、收费站状态查询
 3、服务区查询
 4、通行费率查询
 5、充电桩查询
 6、气象查询
 7、汽油站点查询
 8、汽车4S店查询

### pages_B 业务办理
 1、积分商城（积分）
 2、景区门票
 3、餐饮美食
 4、酒店住宿
 5、客运售票
 6、服务商零售
 7、租车
 8、网约车

### pages_C 车辆服务
1、etc业务申办
2、通行费发票查询
3、通行费补缴
4、以量定价
5、扫码付
6、运政办理
7、绿通预约


### pages_D 生活服务
1、新车买卖
2、二手车交易预约
3、汽车维修
4、加油加气
5、信息撮合
6、检测站点查询(inspection)
### pages_E 其他
1、智慧客服
2、用户信息（会员，订单、收藏、优惠券、车辆、发票、地址、客服）


### pages_E 百度数字人方法说明
## Android
	初始化数字人：initBdDigitalMan(configJson: String?, jsCallback: UniJSCallback?)
	数字人播报讲话：bdDigitalManSpeech(text: String?,jsCallback: UniJSCallback?)
	数字人字幕回调：bdDigitalManSubtitlesCallback(jsCallback: UniJSCallback?)
	大模型数据：requestBdLargeModelData(json: String?,jsCallback: UniJSCallback?)


#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
