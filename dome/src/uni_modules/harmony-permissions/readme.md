# 鸿蒙权限配置 UTS 插件

## 介绍
> 在 uniapp 的开发中，鸿蒙平台，申请权限的方式，可以在 harmony-configs 下对应位置创建 /entry/src/main/module.json5 ，通过覆盖对应文件的方式来创建。但是开发者在配置中存在各种问题，此插件为初学者提供了一个更为简单的权限配置方式

在 [鸿蒙requestPermissions文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/declare-permissions) 中提到，`已在子模块中申请的权限无需在主项目中重复添加，权限将在整个应用中生效。` ，而 UTS 插件在打包进入鸿蒙工程后，就是作为了一个子模块存在，因此在 UTS 插件中即可实现应用的权限配置

## 如何使用

由于 uts 插件摇树机制，需要在页面中引入此插件，不然会被摇掉，需要在任意页面上

```js
// #ifdef APP-HARMONY
import "@/uni_modules/harmony-permissions"
// #endif
```

在鸿蒙中，权限的配置需要配置在 module.json5 中的requestPermissions 字段中
```json
{
  "module": {
    "name": "uni_modules__harmony_permissions",
    "type": "har",
    "deviceTypes": [
      "default",
      "tablet",
      "2in1"
    ],
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      },{
        "name": "ohos.permission.APPROXIMATELY_LOCATION",
        "reason": "$string:location_desc",
        "usedScene": {"when": "inuse"}
      },{
        "name": "ohos.permission.LOCATION",
        "reason": "$string:location_desc",
        "usedScene": {"when": "inuse"}
      }
    ]
  }
}

```
其中：

- name 是需要使用的权限名称。
- reason是申请权限的原因。**注意：不能直接使用文本，需要使用 $string:... , 此属性为定义于 string.json 中的变量**
- usedScene 是权限使用的场景

其它详细内容见：[鸿蒙requestPermissions文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/declare-permissions) 



在本插件中，$string定义于：`/harmony-permissions/utssdk/app-harmony/resources/base/element/string.json`

```json
{
	"string": [{
		"name": "permission_module",
		"value": "permission_module"
	}, {
		"name": "location_desc",
		"value": "正在申请获取您的位置信息，以便为您提供相应的服务"
	}, {
		"name": "get_networkinfo_tips",
		"value": "正在申请获取网络信息权限，以便为您提供相应的服务"
	}, {
		"name": "write_contacts",
		"value": "正在申请写入联系人权限，以便为您提供相应的服务"
	}, {
		"name": "microphone",
		"value": "正在申请使用麦克风权限，以便为您提供相应的服务"
	}, {
		"name": "access_biometric",
		"value": "正在申请访问用户认证权限，以便为您提供相应的服务"
	}, {
		"name": "read_pasteboard",
		"value": "正在申请获取剪切版权限，以便为您提供相应的服务"
	}]
}
```

