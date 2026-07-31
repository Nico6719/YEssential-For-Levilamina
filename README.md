<div align="center">

![YEssential](https://socialify.git.ci/Nico6719/YEssential/image?custom_language=JavaScript&description=1&font=Inter&forks=1&issues=1&language=1&logo=https://zh.minecraft.wiki/images/Bookshelf_JE4_BE2.png?21f85&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto)
# 📦 YEssential
**基于 LSE 的多功能基础插件**


![](https://img.shields.io/github/v/release/Nico6719/YEssential?style=flat-square&logo=github&color=orange&label=Version)
![](https://img.shields.io/github/downloads/Nico6719/YEssential/total?style=flat-square&logo=github&color=33ccff&label=Downloads)
![](https://img.shields.io/github/languages/top/Nico6719/YEssential?style=flat-square&logo=javascript&color=yellow)

![](https://img.shields.io/github/stars/Nico6719/YEssential?style=flat-square&logo=github&color=yellow&label=Stars)
![](https://img.shields.io/github/last-commit/Nico6719/YEssential?style=flat-square&color=lightgrey)
![](https://komarev.com/ghpvc/?username=Nico6719-YEssential&color=green&style=flat-square&label=Views)

</div>

---
> 一个简洁、实用的基础插件，适用于基岩版服务器。基于 LegacyScriptEngine (LSE) 的插件，并且可以迁移 TMEssential 的部分数据（如 home 和 warp 的数据）以及 [PMenu](https://www.minebbs.com/resources/pmenu.4277/) 的菜单数据（100%兼容！）导入配置文件/数据教程在文末。<br>
> **如果您使用的是低于1.21.80的版本的服务端请使用（小于等于2.10.2）旧版本插件!**
## 📌 基本信息

- **名称**：YEssential  
- **类型**：基础插件 / 多功能模块化插件
- **平台**：LegacyScriptEngine (LSE)  
- **主要功能**：提供服务器基础功能（如：Home Tpr Tpa Warp Money 等）  
- **支持迁移其他插件数据**：如 TMEssential 的 home 和 warp 数据可迁移到本插件等

---
### 📦 安装方法
- 方法1：使用lip安装，指令：lip install github.com/Nico6719/YEssential
- 方法2：下载本插件解压到Plugins目录内即可
---
## ⚙️ 插件亮点

### 功能

|功能  	 |描述	                      |状态 |
|--------|----------------------------|-------------|
|Modules|多模块支持！|✅|
 |Economic	 |经济核心|	✅|
 |菜单	 |菜单功能，兼容[PMenu](https://www.minebbs.com/resources/pmenu.4277/)的配置文件！！|	✅|
 |Hub	 |一键回城，可通过指令设置传送点。 |	✅|
 |Rtp	 |随机传送，附带动画。	 |✅|
 |Tpa	 |传送系统，借鉴了子邪大佬写的 TeleportMaster。 |	✅|
|Home&Warp	 |家系统(公共家系统)和公共传送点系统。 |	✅|
|Fcam	 |灵魂出窍（旁观者）。 |✅|
|Back&DeathLog |回死亡点以及记录玩家死亡点。 |	✅|
|DMotd	 |动态 Motd 功能。	 |✅|
|WeiHu |	维护服务器功能，禁止其他非管理成员进入服务器。	 |✅|
|Clean	 |自动清理掉落物和实体，掉落物过多时 & 定时自动清理，支持白名单。	 |✅|
|Suicide	 |玩家紫砂（kill myself）。	 |✅|
|BetterStopMsg |	自定义关服提示。	 |✅|
|MoreLangSupport |	多语言支持。	 |✅|
|Notice |	自定义公告，支持颜色符号，\n换行，支持游戏内在线编辑！	 |✅|
|FixExpLag	 |防止经验球卡服。 |	✅|
|CD	 |菜单功能 |	✅|
|Crash	 |崩溃玩家客户端（慎用！）。	 |✅|
|RedPacket |	玩家可以自行发红包。	 |✅|
|ServersTP |	一键传送到其他服务器。 |	✅|
|Sign |	每日签到系统 |	✅|
|PVP	 |PVP自由开关功能，防止玩家恶意攻击。	 |✅|
|Keepinventory	 |开服自动开启死亡不掉落。 |	✅|
|AutoUpdate	 |自动更新插件本体并重载。	 |✅|
|Bstats统计	 |统计BDS信息和在线人数（可在Config内关闭）<br>开启统计可以帮助开发者了解插件运行状况，优化插件性能！ |	✅|
|Gui修改插件配置	 |网页编辑器。 |	✅|
|Plugin for Endstone	|Endstone 版本的 YEssential。|	🚧 开发中|
|SideBar|	支持自定义侧边栏以及支持 PAPI 变量。|	📅 计划中|
### 相关PAPI变量
注意！这些变量已从2.8.7版本起废弃。
|变量名 |描述	                      |
|--------|----------------------------|
|%player_money% |显示玩家的计分板经济|
|%player_llmoney%|显示玩家的LLMoney经济|

### 🆕 新增 / 修改过的功能  
<details>
<summary>点击这里展开/折叠</summary>
 
- v2.10.0-v2.11.0
  - 修复 /tpa、/tpayes、/tpano、/hub、/sethub 使用假命令**（regPlayerCmd）**注册命令导致重载后命令无法正常使用的问题，现已改为真实 newCommand 命令注册方式 
  - 修复/Hub指令头衔不统一的问题 
  - 新增加公共家园功能和家设置，并且更改了/home GUI界面的样式使其更美观 
  - 现在在添加家GUI界面以及家设置内可以设置是否为公共家了（公共家所有人都能传送到你的公共点位）
  - 现在只有在配置文件中开启对应模块时才会注册相关命令，关闭模块后命令将不再出现在补全列表中（影响指令：tpa、Hub、Servers、RTP）
  - 移除各命令 callback 内冗余的模块开关重复检查，统一在注册层拦截 
  - 移除了冗余的无用代码，并且优化了了插件整体运行效率 
  - 删除了Baby Him 
  - And more....
- v2.7.1 -- v2.7.2
  - 重写经济系统
  - 优化日志输出
  - 删除无用代码及其优化
  - 修复一些潜在的问题及Bug
  - 重写大量代码（经济类，RTP类）
  - 将RTP和自动更新功能写成模块
  - 修复RTP动画的相关问题
  - 修复开服时可能存在的问题
  - 添加了更多的语言文件导出
  - 初步支持离线转账
- v2.7.0 -- v2.6.6
  - 优化代码
  - 完全重写Clean功能。独立为模块，有单独的配置文件，可以当作一个独立的清理插件看。支持清理实体，支持白名单，支持i18n，支持错误分析。
  - 优化插件加载时的提示
  - 将配置管理器拆分成模块
  - 重写模块加载器
  - 优化开服时的Log提示
  
</details>

---

## 📈 版本更新

插件已持续迭代更新以适应不同 LSE 与 LeviLamina 版本。示例更新版本： 
| 版本   | 更新内容                   | 日期        |
|--------|----------------------------|-------------|
| 1.0.6  | 适配最新 LSE 和 LeviLamina  | 2025/01/26  |
| 2.6.6  | 多项功能更新                | 2025/12/20  |
| 2.6.8  | 模块拆分更新                | 2025/12/22  |
| 2.8.0  | 模块优化更新                | 2026/1/22   |
| 2.10.10| 新增加菜单以及签到模块       | 2026/4/9    |
| 2.11.0 | 大量底层更改                | 2026/4/14   |
| 2.12.11| 玩家互传新增拉黑功能         | 2026/7/17   |
| 2.12.12| 自杀/死亡点传送冷却，签到修复 | 2026/7/31   |
| 3.0.0  | GitHub 下载新版             | 未注明      |

⚠️ *以上为部分版本信息，具体以最新资源页 / GitHub 为准。* 

---

## 📥 下载 / 安装

1. 前往 [MineBBS](https://www.minebbs.com/resources/yessential-lse.10332/) & [何意味网盘](https://xn--vzyr4p.xn--vqqq8jxym.com/disk/s/pVEv2fyRnFB?domainId=bj27706) & [Releases](https://github.com/Nico6719/YEssential/releases) & [Y系列插件下载站](http://dl.mcmcc.cc)下载本插件
2. 将插件文件解压后放入服务器的 `./plugins/` 目录即可运行。
---

## 🛠 依赖要求

- 需要 **LegacyScriptEngine** 平台支持  
- 兼容并能够导入部分 **TMEssential** 的数据
>把 服务端目录\plugins\Timiya\data内的homelist.json和warplist.json<br>
>移动到服务端目录\plugins\YEssential\data内并且分别重命名为homedata.json和warpdata.json然后保存

---

## 💡 适用场景

适合基岩版 Minecraft 服务器使用，特别是：

- 想从 TMEssential 迁移到新基础插件  
- 需要还在维护的Menu插件
---

## 🧩 与 LeviLamina 关系说明

YEssential 在版本 1.0.0 起已开始兼容 **LeviLamina** 平台，与 LSE 平台配合可以用于更强的服务器模组环境支持。

*LeviLamina 是一个轻量、模块化的 Minecraft Bedrock Edition 模组加载器，为插件/模组提供基础 API 和事件系统支持。* 

---
## 📦 配置文件
- ./Config/config.json
主配置文件
```json
{
    "PVP": {
        "EnabledModule": true,  //PVP模块，默认为开启
        "DangerousBlocks": [  //自定义拦截玩家放置的爆炸实体
            "minecraft:tnt",
            "minecraft:respawn_anchor",
            "minecraft:bed",
            "minecraft:undyed_shulker_box"
        ]
    },
    "RedPacket": {
        "EnabledModule": false,   //红包模块开关，默认为关闭
        "expireTime": 300,
        "maxAmount": 10000,
        "maxCount": 50,
        "minAmount": 1
    },
    "CrossServerTransfer": {  //跨服传送配置项
        "EnabledModule": false,  //是否开启该功能
        "servers": [  //配置详情
                    { "server_name": "生存服", "server_ip": "127.0.0.1", "server_port": 19132 }
        ],
        "servers1": [
                    {"server_name":"下北泽服务器","server_ip":"1.14.5.14","server_port": 11451 }
        ]
     },
    "RTP": {  //随机传送模块
        "EnabledModule": false,   //随机传送模块开关，默认为关闭
        "minRadius": 100,    // 最小传送半径
        "maxRadius": 5000,  // 最大传送半径
        "cooldown": 300,   // 冷却时间（秒）
        "cost": 50,    // 传送费用
        "allowDimensions": [
            0,
            1,
            2
        ],  // 允许的维度
        "safeCheck": true,   //传送前安全性检查
        "maxAttempts": 50,  // 最大尝试次数
        "Animation": 0,   //随机传送动画（0为关闭，1为GTA5样式）
        "enableParticle": true,  //传送成功粒子
        "enableSound": true,  //传送成功音效
        "logToFile": true   // 记录日志
    },
    "Bstats": {  //Bstats开关
          "EnableModule": true, // 模块总开关
          "logSentData": false   // 是否在控制台显示发送的数据内容
    },
    "Hub": { //Hub坐标配置
          "EnabledModule": false,  //Hub功能开关，默认为关闭
          "x": 58776.7,  //x轴
          "y": 68.6,  //y轴
          "z": 59617.9,  //z轴
          "dimid": 0,  //维度坐标
          "isSet": false  //是否已经设置
    },
    "tpa": {  //传送系统配置
          "EnabledModule": false,  //TPA功能开关，默认为关闭
          "isDelayEnabled": true, //是否开启延迟传送
          "maxDelay": 20,   //传送最大延迟
          "cost" : 1,    //tpa传送花费
          "requestTimeout": 60,   //传送请求过期时间
          "promptType": "form"  //传送请求类型
    },
    "Home": {
          "add": 0,  //添加家花费
          "del": 0,  //删除家花费
          "tp": 0,  //传送家花费
          "MaxHome": 10   //最大家数量
    },
    "Fcam": {  //灵魂出窍的配置
          "EnableModule": false,  //是否开启该功能 true或1为开启，0或false关闭
          "CostMoney": 0,  //使用该功能花费的金钱
          "TimeOut": 0  //灵魂出窍使用时间限制
    },
    "wh": {  //维护功能的配置
           "EnableModule": true,    //是否开启该功能 true或1为开启，0或false关闭
           "status": 0,  //维护状态1为维护中，0为未维护
           "whmotdmsg": "服务器维护中，请勿进入！",   //维护时MOTD的提示，支持彩色
           "whgamemsg": "服务器正在维护中，请您稍后再来!"   //维护时玩家进服拦截时的提示，支持彩色
                
    },
    "Motd": {
             "EnabledModule": true,  //是否启用修改MOTD功能，默认开启
             "message" : ["Bedrock_Server", "Geyser"],   //动态Motd的配置
    },
    "Notice":{
                "EnableModule": false,    //是否开启Notice公告功能
                "Join_ShowNotice": false,   ///是否在加入服务器时弹出
                "IsUpdate":false,   //公告是否有在游戏内更新过，当true时下次所有玩家都会弹出公告
    },
    "SimpleLogOutPut": false,   //简洁的日志输出，默认为关闭
    "Crash": {

                "EnabledModule": true ,  //崩端功能开关，默认为关闭
                "LogCrashInfo": true  //是否打印操作日志
    },
    "Economy": {  //经济模块设置
                "mode": "scoreboard",  //经济模式 填llmoney为llmoney模式，填scoreboard为计分板模式
                "PayTaxRate": [   //阶梯税收
                  {
                      "min": 0,
                      "max": 1000,
                      "rate": 0   //税率（%）
                  },
                  {
                      "min": 1000,
                      "max": 10000,
                      "rate": 2
                  },
                  {
                      "min": 10000,
                      "max": 100000,
                      "rate": 5
                  },
                  {
                      "min": 100000,
                      "max": -1,
                      "rate": 10
                  }
                ],
                "RankingModel" : "New",   //金币排行版的样式 （可填New或Old）
                "Scoreboard": "money",  //计分板项使用的名字，不可填中文！
                "CoinName": "金币"   //金币名字
    },
    "Suicide": {  //自杀功能配置
                "EnabledModule": true,  //自杀功能总开关
                "cost": 0,   //自杀所花费的金钱
                "cooldown": 0   //冷却时间（单位：秒），0为不限制
    },
    "Back": {  //死亡点传送配置
                "EnabledModule": true,  //死亡点传送总开关
                "cost": 0,   //返回死亡点花费的金钱
                "cooldown": 0,   //冷却时间（单位：秒），0为不限制。冷却仅在传送成功后计入
                "tipAfterDeath": false   //重生后是否自动弹出返回GUI
    },
    "Warp": 0 ,   //前往公共传送点花费的金钱
    "KeepInventory": 1,   //开服是否自动执行开启死亡不掉落指令
    "Version": 295   //版本标识符，勿动！
}
```
> 懒怎么办？？ 试试[网页配置编辑器](https://jzrxh.work/projects/yessential/config.html)吧！
---
- ./Config/Updateconfig.json
 ```json
"Update": {  //自动更新配置项
        "EnableModule": true,  //是否开启自动更新功能
        "CheckInterval": 120,  //定时检查新版本（单位分钟，0关闭，最小值120）
        "versionUrl": "https://plugin.tobecraft.xyz/file/manifest.json",  //区别版本号的网址
        "baseUrl": "https://plugin.tobecraft.xyz/file/",  //下载文件的网址
        "files": [ //需要更新的模块/本体
            {
                "url": "YEssential.js",
                "path": "YEssential.js"
            },
            {
                "url": "modules/I18n.js",
                "path": "./modules/I18n.js"
            },
            {
                "url": "modules/Cleanmgr.js",
                "path": "./modules/Cleanmgr.js"
            },
            {
                "url": "modules/ConfigManager.js",
                "path": "./modules/ConfigManager.js"
            },
            {
                "url": "modules/AsyncUpdateChecker.js",
                "path": "./modules/AsyncUpdateChecker.js"
            },
            {
                "url": "modules/RadomTeleportSystem.js",
                "path": "./modules/RadomTeleportSystem.js"
            },
            {
                "url": "modules/Bstats.js",
                "path": "./modules/Bstats.js"
            },
            {
                "url": "modules/Cd.js",
                "path": "./modules/Cd.js"
            },
            {
                "url": "modules/PVP.js",
                "path": "./modules/PVP.js"
            },
            {
                "url": "modules/Redpacket.js",
                "path": "./modules/Redpacket.js"
            },
            {
                "url": "modules/Fcam.js",
                "path": "./modules/Fcam.js"
            },
            {
                "url": "modules/Notice.js",
                "path": "./modules/Notice.js"
            },
            {
                "url": "modules/Sign.js",
                "path": "./modules/Sign.js"
            },
            {
                "url": "modules/Crash.js",
                "path": "./modules/Crash.js"
            },
            {
                "url": "modules/Warp.js",
                "path": "./modules/Warp.js"
            },
            {
                "url": "modules/PluginInfo.js",
                "path": "./modules/PluginInfo.js"
            },
            {
                "url": "modules/Home.js",
                "path": "./modules/Home.js"
            },
            {
                "url": "modules/CachePool.js",
                "path": "./modules/CachePool.js"
            },
            {
                "url": "modules/WriteBackStore.js",
                "path": "./modules/WriteBackStore.js"
            }
        ],
        "reloadDelay": 1000,  //自动重载延迟
        "timeout": 30000,  //检查更新超时时间
        "checkMissingFilesOnStart": true  //是否在开服时检查有无缺失文件
    },
```
- ./Config/cleanmgr/config.json
清理器配置文件
```json
{
  "cleanmgr": {
    "enable": true,  //是否开启清理模块
    "interval": 600,  //定时清理（单位： 秒）
    "debug": false,  //debug模式
    "whitelist": [  //清理白名单
      "^minecraft:netherite_",
      "^minecraft:ancient_debris$",
      "^minecraft:dragon_egg$",
      "^minecraft:nether_star$",
      "^minecraft:elytra$",
      "^minecraft:emerald$",
      "^minecraft:beacon$",
      "^minecraft:ender_eye$",
      "^minecraft:shulker_box$",
      "^minecraft:sea_lantern$",
      "^minecraft:enchanted_book$",
      "^minecraft:diamond",
      "^minecraft:totem_of_undying$",
      "^minecraft:ender_pearl$",
      "^minecraft:villager_v2$",
      "^minecraft:ender_crystal$",
      "^minecraft:ender_dragon$",
      "^minecraft:parrot$",
      "^minecraft:chest_minecart$",
      "^minecraft:minecart$",
      "^minecraft:hopper_minecart$",
      "^minecraft:armor_stand$",
      "^minecraft:boat$",
      "^minecraft:sheep$",
      "^minecraft:cow$",
      "^minecraft:pig$",
      "^minecraft:painting$",
      "^minecraft:copper_golem$"
    ],
    "notice": {  //倒计时提示
      "notice1": 30,
      "notice2": 10
    },
    "LowTpsClean": {  //低tps自动清理
      "enable": true,   //是否启用该功能
      "minimum": 15,   //最小tps清理限制
      "maxConsecutiveCleans": 2, // 最大连续无效清理次数
      "longCooldown": 450        // 长冷却时间（秒），默认7.5分钟 (5-10分钟中间值)
    },
    "clean_Cmd": "clean",  //清理命令自定义
    "playerCooldown": 300  //玩家执行清理冷却时长（单位/秒）
  }
}
```
- ./modules/modulelist.json
模块列表
```json
{
    "modules": [
        {
            "path": "Cleanmgr.js",
            "name": "CleanMgr"
        },
        {
            "path": "ConfigManager.js",
            "name": "ConfigManager"
        },
        {
            "path": "AsyncUpdateChecker.js",
            "name": "AsyncUpdateChecker"
        },
        {
            "path": "RadomTeleportSystem.js",
            "name": "RadomTeleportSystem"
        },
        {
            "path": "Cd.js",
            "name": "Cd"
        },
        {
            "path": "XXX.js",
            "name": "XXX"  //可以添加你想要加载的模块以便服务器使用
        }
    ]
}
```

- ./Config/Cd/Config.json
菜单的配置文件

```json
{

    "money": 0,  //经济模式 0为计分板 1为LLMoney
    "itemsTriggerMode": 0,  //触发方式（保留字段，当前右键方块与右键空气均可触发）
    "score": "money",  //计分板名称
    "items": [  //菜单触发物品列表，可配置多个
        "minecraft:clock"
    ],
    "main": "main",  //主菜单文件名
    "shield": [],  //屏蔽方块列表
    "UseDogeUI": 0  //是否启用DogeUI兼容
}

```

> 💡 菜单按钮命令说明：`comm` 类型按钮中，若命令包含 `@s` 且玩家非 OP，将以控制台身份执行并把 `@s` 替换为玩家名，因此普通玩家也能通过菜单触发 `tag`、`effect`、`scoreboard` 等原版命令，无需给玩家发 OP。不含 `@s` 的命令仍以玩家身份执行，可正常触发 `home`、`warp` 等插件命令。

---

## 📥 API调用 / 使用
待补充
---

## 📦 示例指令

以下是部分常用指令示例（视插件版本可能会有所变动）：

```txt
/cd 菜单
/menu {set} 菜单{配置}
/home	 #家系统菜单(设置、传送到家)
/tpa	 #玩家互传系统带偏好设置GUI(发送传送请求)
/tpayes	 #同意传送请求
/tpano	 #拒绝传送请求
/rtp	 #随机传送(在不同维度安全随机传送)
/PVP	 #开关个人PVP功能
/warp	 #公共传送点菜单
/servers	 #跨服传送菜单
/back	 #死亡点传送(返回死亡位置)
/deathlog	 #查询以往的死亡记录
/moneygui	 #打开GUI经济系统
/moneys add & del & set get 玩家（非get时加上“金额”）	 #经济操作 ：添加/减少/增加玩家的金额
/notice	 #查看公告
/noticeset	 #更改公告
/wh	 #打开或关闭维护状态
/clean {air} status & cancel & tps &toast &help	 #清理掉落物 & 清理状态 & 取消清理 & 查询tps & 关闭顶部弹出通知 & 帮助
/suicide	 #自杀
/fcam	 #开关灵魂出窍功能
/rtpreset	 #重置冷却时间（Only 管理员）
/hub	 #一键回到指定地点（所有人可用）
/sethub	 #设置/hub传送的地点
/crash	 #打开崩溃玩家客户端菜单
/redpacket history && list && open && send	 #红包功能（长指令版）
/rp history && list && open && send	 #红包功能（短指令版）
/redpackethelp	 #红包功能详解（GUI界面）
```
---

## 迁移其他插件的数据

- 迁移TMET基础插件配置文件教程：
把 服务端目录\plugins\Timiya\data内的homelist.json和warplist.json
移动到服务端目录\plugins\YEssential\data内并且分别重命名为homedata.json和warpdata.json然后保存即可

- 迁移PMenu菜单插件配置文件教程：
把 服务端目录\plugins\Planet\PMENU\packs内的所有东西
移动 到 服务端目录\plugins\YEssential\data\menus内即可

---

## 贡献

本项目的诞生离不开PHEyeji等人的帮助与支持！<br>
如果您也想为YEssential做贡献欢迎提交 Issue，共同完善 YEssential。  

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Nico6719/YEssential&type=Date)](https://star-history.com/#Nico6719/YEssential&Date)
