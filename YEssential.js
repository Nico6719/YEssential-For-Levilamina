/*--------------------------------
Produced by Nico6719 
this plugin is distributed under the AGPLv3 License
该插件由Nico6719,PHEyeji联合创作
未经允许禁止擅自修改或者发售
该插件仅在[Github,MineBBS,KlpBBS]发布，禁止二次发布插件
调用示例： pl.tell(info + CachePool.lang("x.x"))
----------------------------------*/
// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Admin/dts/helperlib/src/index.d.ts"/> 
const YEST_LangDir = "./plugins/YEssential/lang/";
const pluginpath = "./plugins/YEssential/";
const datapath = "./plugins/YEssential/data/";
const NAME = `YEssential`;
const PluginInfo =`基岩版多功能基础插件`;
const version = "2.12.13";
const regversion =[2,12,13];
const info = "§l§d[-YEST-] §r§l> ";
const offlineMoneyPath = datapath+"/Money/offlineMoney.json";
const offlineNotifyPath = datapath+"/Money/offlineNotify.json";
const langFilePath = YEST_LangDir + "zh_cn.json";

// ── 核心配置文件初始化 ──
// 必须在 Preinit 之前定义，因为 ConfigManager.js 和 Store 实例会用到它们
let lang = new JsonConfigFile(langFilePath, JSON.stringify({}));
let conf = new JsonConfigFile(pluginpath +"/Config/config.json",JSON.stringify({}));
let homedata = new JsonConfigFile(datapath +"homedata.json",JSON.stringify({}));
let warpdata = new JsonConfigFile(datapath +"warpdata.json",JSON.stringify({}));

// ── Preinit: 同步加载核心模块 ──
(function preinit() {
    try {
        // 暴露基础变量给 require 沙箱
        Object.assign(globalThis, {
            pluginpath, datapath, conf, lang, info, version, NAME, homedata, warpdata,langFilePath,YEST_LangDir,
        });
        
        // ConfigManager 最先跑，确保 conf 文件在 CachePool 读取前已初始化完毕
        // ConfigManager 内部调用 randomGradientLog，提前注入占位函数
        if (!globalThis.randomGradientLog) {
            globalThis.randomGradientLog = (text) => logger.info(text);
        }
        require("plugins/YEssential/modules/ConfigManager.js");
        require("plugins/YEssential/modules/I18n.js");
        require("plugins/YEssential/modules/CachePool.js");
        require("plugins/YEssential/modules/WriteBackStore.js");
        
        if (globalThis.WriteBackStore) {
            globalThis.homeStore = globalThis.WriteBackStore.create(homedata, "home");
            globalThis.warpStore = globalThis.WriteBackStore.create(warpdata, "warp");
        }
    } catch (e) {
        logger.error("[YEssential] Preinit 失败: " + (e.message || e));
    }
})();

// ── Reload Guard ──────────────────────────────────────────────
// 用全局变量保证所有 mc.listen 只注册一次
const __YEST_FIRST_LOAD__ = !globalThis.__YEST_listeners_registered__;

ll.registerPlugin(NAME, PluginInfo,regversion, {
    Author: "Nico6719",
    License: "AGPL-3.0",
    QQ : "1584573887",
});

// [fix] 插件卸载/reload 兜底落盘
ll.onUnload(() => {
    try {
        if (globalThis.WriteBackStore) {
            const n = globalThis.WriteBackStore.flushAll();
            randomGradientLog(`卸载插件前已保存 ${n} 个数据存储`);
        }
    } catch (e) {
        logger.error(`onUnload 保存数据失败: ${e.message}`);
    }
});

// 全局MOTD定时器管理
let motdTimerId = null;

let transdimid = {
    0:"主世界",
    1:"下界",
    2:"末地"
}

// 文件操作工具类
class AsyncFileManager {
    static readFile(path, defaultContent = '{}') {
        try {
            if (!file.exists(path)) {
                file.writeTo(path, defaultContent);
                return JSON.parse(defaultContent);
            }
            const content = file.readFrom(path);
            return JSON.parse(content || defaultContent);
        } catch (e) {
            logger.error(`读取文件失败: ${path}`, e);
            return JSON.parse(defaultContent);
        }
    }

    static writeFile(path, data) {
        try {
            const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            file.writeTo(path, content);
            return true;
        } catch (e) {
            logger.error(`写入文件失败: ${path}`, e);
            return false;
        }
    }
}


// ── Economy 统一读取层（兼容旧config和新Economy块）─────────
// v2.10.5: 改为缓存模式，避免每次 getter 都重读配置文件
// 调用 economyCfg.refresh() 可在 reload 后刷新缓存
const economyCfg = (() => {
    let _cache = null;
    function _load() {
        const e = CachePool.conf("Economy");
        return {
            mode:       e ? (e.mode || "scoreboard") : (CachePool.conf("LLMoney") == 1 ? "llmoney" : "scoreboard"),
            scoreboard: (e ? e.Scoreboard : CachePool.conf("Scoreboard")) || "money",
            coinName:   (e ? e.CoinName   : CachePool.conf("CoinName"))   || CachePool.lang("CoinName") || "金币",
        };
    }
    return {
        refresh()        { _cache = _load(); },
        get mode()       { return (_cache || (_cache = _load())).mode; },
        get isLLMoney()  { return this.mode === "llmoney"; },
        get scoreboard() { return (_cache || (_cache = _load())).scoreboard; },
        get coinName()   { return (_cache || (_cache = _load())).coinName; },
    };
})();

let modulelist = new JsonConfigFile(pluginpath +"/modules/modulelist.json",JSON.stringify({
  "modules": [
    {
      "path": "ConfigManager.js",
      "name": "ConfigManager"
    },
    {
      "path": "AsyncUpdateChecker.js",
      "name": "AsyncUpdateChecker"
    }
  ]
}));

let rtpdata = new JsonConfigFile(datapath +"/RTPData/Rtpdata.json",JSON.stringify({}));
  
let _noticeconfJcf = new JsonConfigFile(datapath + "/NoticeSettingsData/playersettingdata.json",JSON.stringify({}));
let noticeconf = _noticeconfJcf;

let _pvpConfigJcf = new JsonConfigFile(datapath +"/PVPSettingsData/pvp_data.json",JSON.stringify({}));
let pvpConfig = _pvpConfigJcf;

let MdataPath = datapath +"/Money/Moneyranking.json";

let offlineMoney = new JsonConfigFile(offlineMoneyPath, "{}");

let _moneyHistoryJcf = new JsonConfigFile(datapath +"/Money/MoneyHistory.json",JSON.stringify({}));
let MoneyHistory = _moneyHistoryJcf;

let moneyranking = new JsonConfigFile(MdataPath, "{}");

// 所有 JCF 声明完毕，统一创建 Store（顺序必须在最后一个 JCF 之后）
if (globalThis.WriteBackStore) {
    globalThis.noticeStore       = globalThis.WriteBackStore.create(_noticeconfJcf,   "noticeconf");
    globalThis.pvpStore          = globalThis.WriteBackStore.create(_pvpConfigJcf,    "pvpConfig");
    globalThis.moneyHistoryStore = globalThis.WriteBackStore.create(_moneyHistoryJcf, "moneyHistory");
    globalThis.moneyRankingStore = globalThis.WriteBackStore.create(moneyranking,     "moneyRanking");
    noticeconf   = globalThis.noticeStore;
    pvpConfig    = globalThis.pvpStore;
    MoneyHistory = globalThis.moneyHistoryStore;
}

const defaultServerConfig = JSON.stringify({
    servers: [
      { server_name: "生存服", server_ip: "127.0.0.1", server_port: 19132 }
    ]
});

let servertp = new JsonConfigFile(datapath +"/TrSeverData/server.json", defaultServerConfig);

let tpacfg = new JsonConfigFile(datapath +"/TpaSettingsData/tpaAutoRejectConfig.json",JSON.stringify({}));

// ── 全局随机颜色对（Logo、Tip、logInfo 共用）────────────────
function randomVividColor() {
    // 排除绿色(90°~150°)和深紫色(260°~300°)
    // 可用色相段：[0,90) [150,260) [300,360) 共 260°
    const rand = Math.random() * 260;
    let h;
    if      (rand < 90)  h = rand;           // 红/橙/黄
    else if (rand < 200) h = rand + 60;      // 青/蓝  (150~260)
    else                 h = rand + 100;     // 粉/洋红 (300~360)

    const s = 0.90 + Math.random() * 0.10;  // 90%~100% 高饱和
    const l = 0.65 + Math.random() * 0.15;  // 65%~80%  高亮度
    const a = s * Math.min(l, 1 - l);
    function f(n) {
        const k = (n + h / 30) % 12;
        return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
    }
    return [f(0), f(8), f(4)];
}

function generateColorPair() {
    const c1 = randomVividColor();
    let c2, attempts = 0;
    do {
        c2 = randomVividColor();
        const diff = Math.abs(c1[0]-c2[0]) + Math.abs(c1[1]-c2[1]) + Math.abs(c1[2]-c2[2]);
        if (diff > 150 || attempts++ > 20) break;
    } while (true);
    return [c1, c2];
}

// 全局唯一颜色对，本次启动所有渐变共用
const [GLOBAL_C1, GLOBAL_C2] = generateColorPair();

function globalLerpColor(t) {
    return [
        Math.round(GLOBAL_C1[0] + (GLOBAL_C2[0] - GLOBAL_C1[0]) * t),
        Math.round(GLOBAL_C1[1] + (GLOBAL_C2[1] - GLOBAL_C1[1]) * t),
        Math.round(GLOBAL_C1[2] + (GLOBAL_C2[2] - GLOBAL_C1[2]) * t)
    ];
}
function randomGradientLog(text) {
      const len = text.length;
      let out = '';
      for (let i = 0; i < len; i++) {
          const t = len <= 1 ? 0 : i / (len - 1);
          const [r, g, b] = globalLerpColor(t);
          out += `\x1b[38;2;${r};${g};${b}m` + text[i];
      }
      logger.log(out + '\x1b[0m');
}
// ── 模块全局依赖注入 ────────────────────────────────────────
// 通过 globalThis 显式暴露供所有模块访问（包括 PVP、Fcam、Notice 等）
var stats = false; // 维护状态，避免 IIFE 内 "stats is not defined"
Object.assign(globalThis, {
    // 配置 & 数据文件
    conf, lang, info, datapath, pluginpath,
    pvpConfig, noticeconf, homedata, warpdata, rtpdata,
    MoneyHistory, moneyranking, tpacfg, servertp,
    offlineMoney, offlineMoneyPath, MdataPath,
    // 常量
    YEST_LangDir, NAME, version, regversion, PluginInfo,
    langFilePath,
    // Economy 配置对象（Redpacket.js 等模块需要）
    economyCfg,
    // defaultLangContent 由 modules/I18n.js 加载时写入 globalThis
    // 渐变日志工具（function 声明虽然会提升，但 GLOBAL_C1/C2 是 const，
    // 显式挂载确保 require() 沙箱内也能访问）
    globalLerpColor, randomGradientLog,
    // 文件工具（I18n.js 的 mergeLangFiles 需要）
    AsyncFileManager,
    // ── 工具函数（均为 function 声明，JS 引擎会提升，可安全放此处）──
    // Fcam.js 费用检查（根因：此函数未暴露导致 "smartMoneyCheck is not defined"）
    smartMoneyCheck,
    // 其他 GUI/工具函数（function 声明，提升后可用）
    showInsufficientMoneyGui, openPlayerSelectionGui,
    displayMoneyInfo, ranking,
    transdimid,
    // 注意：Economy / EconomyManager / OfflineMoneyCache / Logger 均为 const，
    // 不能在定义前引用（TDZ）。若模块需要，在其定义后通过
    // globalThis.Economy = Economy; 单独追加。
});

/**
 * YEssential - 模块初始化管理器
 * 自动加载并初始化 modules 文件夹中的所有模块
 */
(function() {

  var BASE_PATH = "plugins/YEssential/modules/";

  // ── 渐变日志工具 ──────────────────────────────────────────
  function gradientLog(text, r1, g1, b1, r2, g2, b2) {
      const len = text.length;
      let out = '';
      for (let i = 0; i < len; i++) {
          const t = len <= 1 ? 0 : i / (len - 1);
          const r = Math.round(r1 + (r2 - r1) * t);
          const g = Math.round(g1 + (g2 - g1) * t);
          const b = Math.round(b1 + (b2 - b1) * t);
          out += `\x1b[38;2;${r};${g};${b}m` + text[i];
      }
      logger.log(out + '\x1b[0m');
  }
  const logInfo  = text => randomGradientLog(text);
  const logError = text => gradientLog(text, 255,  80,   0, 200,   0,   0);
  const logWarn  = text => gradientLog(text, 255, 240,   0, 255, 140,   0);
  // ─────────────────────────────────────────────────────────

  var modules = [];
  try {
    var fullPath = BASE_PATH + "modulelist.json";
    var moduleListData = file.readFrom(fullPath);

    if (moduleListData == null || moduleListData == undefined) {
        throw new Error("文件存在但读取内容为空！请检查路径是否正确: " + fullPath);
    }

    var moduleList = JSON.parse(moduleListData);
    modules = moduleList.modules.map(function(module) {
      return {
        path: BASE_PATH + module.path,
        name: module.name
      };
    });

  } catch (err) {
    logError("读取模块列表失败: " + err);
    logError("请确保 " + BASE_PATH + "modulelist.json 文件存在且格式正确");
  }

  /**
   * 初始化所有模块
   */
  function initModules() {

    var loadedCount  = 0;
    var failedCount  = 0;
    var currentIndex = 0;

    function loadNextModule() {
      if (currentIndex >= modules.length) {
        let whConfig = CachePool.conf("wh") || { EnableModule: true, status: 0 };
        stats = whConfig.status === 1;

        if (whConfig.EnableModule && whConfig.status === 1) {
            mc.setMotd(CachePool.conf("wh").motd || "服务器维护中，请勿进入！");
        } else {
            Motd();
        }

        try {
            initializePlugin();

            if (failedCount > 0) {
                const _lf = globalThis.lang || lang;
                logWarn((_lf.get("init.fail")) || "部分模块加载失败，请检查日志");
            } else {
                setTimeout(() => {
                if (CachePool.conf("SimpleLogOutPut")== false) {
                const _l = globalThis.lang || lang;
                logInfo((_l.get("init.success")) || "所有模块加载成功！");
                logInfo("-".repeat(50));
                logInfo((_l.get("Tip1")) || "");
                logInfo((_l.get("Tip2")) || "");
                logInfo((_l.get("Tip3")) || "");
                logInfo("-".repeat(50));
                }},100)
            }
        } catch (error) {
            logError("服务器启动初始化失败: " + error.message);
            logError("错误堆栈: " + error.stack);
        }

        return;
      }

      var moduleInfo = modules[currentIndex];
      currentIndex++;

      try {
        if (CachePool.conf("SimpleLogOutPut")== false) {
        logInfo("正在加载模块: " + moduleInfo.name + " (" + moduleInfo.path + ")");
        }
        var module = require(moduleInfo.path);

        if (!module) {
          logWarn("模块 " + moduleInfo.name + " 加载失败: 返回值为空");
          failedCount++;
          setTimeout(loadNextModule, 500);
          return;
        }

        if (typeof module.init === "function") {
          module.init();
          loadedCount++;
        }
        else if (typeof module.initializeConfig === "function") {
          module.initializeConfig();
          loadedCount++;
        }
        else if (module.ConfigManager && typeof module.init === "function") {
          logInfo("执行模块初始化: " + moduleInfo.name + ".init()");
          module.init();
          loadedCount++;
        }
        else {
          loadedCount++;
        }

      } catch (err) {
        logError("✗ 模块 " + moduleInfo.name + " 加载失败: " + err);
        logError("错误堆栈: " + (err.stack || "无堆栈信息"));
        failedCount++;
      }

      setTimeout(loadNextModule, 10);
    }
    setTimeout(() => {
        printGradientLogo();   
        loadNextModule();
    }, 2000);
  }
  setTimeout(function() {
    initModules();
  }, 1);
})();
function printGradientLogo() {
    const logo = [
    " __   _______ ____ ____  _____ _   _ _____ ___    _    _     ",
    " \\ \\ / / ____/ ___/ ___|| ____| \\ | |_   _|_ _|  / \\  | |    ",
    "  \\ V /|  _| \\___ \\___ \\|  _| |  \\| | | |  | |  / _ \\ | |    ",
    "   | | | |___ ___) |__) | |___| |\\  | | |  | | / ___ \\| |___ ",
    "   |_| |_____|____/____/|_____|_| \\_| |_| |___/_/   \\_\\_____|",                                                      
    ];

                                               
    const reset = '\x1b[0m';

    // 单行渐变（版本信息 / Tip）—— 与 Logo 共用同一颜色对
    function gradientLine(text) {
        const len = text.length;
        let out = '';
        for (let i = 0; i < len; i++) {
            const t = len <= 1 ? 0 : i / (len - 1);
            const [r, g, b] = globalLerpColor(t);
            out += `\x1b[38;2;${r};${g};${b}m` + text[i];
        }
        return out + reset;
    }

    logger.log('');

    // Logo 主体：逐字符跨行整体渐变
    const totalChars = logo.length * logo[0].length;
    logo.forEach((line, lineIndex) => {
        let coloredLine = '';
        for (let i = 0; i < line.length; i++) {
            const t = (lineIndex * line.length + i) / totalChars;
            const [r, g, b] = globalLerpColor(t);
            coloredLine += `\x1b[38;2;${r};${g};${b}m` + line[i];
        }
        logger.log(coloredLine + reset);
    });

    logger.log('');
    // Tips 和分割线移至所有模块加载完毕后输出，确保 I18n 已就绪
    logger.log(gradientLine(PluginInfo + "版本:" + version + ", 作者：Nico6719"));
    randomGradientLog("-".repeat(50));
}
function initializePlugin() {
    // 第一步：获取并创建计分板
    const scoreboardName = economyCfg.scoreboard;
    
    // 检查计分板是否存在，不存在则创建
    try {
        const allObjectives = mc.getAllScoreObjectives();
        const objectiveExists = allObjectives.some(obj => obj === scoreboardName);
        
        if (!objectiveExists) {
            mc.runcmdEx(`scoreboard objectives add ${scoreboardName} dummy`);
        }   
    } catch (error) {
        logger.error(`创建计分板失败: ${error.message}`);
        // 尝试强制创建
        mc.runcmdEx(`scoreboard objectives add ${scoreboardName} dummy`);
    }
    
    // 第二步：异步合并语言文件（由 modules/I18n.js 在加载时自动处理）
    
    // 第三步：提示维护功能是否开启
    if (Maintenance.isActive) {
        setTimeout(() => {
            randomGradientLog(CachePool.lang("wh.warn"));
        }, 1000);
    }
    
    // 第四步：启用死亡不掉落
    if (CachePool.conf("KeepInventory")) {
        mc.runcmdEx("gamerule KeepInventory true");
        randomGradientLog(CachePool.lang("gamerule.KeepInventory.true"));
    }
    
    // 第五步（公告更新检测）已移至 Notice.js 模块

    // 第六步：清理残留的灵魂出窍模拟玩家
    const allPlayers = CachePool.getOnlinePlayers();
    allPlayers.forEach(p => {
        // FCAM 创建的模拟玩家通常以 _sp 结尾
        if (p.isSimulatedPlayer() && p.name.endsWith("_sp")) {
            p.simulateDisconnect();
        }
    });
    if(CachePool.conf("Update", globalThis.updateConf)?.EnableModule==0) {return;}
     else{
    // 第七步：异步初始化更新检查器并检查更新
    setTimeout(() => {
        (async () => {
            try {
                // 先初始化更新检查器（检查缺失文件）
                await AsyncUpdateChecker.init();
                
                // 获取更新配置
                const updateConfig = CachePool.conf("Update", globalThis.updateConf);
                
                // 检查是否启用更新模块
                if (updateConfig && updateConfig.EnableModule) {
                    
                    // 执行更新检查
                    await AsyncUpdateChecker.checkForUpdates(version);
                    
                    // 设置定时检查（如果配置了检查间隔）
                    if (updateConfig.CheckInterval > 0) {
                        setInterval(async () => {
                            try {
                                await AsyncUpdateChecker.checkForUpdates(version);
                            } catch (error) {
                                logger.error(`定时更新检查失败: ${error.message}`);
                            }
                        }, updateConfig.CheckInterval * 60 * 1000);
                    }
                } 
            } catch (error) {
                logger.error(`更新检查失败: ${error.message}`);
            }
        })();
    }, 3000);
}};
// AsyncLanguageManager 已迁移至 modules/I18n.js
function ranking(plname) {
    let pl = mc.getPlayer(plname);
    if (!pl) return;

    // 优先用 WriteBackStore.getAll()（内存直取），回退裸文件读
    let datas = globalThis.moneyRankingStore
        ? globalThis.moneyRankingStore.getAll()
        : (moneyranking.read() ? JSON.parse(moneyranking.read()) : {});

    // 合并内存缓存中的其他玩家数据
    for (let name in moneyCache) {
        datas[name] = moneyCache[name];
    }

    // 强制获取“你自己”的当前实时余额
    // 不管文件或缓存里是多少，现在立刻查一次真实的钱
    let myRealMoney;
    if (economyCfg.isLLMoney) {
        myRealMoney = pl.getMoney(); // LLMoney模式
    } else {
        myRealMoney = pl.getScore(economyCfg.scoreboard); // 计分板模式
    }

    // 如果获取到了余额，强制覆盖进列表，保证你自己看到的数据是100%正确的
    if (myRealMoney !== undefined && myRealMoney !== null) {
        datas[pl.realName] = myRealMoney;
        
        // 顺便更新一下缓存，防止下次又变回去
        moneyCache[pl.realName] = myRealMoney;
        moneyDirty = true;
    }

    // 4. 数据转为数组并排序
    let lst = Object.keys(datas).map(name => ({
        name: name,
        money: datas[name]
    }));

    if (lst.length === 0) {
        pl.tell(info + CachePool.lang("no.ranking.data"));
        return;
    }

    // 从大到小排序
    lst.sort((a, b) => b.money - a.money);
    
    // 截取前50名
    const rankingData = lst.slice(0, 50);
    // === 模式 1: 详细 UI ===
    if (CachePool.conf("Economy").RankingModel == "New" ) {
        const total = rankingData.reduce((sum, curr) => sum + curr.money, 0);

        let form = mc.newSimpleForm()
            .setTitle(`§l§6■ 财富排行榜 ■ §r§8[前${rankingData.length}名]`)
            .setContent(
                `§7服务器总财富: §6${formatMoney(total)}\n` +
                `§7统计时间: §f${new Date().toLocaleTimeString()}\n` +
                `§6点击按钮返回菜单 | §a你的余额: ${formatMoney(myRealMoney)}\n` +
                `§8═════════════════════`
            );

        rankingData.forEach((v, index) => {
            const rank = index + 1;
            const percentage = total > 0 ? (v.money / total * 100).toFixed(1) : "0.0";
            
            // 如果这一行是你自己，加粗显示
            let entryName = v.name === pl.realName ? `§e§l[我] ${v.name}§r` : v.name;

            form.addButton(
                `${getRankPrefix(rank)} §l${rank}. §r${entryName}\n` +
                `§l§c├ 持有: ${formatMoney(v.money)}` +
                ` §r§l占比: §a${percentage}%`
            );
        });

        pl.sendForm(form, (pl, id) => {
            if (id !== null) pl.tell(info + CachePool.lang("money.callback.menu"));
            pl.runcmd("moneygui");
        });

        // 格式化数字函数
        function formatMoney(amount) {
            if (amount === undefined || amount === null) return "0";
            if (amount >= 1e6) return (amount / 1e6).toFixed(1) + "M";
            if (amount >= 1e3) return (amount / 1e3).toFixed(1) + "K";
            return amount.toLocaleString();
        }

        // 排名图标函数
        function getRankPrefix(rank) {
            return ["§b☆", "§c◆", "§a▣"][Math.min(2, rank - 1)] || "§7";
        }
    } 
    // === 模式 0: 简单文本列表 ===
    else {
        // 在重载前强制刷盘所有数据，防止内存数据丢失
        if (globalThis.WriteBackStore) {
            globalThis.WriteBackStore.flushAll();
        }
        let form = mc.newSimpleForm();
        let str = '';
        rankingData.forEach((v) => {
            str += `${v.name}: ${v.money}\n`;
        });
        form.setTitle(CachePool.lang("ranking.list"));
        form.setContent(str);
        pl.sendForm(form, (pl, id) => {
            if (id == null) pl.runcmd("moneygui");
        });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
// 金币排行榜更新优化 - 使用内存缓存减少文件I/O
// [fix] moneyCache 改为普通 Object，避免与 for...in / Object.keys 等 API 混用
// 原来声明为 new Map() 但到处用 obj[key] / for...in / Object.keys 访问，
// 导致 ranking() 合并缓存时完全读不到数据（Map 不可被 for...in 枚举）
let moneyCache = {};
let moneyDirty = false;
function updateSinglePlayerCache(pl) {
    if (!pl) return;
    const isLLMoney = economyCfg.isLLMoney;
    const moneyValue = isLLMoney ? pl.getMoney() : pl.getScore(economyCfg.scoreboard);
    if (moneyValue !== null && moneyValue !== undefined) {
        if (moneyCache[pl.realName] !== moneyValue) {
            moneyCache[pl.realName] = moneyValue;
            moneyDirty = true;
        }
    }
}

// [fix] 加 __YEST_FIRST_LOAD__ 保护：这两个定时器之前没加，
// 每次 /reload 都会重新执行到这里，导致定时器越叠越多（旧的从未 clearInterval）
if (__YEST_FIRST_LOAD__) {
setInterval(() => {
    CachePool.getOnlinePlayers().forEach(pl => updateSinglePlayerCache(pl));
}, 30000);

// 每60秒批量写入文件（仅在有变化时）
setInterval(() => {
    if (moneyDirty) {
        const store = globalThis.moneyRankingStore;
        Object.keys(moneyCache).forEach(name => {
            store ? store.set(name, moneyCache[name]) : moneyranking.set(name, moneyCache[name]);
        });
        moneyDirty = false;
    }
}, 60000);
}

// 玩家退出时立即保存其数据
if (__YEST_FIRST_LOAD__) {
mc.listen("onLeft", (pl) => {
    CachePool.invalidatePlayerList();
    if (moneyCache[pl.realName] !== undefined) {
        const store = globalThis.moneyRankingStore;
        store ? store.set(pl.realName, moneyCache[pl.realName]) : moneyranking.set(pl.realName, moneyCache[pl.realName]);
        delete moneyCache[pl.realName];
    }
});
}
// YEssential.js - servers 命令
if (CachePool.conf("CrossServerTransfer")?.EnabledModule) {
let Sercmd = mc.newCommand("servers", "§l§a跨服传送", PermType.Any);
Sercmd.overload([]);
Sercmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl || typeof pl.sendText !== "function") {
        logger.error(info+CachePool.lang("player.isnull"));
        return;
    }
    let config = CachePool.conf("CrossServerTransfer");
    let serverList = [];
    try {
        serverList = config.servers || [];
    } catch (e) {
        logger.error(CachePool.lang("server.config.loaderror"), e);
        pl.tell(info + CachePool.lang("server.load.error"));
        return;
    }

    if (serverList.length === 0) {
        logger.error(CachePool.lang("no.server.cantpto"));
        pl.tell(info + CachePool.lang("no.server.can.tp"));
        return;
    }

    let form = mc.newSimpleForm();
    form.setContent(CachePool.lang("choose.a.server"))
    form.setTitle(CachePool.lang("server.from.title"));
    serverList.forEach((server) => {
        form.addButton(`§l§b${server.server_name}\n§7IP: ${server.server_ip}:${server.server_port}`);
    });

    pl.sendForm(form, (pl, id) => {
        if (id === null) return;

        const targetServer = serverList[id];
        if (!targetServer) {
            pl.tell(info + CachePool.lang("server.no.select"));
            return;
        }

        try {
            pl.transServer(targetServer.server_ip, targetServer.server_port);
            mc.broadcast(info+`§a${pl.realName} 前往了 ${targetServer.server_name}`);
        } catch (e) {
            logger.error(CachePool.lang("tpa.fail"), e);
            pl.tell(info + CachePool.lang("server.tp.fail"));
        }
    });
});
Sercmd.setup();
} // end if (CachePool.conf("CrossServerTransfer")?.EnabledModule)
//Hub
if (CachePool.conf("Hub")?.EnabledModule) {
const hubcmd = mc.newCommand("hub", "打开回城菜单", PermType.Any);
hubcmd.overload([]);
hubcmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return out.error(CachePool.lang("warp.only.player"));
    const Hub = CachePool.conf("Hub");
    const form = mc.newSimpleForm();
    form.setTitle(CachePool.lang("hub.tp.check"));
    form.setContent([
        '§e目标位置：',
        `§bX: §f${Hub.x}`,
        `§bY: §f${Hub.y}`,
        `§bZ: §f${Hub.z}`,
        `§b维度: §f${getDimensionName(Hub.dimid)}`
    ].join('\n'));
    form.addButton(CachePool.lang("hub.tp.now"), 'textures/ui/confirm');
    form.addButton(CachePool.lang("hub.tp.notnow"), 'textures/ui/cancel');
    pl.sendForm(form, (pl, id) => {
        if (id === 0) teleportPlayer(pl);
    });
});
hubcmd.setup();

// 注册 /sethub 指令
const sethubcmd = mc.newCommand("sethub", "设置回城点", PermType.GameMasters);
sethubcmd.overload([]);
sethubcmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return out.error(CachePool.lang("warp.only.player"));
    if (!pl.isOP()) {
        pl.tell(info + CachePool.lang("player.not.op"));
        return;
    }
    const Hubdata = {
        "x": pl.pos.x.toFixed(1) * 1,
        "y": pl.pos.y.toFixed(1) * 1,
        "z": pl.pos.z.toFixed(1) * 1,
        "dimid": pl.pos.dimid,
        isSet: true,
        EnabledModule: true
    };
    CachePool.setConf("Hub", Hubdata);
    pl.tell([
        '§a回城点已设置为：',
        `§eX: §f${pl.pos.x.toFixed(1)}`,
        `§eY: §f${pl.pos.y.toFixed(1)}`,
        `§eZ: §f${pl.pos.z.toFixed(1)}`,
        `§e维度: §f${getDimensionName(pl.pos.dimid)}`
    ].join('\n'));
});
sethubcmd.setup();
} // end if (CachePool.conf("Hub")?.EnabledModule)

// 维度ID转名称
function getDimensionName(id) {
    const dimensions = {
        0: "主世界",
        1: "下界",
        2: "末地"
    };
    return dimensions[id] || `未知维度 (ID: ${id})`;
}
// 传送功能
function teleportPlayer(pl,player) {
    try {
        const Hub =CachePool.conf("Hub")
        // [fix] dimid 字段名与 /sethub 保存时一致；移除非法第5参数 {checkMatrix}
        pl.teleport(
            parseFloat(Hub.x),
            parseFloat(Hub.y),
            parseFloat(Hub.z),
            parseInt(Hub.dimid)
        );
        pl.tell(info+CachePool.lang("hub.tp.success"));
    } catch (e) {
        // [fix] tagged template 语法错误，改为字符串拼接
        pl.tell(info + CachePool.lang("hub.tp.fail") + e.message);
        logger.error(e.stack);
    }
}
// 金币信息显示函数
function displayMoneyInfo(pl, target, isSelf = true) {
    if (!pl || !target) return CachePool.lang("money.getinfo.fail");
    const prefix = isSelf ? "你的" : `玩家 ${target.realName} 的`;
    
    if (!economyCfg.isLLMoney) {
        const money = target.getScore(economyCfg.scoreboard);
        pl.sendText(info + `${prefix}当前金币为：${money}`);
        return `${prefix}${CachePool.conf("Economy").CoinName}为: ${money}`;
    } else {
        const money = target.getMoney();
        pl.sendText(info + `${prefix}当前LLMoney金币为：${money}`);
        return `${prefix}${CachePool.conf("Economy").CoinName}为: ${money}`;
    }
}

if (__YEST_FIRST_LOAD__) {
mc.listen("onConsoleCmd",(cmd)=>{
    if(cmd.toLowerCase() != "stop" || CachePool.lang("stop.msg") == 0 ) return
    let msg = CachePool.lang("stop.msg")
    CachePool.getOnlinePlayers().forEach((pl)=>{
        pl.disconnect(msg)
    })
    setTimeout(() => {
        mc.runcmdEx("stop")  //再次尝试
    }, 500)
})
}
// ==================== 自杀 / 死亡点传送 冷却系统 ====================
// key: 玩家名, value: 冷却结束时间戳(ms)
const suicideCooldownMap = new Map();
const backCooldownMap = new Map();

/**
 * 检查并（在未冷却时）设置冷却
 * @returns {number} 剩余冷却秒数，0 表示当前不在冷却中（本次调用已顺带设置了新的冷却）
 */
function checkAndStartCooldown(map, plname, cooldownSec) {
    const now = Date.now();
    const next = map.get(plname) || 0;
    if (now < next) {
        return Math.ceil((next - now) / 1000);
    }
    if (cooldownSec > 0) map.set(plname, now + cooldownSec * 1000);
    return 0;
}

//自杀模块

if (CachePool.conf("Suicide")?.EnabledModule) {
let suicidecmd = mc.newCommand("suicide","自杀",PermType.Any)
suicidecmd.overload([])
suicidecmd.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player
    const suicideCfg = CachePool.conf("Suicide") || {};

    let cd = Number(suicideCfg.cooldown) || 0;
    let remain = checkAndStartCooldown(suicideCooldownMap, pl.realName, cd);
    if (remain > 0) return pl.tell(info + CachePool.lang("suicide.cooldown").replace("${time}", remain));

    if(!economyCfg.isLLMoney){
            if(!smartMoneyCheck(pl.realName,suicideCfg.cost)) { suicideCooldownMap.delete(pl.realName); return pl.tell(info + CachePool.lang("money.no.enough")); }
    }else{
            if(!smartMoneyCheck(pl.realName,suicideCfg.cost)) { suicideCooldownMap.delete(pl.realName); return pl.tell(info + CachePool.lang("money.no.enough")); }
    }
    pl.tell(info + CachePool.lang("suicide.kill.ok"));
    pl.kill()

})
suicidecmd.setup()
} // end if (CachePool.conf("Suicide")?.EnabledModule)

function Motd(){
    // 清理旧的定时器，防止内存泄漏
    if (CachePool.conf("Motd")?.EnabledModule == 0 ) return;

    if (motdTimerId !== null) {
        clearInterval(motdTimerId);
        motdTimerId = null;
    }
    
    let motds = CachePool.conf("Motd").message;
    if (!motds || motds.length === 0) {
        logger.warn(CachePool.lang("Motd.config.isemp"));
        return;
    }
    
    let index = 0;
    motdTimerId = setInterval(() => {
        mc.setMotd(motds[index]);
        index = (index + 1) % motds.length;
    }, 5000);
}

//维护模块
// 初始化维护状态变量，从配置读取

const Maintenance = {
    get config() { return CachePool.conf("wh") || { EnableModule: true, status: 0 }; },
    get isActive() { return this.config.status === 1; },
    setStatus: function(status) {
        let c = this.config;
        c.status = status ? 1 : 0;
        CachePool.setConf("wh", c);
        return status;
    }
};

let whcmd = mc.newCommand("wh", "维护模式", PermType.GameMasters)
whcmd.overload([])

whcmd.setCallback((cmd, ori, out, res) => {
    let pl = ori.player;
    if (!Maintenance.config.EnableModule) return out.error(CachePool.lang("module.no.Enabled"));
    const newState = Maintenance.setStatus(!Maintenance.isActive);
    if (!pl) {
    randomGradientLog(`维护模式已${newState ? "开启" : "关闭"}`);
    }else{
    pl.sendText(`维护模式已${newState ? "开启" : "关闭"}`);
    }
    if (newState) {
        // 开启维护模式时：停止MOTD轮播，设置维护信息
        if (motdTimerId !== null) {
            clearInterval(motdTimerId);
            motdTimerId = null;
        }
        const whConfig = CachePool.conf("wh");
        mc.setMotd(whConfig.whmotdmsg);
        CachePool.getOnlinePlayers().forEach((player) => {
            if (!player.isSimulatedPlayer() && !player.isOP()) {
                player.kick(whConfig.whmotdmsg);
            }
        });
    } else {
        // 关闭维护模式时：恢复MOTD轮播
        Motd();
    }
})
whcmd.setup()

if (__YEST_FIRST_LOAD__) {
mc.listen("onPreJoin", (pl) => {
    // 检查模块是否启用
    let currentConfig = CachePool.conf("wh") || { EnableModule: true, status: 0 , whmotdmsg: "服务器维护中，请勿进入！", whgamemsg: "服务器正在维护中，请您稍后再来!"};
    if (!currentConfig.EnableModule) return;
    if (pl.isSimulatedPlayer()) return;
    if (pl.isOP()) return;
    if (Maintenance.isActive) {
        pl.kick(currentConfig.whgamemsg);            
    }
})
}

function getRandomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

// 优化的唯一时间戳生成器
let operationCounter = 0;
function getUniqueTimestamp() {
    return `${system.getTimeStr()}-${operationCounter++}`;
}

// moneys指令相关
const moneycmd = mc.newCommand("moneys", "金币", PermType.GameMasters);
moneycmd.mandatory("option", ParamType.String);
moneycmd.optional("player", ParamType.String);
moneycmd.optional("amount", ParamType.Int);
moneycmd.overload(["option", "player", "amount"]);
moneycmd.setCallback((cmd, ori, out, res) => {
    if (typeof res.player !== "string" || res.player.trim() === "") {
        return out.error(info + CachePool.lang("moneys.command.error"));
    }

    const targetPl = mc.getPlayer(res.player);
    if (!targetPl) return out.error(info + CachePool.lang("money.tr.noonline"));

    const coinName = economyCfg.coinName;
    const history = MoneyHistory.get(targetPl.realName) || {};
    const timestamp = getUniqueTimestamp();

    const logAndNotify = (actionKey, successKey, economyMethod, amount) => {
        if (amount === undefined || amount === null) {
            return out.error(`§c请指定数量！用法: /moneys ${res.option} <玩家> <数量>`);
        }
        if (economyMethod === 'set' && amount < 0) {
            return out.error(info + CachePool.lang("key.not.number"));
        }
        if ((economyMethod === 'add' || economyMethod === 'reduce') && amount <= 0) {
            return out.error(info + CachePool.lang("key.not.number"));
        }
        Economy.execute(targetPl, economyMethod, amount);
        const operatorName = ori.player ? ori.player.realName : "控制台";
        history[timestamp] = `${coinName}${CachePool.lang(actionKey)}${amount} (操作员: ${operatorName})`;
        MoneyHistory.set(targetPl.realName, history);
        out.success(info + CachePool.lang(successKey)
            .replace("${player}", res.player)
            .replace("${coin}", coinName)
            .replace("${amount}", amount));
    };

    const handlers = {
        set:     () => logAndNotify("money.op.set",    "moneys.set.success", "set",    res.amount),
        add:     () => logAndNotify("money.op.add",    "moneys.add.success", "add",    res.amount),
        del:     () => logAndNotify("money.op.remove", "moneys.del.success", "reduce", res.amount),
        get:     () => {
            out.success(info + CachePool.lang("moneys.get.result")
                .replace("${player}", res.player)
                .replace("${coin}", coinName)
                .replace("${amount}", Economy.get(targetPl)));
        },

        history: () => {
            // 统一调用
            showUnifiedHistory(ori.player, res.player); 
        }
    };

    const handler = handlers[res.option];
    if (handler) handler();
    else out.error(info + CachePool.lang("moneys.command.error"));
});
moneycmd.setup();
let moneygui = mc.newCommand("moneygui","金币", PermType.Any)
moneygui.overload([])
moneygui.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player
    if(!pl) return out.error(CachePool.lang("warp.only.player"))
    if(pl.isOP()){
        OPMoneyGui(pl.realName)
    }else{
        MoneyGui(pl.realName)
    }

})
moneygui.setup()

function MoneyGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return

    // [fix] 一次读取，后续复用，避免每次 addButton 都重新读配置文件
    const econConf  = CachePool.conf("Economy");
    const coinName  = econConf.CoinName;
    const rpEnabled = CachePool.conf("RedPacket")?.EnabledModule == 1;

    let fm = mc.newSimpleForm()
    fm.setTitle(coinName)
    fm.addButton((CachePool.lang("money.query") || "查询") + coinName, "textures/ui/MCoin")
    fm.addButton((CachePool.lang("money.transfer") || "转账") + coinName, "textures/ui/trade_icon")
    fm.addButton(CachePool.lang("money.offline.transfer.btn") || "转账给离线玩家", "textures/ui/FriendsDiversity")
    fm.addButton((CachePool.lang("money.view") || "查看") + coinName + (CachePool.lang("money.history") || "历史记录"), "textures/ui/book_addtextpage_default")
    fm.addButton(coinName + (CachePool.lang("money.player.list") || "排行榜"), "textures/ui/icon_book_writable")
    if (rpEnabled){
        fm.addButton(CachePool.lang("rp.menu.1") || "红包", "textures/ui/gift_square")
    }
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + CachePool.lang("gui.exit"));
        
        let currentId = id;
        if (!rpEnabled && currentId >= 5) {
            currentId += 1;
        }

        switch(currentId){
           case 0:
                let fm = mc.newSimpleForm()
                fm.setTitle(CachePool.lang("money.query") + coinName)
                const content = displayMoneyInfo(pl, pl);
                fm.setContent(content);
                pl.sendForm(fm, (pl, id) => {
                if (id === null) return pl.runcmd("moneygui");
                });
                break;
            case 1:
                MoneyTransferGui(pl.realName)
                break;
            case 2:
                MoneyTransferOfflineGui(pl.realName)
                break;
            case 3:
                showUnifiedHistory(pl, pl.realName);
                break;
            case 4:
                ranking(pl.realName)
                break;
            case 5:
                redpacketgui(pl.realName)
                break
        }
    })
}
function redpacketgui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newSimpleForm();
    fm.setTitle(CachePool.lang("rp.menu.1"));
    fm.addButton(CachePool.lang("rp.send.packet"), "textures/ui/trade_icon");
    fm.addButton(CachePool.lang("rp.open.packet"), "textures/ui/MCoin");
    fm.addButton(CachePool.lang("rp.all.help"), "textures/ui/book_addtextpage_default");

    pl.sendForm(fm, (pl, id) => {
        if (id === null) return pl.tell(info + CachePool.lang("gui.exit"));

        switch (id) {
            case 0: // 发红包界面
                const sendFm = mc.newCustomForm().setTitle(CachePool.lang("rp.send.packet"));
                sendFm.addDropdown(CachePool.lang("redpacket.type"), [
                    CachePool.lang("rp.random.packet"), 
                    CachePool.lang("rp.average.packet")
                ]);
                sendFm.addInput(CachePool.lang("rp.send.amount"), "请输入总金额", "1", CachePool.lang("rp.send.amount.tip") || "");
                sendFm.addInput(CachePool.lang("rp.send.count"), "请输入红包个数", "1", CachePool.lang("rp.send.count.tip") || "");

                pl.sendForm(sendFm, (pl, data) => {
                    if (data === null || data === undefined) return pl.runcmd("moneygui");
                    // 这里的索引必须严格对应上面的 add 顺序：
                    // data[0] -> Dropdown (类型)
                    // data[1] -> Input (金额)
                    // data[2] -> Input (个数)
                    const type = data[0];
                    let amountStr = data[1];
                    let countStr = data[2];

                    // 1. 金额验证
                    if (!amountStr) return pl.tell(info + CachePool.lang("money.tr.noinput"));
                    
                    let amount;
                    if (amountStr.toLowerCase() === "all") {
                        amount = Economy.get(pl);
                    } else if (/^\d+$/.test(amountStr)) {
                        amount = parseInt(amountStr);
                    } else {
                        return pl.tell(info + CachePool.lang("key.not.number"));
                    }

                    if (amount <= 0) return pl.tell(info + CachePool.lang("money.must.bigger0"));

                    // 2. 个数验证
                    if (!countStr) return pl.tell(info + CachePool.lang("money.tr.noinput"));
                    if (!/^\d+$/.test(countStr)) return pl.tell(info + CachePool.lang("key.not.number"));
                    
                    const count = parseInt(countStr);
                    if (count <= 0) return pl.tell(info + CachePool.lang("money.must.bigger0"));

                    // 3. 余额校验
                    const myMoney = Economy.get(pl);
                    if (amount > myMoney) {
                        return pl.sendText(info + CachePool.lang("rp.count.bigger.yourmoney") + CachePool.conf("Economy").CoinName);
                    }

                    // 4. 执行命令
                    // 假设红包系统通过指令触发，type 0 为随机红包，1 为普通(平均)红包
                    const cmdSuffix = (type === 0) ? "" : " average";
                    pl.runcmd(`rp send ${amount} ${count}${cmdSuffix}`);
                });
                break;

            case 1: // 领取/列表
                pl.runcmd("rp list");
                break;

            case 2: // 帮助
                showRpHelp(pl);
                break;
        }
    });
}

function OPMoneyGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    const coinName  = economyCfg.coinName;
    const rpEnabled  = CachePool.conf("RedPacket")?.EnabledModule == 1;
    let fm = mc.newSimpleForm()
    fm.setTitle("(OP)"+coinName)
    fm.addButton((CachePool.lang("money.op.add") || "增加玩家的") + coinName, "textures/ui/icon_best3")
    fm.addButton((CachePool.lang("money.op.remove") || "减少玩家的") + coinName, "textures/ui/redX1")
    fm.addButton((CachePool.lang("money.op.set") || "设置玩家的") + coinName, "textures/ui/gear")
    fm.addButton(CachePool.lang("money.op.offline.btn") || "对离线玩家进行金币操作", "textures/ui/FriendsDiversity")
    fm.addButton((CachePool.lang("money.op.look") || "查看玩家的") + coinName, "textures/ui/MCoin")
    fm.addButton("查看玩家的" + coinName + "历史记录", "textures/ui/book_addtextpage_default")
    fm.addButton("全服" + coinName + "排行榜", "textures/ui/icon_book_writable")
    if (rpEnabled){
        fm.addButton(CachePool.lang("rp.menu.1") || "红包", "textures/ui/gift_square")
    }
    fm.addButton(CachePool.lang("money.gui.useplayer") || "使用玩家的金钱菜单", "textures/ui/icon_multiplayer")
    
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + CachePool.lang("gui.exit"));
        
        let currentId = id;
        if (!rpEnabled && currentId >= 7) {
            currentId += 1;
        }

        switch(currentId){
            case 0:
                MoneyAddGui(pl.realName)
                break
            case 1:
                MoneyReduceGui(pl.realName)
                break
            case 2:
                MoneySetGui(pl.realName)
                break
            case 3:
                OPOfflineMoneyGui(pl.realName)
                break
            case 4:
                MoneyGetGui(pl.realName)
                break
            case 5:
                MoneyHistoryGui(pl.realName)
                break
            case 6:
                ranking(pl.realName)
                break
            case 7:
                redpacketgui(pl.realName)
                break
            case 8:
                MoneyGui(pl.realName)
                break
        }
    })
}

// --- 1. 核心工具类 (封装底层逻辑) ---
// --- v2.7.2 添加离线货币缓存管理 ---
const OfflineMoneyCache = {
    // 读取离线缓存
    load: () => {
        if (!File.exists(offlineMoneyPath)) {
            File.writeTo(offlineMoneyPath, JSON.stringify({}));
        }
        return JSON.parse(File.readFrom(offlineMoneyPath));
    },
    
    // 保存离线缓存
    save: (data) => {
        File.writeTo(offlineMoneyPath, JSON.stringify(data, null, 2));
    },
    
    // 添加离线操作记录
    add: (playerName, type, amount) => {
        const cache = OfflineMoneyCache.load();
        if (!cache[playerName]) {
            cache[playerName] = [];
        }
        cache[playerName].push({
            type: type,
            amount: amount,
            timestamp: system.getTimeStr()
        });
        OfflineMoneyCache.save(cache);
    },
    
    // 获取玩家的离线操作
    get: (playerName) => {
        const cache = OfflineMoneyCache.load();
        return cache[playerName] || [];
    },
    
    // 清除玩家的离线操作
    clear: (playerName) => {
        const cache = OfflineMoneyCache.load();
        delete cache[playerName];
        OfflineMoneyCache.save(cache);
    },
    
    // 应用离线操作到在线玩家
    apply: (player) => {
        const operations = OfflineMoneyCache.get(player.realName);
        if (operations.length === 0) return;
        
        const coinName = economyCfg.coinName;
        let totalChange = 0;
        
        operations.forEach(op => {
            Economy.execute(player, op.type, op.amount);
            
            // 计算总变化（用于通知）
            if (op.type === 'add' || op.type === 'set') {
                totalChange += op.amount;
            } else if (op.type === 'reduce') {
                totalChange -= op.amount;
            }
        });
        
        // 清除已应用的操作
        OfflineMoneyCache.clear(player.realName);
        
        // 通知玩家
        if (totalChange !== 0) {
            const message = totalChange > 0 
                ? `${info}§a离线期间金币变动 +${totalChange} ${coinName}`
                : `${info}§c离线期间金币变动 ${totalChange} ${coinName}`;
            player.tell(message);
        }
        
    }
};

// --- 改进的 Economy 核心 ---
const Economy = {
    isScoreboard: () => !economyCfg.isLLMoney,
    getObjName: () => economyCfg.scoreboard,
    
    // 获取余额
    get: (p) => {
        return Economy.isScoreboard() 
            ? p.getScore(Economy.getObjName()) 
            : p.getMoney();
    },
    
    // 执行变更操作（自动处理在线/离线）
    execute: (playerIdentifier, type, amount) => {
        // 如果是 Player 对象（在线玩家）
        if (typeof playerIdentifier === 'object' && playerIdentifier.getScore) {
            const p = playerIdentifier;
            const isScore = Economy.isScoreboard();
            const obj = Economy.getObjName();
            
            switch (type) {
                case 'set': return isScore ? p.setScore(obj, amount) : p.setMoney(amount);
                case 'add': return isScore ? p.addScore(obj, amount) : p.addMoney(amount);
                case 'reduce': return isScore ? p.reduceScore(obj, amount) : p.reduceMoney(amount);
                default: return false;
            }
        }
        
        // 如果是字符串（玩家名） - 尝试获取在线玩家
        const playerName = typeof playerIdentifier === 'string' ? playerIdentifier : playerIdentifier.realName;
        const onlinePlayer = mc.getPlayer(playerName);
        
        if (onlinePlayer) {
            // 玩家在线，直接操作
            return Economy.execute(onlinePlayer, type, amount);
        } else {
            // 玩家离线，添加到缓存队列
            OfflineMoneyCache.add(playerName, type, amount);
            randomGradientLog(`[Economy] 玩家 ${playerName} 离线，操作已缓存: ${type} ${amount}`);
            return true; // 返回成功，因为已缓存
        }
    }
};

const EconomyManager = {
    getScoreboard: () => economyCfg.scoreboard,
    isLLMoney: () => !!economyCfg.isLLMoney,
    
    checkAndReduce: function(playerName, amount) {
        const player = mc.getPlayer(playerName);
        if (!player) return false;
        
        if (this.isLLMoney()) {
            const balance = player.getMoney();
            if (balance === null || balance === undefined) {
                player.setMoney(0);
                return false;
            }
            if (balance < amount) return false;
            return player.reduceMoney(amount);
        } else {
            const sb = this.getScoreboard();
            const score = player.getScore(sb);
            if (score < amount) return false;
            return player.reduceScore(sb, amount);
        }
    }
};


// ══════════════════════════════════════════════════════════════
// EconomyNotify - 经济操作通知系统
// 作用：对在线玩家直接推送余额变动消息；对离线玩家存入队列，
//       下次上线时在 onJoin 统一投递。
// ══════════════════════════════════════════════════════════════
const EconomyNotify = {

    // ── 磁盘读写 ─────────────────────────────────────────────
    _load: () => {
        if (!File.exists(offlineNotifyPath)) File.writeTo(offlineNotifyPath, "{}");
        try { return JSON.parse(File.readFrom(offlineNotifyPath)) || {}; }
        catch(e) { return {}; }
    },
    _save: (data) => { File.writeTo(offlineNotifyPath, JSON.stringify(data, null, 2)); },

    // ── 将消息存入离线队列 ────────────────────────────────────
    addOffline: (playerName, msg) => {
        const db = EconomyNotify._load();
        if (!db[playerName]) db[playerName] = [];
        db[playerName].push(msg);
        EconomyNotify._save(db);
    },

    // ── 投递消息（在线则直发，离线则入队）───────────────────
    send: (playerOrName, msg) => {
        if (typeof playerOrName === "string") {
            const online = mc.getPlayer(playerOrName);
            if (online) { online.sendText(msg); }
            else        { EconomyNotify.addOffline(playerOrName, msg); }
        } else {
            // 直接是 Player 对象
            playerOrName.sendText(msg);
        }
    },

    // ── 玩家上线时统一投递积压通知 ───────────────────────────
    apply: (player) => {
        const db   = EconomyNotify._load();
        const msgs = db[player.realName];
        if (!msgs || msgs.length === 0) return;

        setTimeout(() => {
            msgs.forEach(msg => player.sendText(msg));
            delete db[player.realName];
            EconomyNotify._save(db);
        }, 1500);   // 稍作延迟，避免和其他上线消息重叠
    },

    // ── 格式化帮助函数（生成统一风格的余额变动提示）────────
    // type: 'add' | 'reduce' | 'set'
    fmt: {
        // 转账 - 发送方
        transferSend: (targetName, amount, tax, received, coinName, note) => {
            return `${info}§e转账成功 §7-> §f${targetName} §7| 转出 §c${amount} §7税 §e${tax} §7到账 §a${received} ${coinName}` +
                   (note ? ` §7| 备注：§f${note}` : "");
        },
        // 转账 - 收款方（在线）
        transferReceive: (senderName, received, tax, coinName, note) => {
            return `${info}§a收到转账 §7来自 §f${senderName} §7| 到账 §a${received} ${coinName}` +
                   (tax > 0 ? ` §7(发方缴税 §e${tax}§7)` : "") +
                   (note ? ` §7| 备注：§f${note}` : "");
        },
        // 离线转账 - 收款方（上线时投递）
        transferReceiveOffline: (senderName, received, tax, coinName, note) => {
            return `${info}§a离线转账到账 §7来自 §f${senderName} §7| 到账 §a${received} ${coinName}` +
                   (tax > 0 ? ` §7(发方缴税 §e${tax}§7)` : "") +
                   (note ? ` §7| 备注：§f${note}` : "");
        },
        // OP操作通知
        adminOp: (opType, amount, coinName, adminName, note) => {
            const colorMap = { add: "§a", reduce: "§c", set: "§e" };
            const wordMap  = { add: "+", reduce: "-", set: "=" };
            const c = colorMap[opType] || "§f";
            const s = wordMap[opType]  || "";
            return `${info}§7余额变动 ${c}${s}${amount} ${coinName} §7| 管理员 §f${adminName}` +
                   (note ? ` §7| 备注：§f${note}` : "");
        },
        // 系统自动操作
        system: (opType, amount, coinName, reason) => {
            const colorMap = { add: "§a", reduce: "§c" };
            const wordMap  = { add: "+", reduce: "-" };
            const c = colorMap[opType] || "§f";
            const s = wordMap[opType]  || "";
            return `${info}§7系统余额变动 ${c}${s}${amount} ${coinName} §7| ${reason}`;
        }
    }
};
globalThis.EconomyNotify = EconomyNotify;

// --- 玩家加入事件监听（v2.10.5：三处分散注册合并为一处）---
if (__YEST_FIRST_LOAD__) {
mc.listen("onJoin", (pl) => {
    CachePool.invalidatePlayerList();
    try {
        // ── 1. 排行榜货币缓存 ──
        updateSinglePlayerCache(pl);

        // ── 2. 初始化玩家数据 ──
        homedata.init(pl.realName, {});
        rtpdata.init(pl.realName, {});
        // WriteBackStore 没有 .init()，等价替换：key 不存在时才写入默认值
        if (MoneyHistory.get(pl.realName) === null || MoneyHistory.get(pl.realName) === undefined) {
            MoneyHistory.set(pl.realName, {});
        }

        // 初始化金币
        if (economyCfg.isLLMoney) {
            const currentMoney = pl.getMoney();
            if (currentMoney === null || currentMoney === undefined) pl.setMoney(0);
        } else {
            const score = pl.getScore(economyCfg.scoreboard);
            if (!score) pl.setScore(economyCfg.scoreboard, 0);
        }

        if (!pl.isOP()) {
            const xuid = pl.realName;
            if (pvpConfig.get(xuid) === undefined) pvpConfig.set(xuid, false);
            const plname = pl.realName;
            pl.setGameMode(0);
            setTimeout(() => { mc.runcmdEx(`tp ${plname} ${plname + "_sp"}`); }, 1000);
        }

        // ── 3. 离线货币 & 经济通知投递 ──
        OfflineMoneyCache.apply(pl);
        EconomyNotify.apply(pl);

    } catch (error) {
        logger.error(`玩家 ${pl.realName} 加入事件处理失败: ${error.message}`);
    }
});
}
const Logger = {
    // 记录历史
    // targetName: 谁的钱变了
    // message: 变动记录内容
    add: (targetName, message) => {
        let history = MoneyHistory.get(targetName) || {};
        // 使用时间戳+随机字符防止Key冲突
        let key = `${system.getTimeStr()}§${getRandomLetter()}`;
        history[key] = message;
        MoneyHistory.set(targetName, history);
    }
};

// ── 将 const 对象追加到 globalThis（必须在定义之后，不能提前引用）──
// 这样 Fcam / PVP 等模块在初始化时若需要这些接口，也能访问到
globalThis.Economy          = Economy;
globalThis.EconomyManager   = EconomyManager;
globalThis.OfflineMoneyCache = OfflineMoneyCache;
globalThis.Logger           = Logger;

// --- 2. UI 辅助工具 (消除重复的选人代码) ---

/**
 * 快速构建一个"选择在线玩家"的表单
 * @param {Player} pl 操作者
 * @param {string} title 表单标题
 * @param {Function} callback 回调函数 (targetPlayer) => {}
 */
function openPlayerSelectionGui(pl, title, callback) {
    const onlinePlayers = CachePool.getOnlinePlayers();
    const playerNames = onlinePlayers.map(p => p.realName);
    
    const fm = mc.newCustomForm();
    fm.setTitle(title);
    fm.addDropdown(CachePool.lang("choose") + CachePool.lang("player"), playerNames);
    
    pl.sendForm(fm, (player, data) => {
        if (data == null) return player.runcmd("moneygui");
        
        const target = mc.getPlayer(playerNames[data[0]]);
        if (!target) {
            return player.tell(info + CachePool.lang("money.tr.noonline"));
        }
        
        // 找到玩家后，执行回调逻辑
        callback(target);
    });
}
/**
 * 统一金币历史记录查询 GUI 
 * @param {Player} viewer 发起查看请求的玩家
 * @param {string} targetName 被查询的目标玩家名
 */
function showUnifiedHistory(viewer, targetName) {
    if (!viewer) return;
    
    const coinName = economyCfg.coinName;
    const historyData = MoneyHistory.get(targetName) || {};
    const entries = Object.entries(historyData);
    const isOP = viewer.isOP();

    // 1. 获取最近的 50 条记录
    const recentEntries = entries.slice(-50).reverse();

    // 2. 动态获取“显示年份”
    // 如果有记录，从第一条（即最新的）记录的 key 中截取年份 (前 4 位)
    // 如果没记录，则使用当前系统年份
    let displayYear = new Date().getFullYear();
    if (recentEntries.length > 0) {
        // rawTime 格式通常为 "2024-05-20 12:00:00-0"
        displayYear = recentEntries[0][0].substring(0, 4); 
    }

    // 3. 格式化列表内容
    const listContent = recentEntries
        .map(([rawTime, val]) => {
            // 截取 月-日 时:分 (从索引 5 开始：05-20 12:00)
            const displayTime = rawTime.substring(5, 16); 
            return `§7[${displayTime}]§r ${val}`;
        })
        .join('\n') || "§c暂无历史记录";

    const fm = mc.newSimpleForm();
    fm.setTitle(`§l${targetName}§r 的 ${coinName} 历史`);
    
    // 4. 构造正文，使用提取出的真实年份 displayYear
    let mainContent = CachePool.lang("money.history")+`\n${"=".repeat(14)}${displayYear}${"=".repeat(14)}`;
    mainContent += `\n${listContent}`;
    fm.setContent(mainContent);
    
    // ... 后续按钮逻辑不变
    fm.addButton(CachePool.lang("money.callback.lastgui"), "textures/ui/back_button_default");
    fm.addButton(CachePool.lang("rp.list.close"), "textures/ui/close_X_button");
    viewer.sendForm(fm, (p, id) => {
        if (id === 0) {
            if (isOP && p.realName !== targetName) {
                // p.runcmd("moneyadmin");
            } else {
                p.runcmd("moneygui");
            }
        }
    });
}
/**
 * 通用的管理员金币操作逻辑 (设置/增加/减少)
 */
function handleAdminOp(pl, target, opType, actionText, inputLabel) {
    const fm = mc.newCustomForm();
    fm.setTitle(`${actionText} ${target.realName} 的 ${CachePool.conf("Economy").CoinName}`);
    fm.addInput(inputLabel, CachePool.lang("key.not.number"), "0", CachePool.lang("key.not.number.tip") || "");
    
    pl.sendForm(fm, (admin, data) => {
        if (data == null) return;
        
        const inputVal = data[0];
        if (!inputVal || inputVal.trim() === "") {
            return admin.tell(info + CachePool.lang("money.setting.number")); // 使用原本的提示key
        }
        
        const amount = parseInt(inputVal, 10);
        if (isNaN(amount)) return admin.tell(info + CachePool.lang("key.not.number"));
        if (opType === 'set' && amount < 0) return admin.tell(info + CachePool.lang("money.must.biggerzero"));
        if ((opType === 'add' || opType === 'reduce') && amount <= 0) return admin.tell(info + CachePool.lang("money.must.biggerzero"));

        const coinName = economyCfg.coinName;
        
        // 执行经济操作
        Economy.execute(target, opType, amount);
        
        // 记录日志 (修复了原代码存错人的Bug)
        const logMsg = `${coinName}${actionText}${amount} (操作员: ${admin.realName})`;
        Logger.add(target.realName, logMsg);
        
        // ── 通知目标玩家（在线直发，离线入队）───────────────
        EconomyNotify.send(
            target,
            EconomyNotify.fmt.adminOp(opType, amount, coinName, admin.realName)
        );

        // 发送反馈给操作员
        admin.sendText(`${info}${CachePool.lang("success")}${CachePool.lang("to")}${CachePool.lang("player")}${target.realName}的${CachePool.conf("Economy").CoinName}${actionText}${amount}`);
        admin.sendText(`${info}玩家当前金币为：${Economy.get(target)}`);
    });
}
// --- 3. 功能入口函数 ---

// [查看历史]
function MoneyHistoryGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, `查看玩家${CachePool.conf("Economy").CoinName}历史`, (target) => {
        pl.sendText(info + `玩家 ${target.realName} 的 ${CachePool.conf("Economy").CoinName} 历史记录`);
        // 统一调用
        showUnifiedHistory(pl, target.realName);
    });
}

// calcTax — 阶梯税率计算
/**
 * @param {number} amount  转账金额（用于计算税额）
 * @param {number} balance 玩家当前余额（用于匹配档位）
 * @returns {{ tax:number, rate:number, taxTip:string }}
 */
function calcTax(amount, balance) {
    const cfg = CachePool.conf("Economy").PayTaxRate;

    // 旧版兼容：单一数字
    if (typeof cfg === "number") {
        return { tax: Math.floor(amount * (cfg / 100)), rate: cfg, taxTip: `${cfg}%` };
    }

    // 新版阶梯数组 — 按余额匹配档位，对转账金额征税
    if (Array.isArray(cfg) && cfg.length > 0) {
        for (const tier of cfg) {
            if (balance >= tier.min && (tier.max === -1 || balance < tier.max)) {
                const taxTip = `${tier.rate}%`;
                return { tax: Math.floor(amount * (tier.rate / 100)), rate: tier.rate, taxTip };
            }
        }
    }

    return { tax: 0, rate: 0, taxTip: "0%" };
}

/**
 * 玩家转账 GUI
 * 优化点：封装经济接口、增强金额验证、加入备注支持、修复税率逻辑
 */
function MoneyTransferGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;
    const playerNames = CachePool.getOnlinePlayers().map(p => p.realName);
    const myBalance = Economy.get(pl);
    const coinName = economyCfg.coinName;
    // 用 calcTax(0, myBalance) 只为取 taxTip 展示当前档位
    const { taxTip } = calcTax(0, myBalance);
    const fm = mc.newCustomForm();
    fm.setTitle(CachePool.lang("money.transfer.title") + coinName);
    fm.addLabel(CachePool.lang("money.transfer.balance")
        .replace("${balance}", myBalance)
        .replace("${coin}", coinName) + "\n" + 
        CachePool.lang("money.transfer.tax").replace("${rate}", taxTip));
    fm.addDropdown(CachePool.lang("choose") + CachePool.lang("one") + CachePool.lang("player"), playerNames);
    fm.addInput(CachePool.lang("money.tr.amount"), CachePool.lang("money.transfer.input.amount"), "0", CachePool.lang("money.tr.amount.tip") || "");
    fm.addInput(CachePool.lang("money.tr.beizhu"), CachePool.lang("money.tr.beizhu"), "无", CachePool.lang("money.tr.beizhu.tip") || "");

    pl.sendForm(fm, (player, data) => {
        if (data == null) return player.runcmd("moneygui");

        const [, targetIdx, inputAmount, note] = data;
        const target = mc.getPlayer(playerNames[targetIdx]);

        // [fix] 原条件 !x===false 双重否定导致 null target 时直接 TypeError；
        //       拆为三段：target不存在 | 是模拟玩家 | 转给自己
        if (!target || target.isSimulatedPlayer() || player.realName === target.realName) {
            return player.tell(info + (player.realName === target?.realName
                ? CachePool.lang("money.tr.error2")
                : CachePool.lang("money.tr.error1")));
        }

        const amountStr = inputAmount.trim().toLowerCase();
        const finalAmount = amountStr === "all" 
            ? Economy.get(player) 
            : /^\d+$/.test(amountStr) ? parseInt(amountStr) : -1;

        if (finalAmount <= 0) {
            return player.tell(info + (finalAmount === -1 
                ? CachePool.lang("key.not.number") 
                : CachePool.lang("money.must.bigger0")));
        }

        const { tax } = calcTax(finalAmount, Economy.get(player));
        const actualReceived = finalAmount - tax;

        if (actualReceived <= 0 || Economy.get(player) < finalAmount) {
            return player.tell(info + (actualReceived <= 0 
                ? CachePool.lang("money.transfer.tax.notenough") 
                : CachePool.lang("money.no.enough")));
        }

        Economy.execute(player, 'reduce', finalAmount);
        Economy.execute(target, 'add', actualReceived);

        const timeStr = system.getTimeStr();
        const noteMsg = note ? ` ${CachePool.lang("money.tr.beizhu")}: ${note}` : "";
        const coinName = economyCfg.coinName;
        
        Logger.add(player.realName, 
            `${timeStr} ${CachePool.lang("money.transfer.log.send")
                .replace("${target}", target.realName)
                .replace("${amount}", finalAmount)
                .replace("${received}", actualReceived)
                .replace("${tax}", tax)}${noteMsg}`
        );
        Logger.add(target.realName, 
            `${timeStr} ${CachePool.lang("money.transfer.log.receive")
                .replace("${sender}", player.realName)
                .replace("${amount}", finalAmount)
                .replace("${received}", actualReceived)
                .replace("${tax}", tax)}${noteMsg}`
        );

        // ── 通知双方 ─────────────────────────────────────────
        player.sendText(EconomyNotify.fmt.transferSend(
            target.realName, finalAmount, tax, actualReceived, coinName, note
        ));
        target.sendText(EconomyNotify.fmt.transferReceive(
            player.realName, actualReceived, tax, coinName, note
        ));
    });
}
// ══════════════════════════════════════════════════════════════
// MoneyTransferOfflineGui - 玩家版：转账给离线玩家
// ══════════════════════════════════════════════════════════════
function MoneyTransferOfflineGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const coinName  = CachePool.conf("Economy").CoinName;
    const myBalance = Economy.get(pl);
    const { taxTip } = calcTax(0, myBalance);

    const fm = mc.newCustomForm();
    fm.setTitle(CachePool.lang("money.offline.transfer.title"));
    fm.addLabel(
        CachePool.lang("money.offline.transfer.label")
            .replace("${balance}", myBalance)
            .replace("${coin}", coinName)
            .replace("${rate}", taxTip)
    );
    fm.addInput(CachePool.lang("money.offline.transfer.input.target"), CachePool.lang("money.offline.transfer.input.target.hint"), "Steve", CachePool.lang("money.offline.transfer.input.target.tip") || "");
    fm.addInput(CachePool.lang("money.offline.transfer.input.amount"), CachePool.lang("money.offline.transfer.input.amount.hint"), "0", CachePool.lang("money.offline.transfer.input.amount.tip") || "");
    fm.addInput(CachePool.lang("money.offline.transfer.input.note"),   CachePool.lang("money.offline.transfer.input.note.hint"), "无", CachePool.lang("money.offline.transfer.input.note.tip") || "");

    pl.sendForm(fm, (player, data) => {
        if (data == null) return player.runcmd("moneygui");

        const [, rawTarget, rawAmount, note] = data;
        const targetName = (rawTarget || "").trim();

        if (!targetName) return player.tell(info + CachePool.lang("money.offline.transfer.no.target"));
        if (targetName === player.realName) return player.tell(info + CachePool.lang("money.offline.transfer.self"));

        if (mc.getPlayer(targetName)) {
            return player.tell(info + CachePool.lang("money.offline.transfer.target.online"));
        }

        const amountStr = (rawAmount || "").trim().toLowerCase();
        const myBal     = Economy.get(player);
        let   finalAmount;
        if (amountStr === "all") {
            finalAmount = myBal;
        } else if (/^\d+$/.test(amountStr)) {
            finalAmount = parseInt(amountStr, 10);
        } else {
            return player.tell(info + CachePool.lang("key.not.number"));
        }

        if (finalAmount <= 0) return player.tell(info + CachePool.lang("money.must.bigger0"));

        const { tax, taxTip: confirmedTaxTip } = calcTax(finalAmount, myBal);
        const actualReceived = finalAmount - tax;

        if (actualReceived <= 0) return player.tell(info + CachePool.lang("money.transfer.tax.notenough"));
        if (myBal < finalAmount)  return player.tell(info + CachePool.lang("money.no.enough"));

        // ── 确认表单 ──────────────────────────────────────────
        const confirmFm = mc.newSimpleForm();
        confirmFm.setTitle(CachePool.lang("money.offline.transfer.confirm.title"));
        confirmFm.setContent(
            CachePool.lang("money.offline.transfer.confirm.content")
                .replace("${target}",   targetName)
                .replace("${amount}",   finalAmount)
                .replace("${coin}",     coinName)
                .replace("${tax}",      tax)
                .replace("${rate}",     confirmedTaxTip)
                .replace("${received}", actualReceived) +
            (note ? "\n" + CachePool.lang("notify.transfer.note").replace("${note}", note) : "") +
            "\n\n" + CachePool.lang("money.offline.transfer.confirm.warn")
        );
        confirmFm.addButton(CachePool.lang("money.offline.transfer.btn.confirm"), "textures/ui/realms_green_check");
        confirmFm.addButton(CachePool.lang("money.offline.transfer.btn.cancel"),  "textures/ui/cancel");

        player.sendForm(confirmFm, (pl2, btnId) => {
            if (btnId == null || btnId === 1) return pl2.tell(info + CachePool.lang("money.offline.transfer.cancelled"));

            if (Economy.get(pl2) < finalAmount) return pl2.tell(info + CachePool.lang("money.no.enough"));

            Economy.execute(pl2, 'reduce', finalAmount);
            OfflineMoneyCache.add(targetName, 'add', actualReceived);

            const timeStr = system.getTimeStr();
            const noteMsg = note ? CachePool.lang("money.offline.transfer.note.suffix").replace("${note}", note) : "";
            Logger.add(pl2.realName,
                timeStr + " " + CachePool.lang("money.offline.transfer.log")
                    .replace("${target}",   targetName)
                    .replace("${amount}",   finalAmount)
                    .replace("${tax}",      tax)
                    .replace("${received}", actualReceived) + noteMsg
            );

            pl2.sendText(
                EconomyNotify.fmt.transferSend(targetName, finalAmount, tax, actualReceived, coinName, note) +
                "\n§7§o" + CachePool.lang("money.offline.transfer.sender.offline.tip") || ""
            );
            EconomyNotify.send(
                targetName,
                EconomyNotify.fmt.transferReceiveOffline(pl2.realName, actualReceived, tax, coinName, note)
            );
        });
    });
}

// ══════════════════════════════════════════════════════════════
// OPOfflineMoneyGui -对离线玩家执行金币增/减/设置
// ══════════════════════════════════════════════════════════════
function OPOfflineMoneyGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const coinName = economyCfg.coinName;

    const fm = mc.newCustomForm();
    fm.setTitle(CachePool.lang("money.op.offline.title"));
    fm.addLabel(CachePool.lang("money.op.offline.label"));
    fm.addInput(CachePool.lang("money.op.offline.input.target"), CachePool.lang("money.op.offline.input.target.hint"), "Steve", CachePool.lang("money.op.offline.input.target.tip") || "");
    fm.addDropdown(CachePool.lang("money.op.offline.dropdown"), [
        CachePool.lang("money.op.offline.type.add"),
        CachePool.lang("money.op.offline.type.reduce"),
        CachePool.lang("money.op.offline.type.set")
    ]);
    fm.addInput(CachePool.lang("money.op.offline.input.amount"), CachePool.lang("money.op.offline.input.amount.hint"), "0", CachePool.lang("money.op.offline.input.amount.tip") || "");
    fm.addInput(CachePool.lang("money.op.offline.input.note"), CachePool.lang("money.offline.transfer.input.note.hint"), "无", CachePool.lang("money.op.offline.input.note.tip") || "");

    pl.sendForm(fm, (admin, data) => {
        if (data == null) return admin.runcmd("moneygui");

        const [, rawTarget, opIdx, rawAmount, note] = data;
        const targetName = (rawTarget || "").trim();

        if (!targetName) return admin.tell(info + CachePool.lang("money.offline.transfer.no.target"));

        const opTypeMap = ['add', 'reduce', 'set'];
        const opWordMap = [
            CachePool.lang("money.op.offline.type.add"),
            CachePool.lang("money.op.offline.type.reduce"),
            CachePool.lang("money.op.offline.type.set")
        ];
        const opType = opTypeMap[opIdx];
        const opWord = opWordMap[opIdx];
        const amountStr = (rawAmount || "").trim();
        if (!/^\d+$/.test(amountStr)) return admin.tell(info + CachePool.lang("key.not.number"));
        const amount = parseInt(amountStr, 10);
        if (opType !== "set" && amount <= 0) return admin.tell(info + CachePool.lang("money.must.biggerzero"));
        if (opType === "set" && amount < 0) return admin.tell(info + CachePool.lang("money.must.biggerzero"));
        if (mc.getPlayer(targetName)) {
            return admin.tell(info + CachePool.lang("money.op.offline.target.online"));
        }
        // ── 确认表单 ──────────────────────────────────────────
        const confirmFm = mc.newSimpleForm();
        confirmFm.setTitle(CachePool.lang("money.op.offline.confirm.title"));
        confirmFm.setContent(
            CachePool.lang("money.op.offline.confirm.content")
                .replace("${target}", targetName)
                .replace("${opWord}", opWord)
                .replace("${amount}", amount)
                .replace("${coin}",   coinName) +
            (note ? "\n" + CachePool.lang("notify.transfer.note").replace("${note}", note) : "") +
            "\n\n" + CachePool.lang("money.op.offline.confirm.tip") || ""
        );
        confirmFm.addButton(CachePool.lang("money.offline.transfer.btn.confirm"), "textures/ui/realms_green_check");
        confirmFm.addButton(CachePool.lang("money.offline.transfer.btn.cancel"),  "textures/ui/cancel");

        admin.sendForm(confirmFm, (adm, btnId) => {
            if (btnId == null || btnId === 1) return adm.tell(info + CachePool.lang("money.op.offline.cancelled"));

            OfflineMoneyCache.add(targetName, opType, amount);

            const timeStr = system.getTimeStr();
            const noteMsg = note ? CachePool.lang("money.offline.transfer.note.suffix").replace("${note}", note) : "";
            Logger.add(targetName,
                timeStr + " " + CachePool.lang("money.op.offline.log")
                    .replace("${opWord}", opWord)
                    .replace("${amount}", amount)
                    .replace("${coin}",   coinName)
                    .replace("${admin}",  adm.realName) + noteMsg
            );

            EconomyNotify.send(
                targetName,
                EconomyNotify.fmt.adminOp(opType, amount, coinName, adm.realName, note)
            );

            adm.sendText(
                info + CachePool.lang("money.op.offline.success")
                    .replace("${target}", targetName)
                    .replace("${opWord}", opWord)
                    .replace("${amount}", amount)
                    .replace("${coin}",   coinName)
            );
        });
    });
}

// [查询余额]
function MoneyGetGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, CachePool.lang("money.op.look") + CachePool.conf("Economy").CoinName, (target) => {
        displayMoneyInfo(pl, target, false); 
    });
}

// [设置余额]
function MoneySetGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, CachePool.lang("money.op.set") + CachePool.conf("Economy").CoinName, (target) => {
        handleAdminOp(
            pl, target, 'set', 
            "设置", 
            CachePool.lang("money.set.number") + CachePool.conf("Economy").CoinName
        );
    });
}

// [减少余额]
function MoneyReduceGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    // 修复了原代码第一行 const amount = Number(data[1]) 导致的崩溃
    openPlayerSelectionGui(pl, CachePool.lang("money.op.remove") + CachePool.conf("Economy").CoinName, (target) => {
        handleAdminOp(
            pl, target, 'reduce', 
            "减少", 
            CachePool.lang("money.decrease.number") + CachePool.conf("Economy").CoinName
        );
    });
}

// [增加余额]
function MoneyAddGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, CachePool.lang("money.op.add") + CachePool.conf("Economy").CoinName, (target) => {
        handleAdminOp(
            pl, target, 'add', 
            "增加", 
            CachePool.lang("money.add.number") + CachePool.conf("Economy").CoinName
        );
    });
}



if (__YEST_FIRST_LOAD__) {
mc.listen("onRespawn",(pl)=>{
    if(CachePool.conf("Back").EnabledModule && CachePool.conf("Back").tipAfterDeath) {
         setTimeout(() => {
            BackGUI(pl.realName)
            }, 100);
    }
})
}
// 存储玩家死亡点数据
let deathPoints = {};

// 监听玩家死亡事件记录死亡点
if (__YEST_FIRST_LOAD__) {
mc.listen("onPlayerDie", function(pl, src) {
    let playerName = pl.realName;
    
    // 初始化玩家死亡点数组
    if (!deathPoints[playerName]) {
        deathPoints[playerName] = [];
    }
    
    // 修复：使用玩家当前位置作为死亡位置，而不是lastDeathPos
    let deathPos = pl.pos;
    if (!deathPos) return;
    
    // 创建死亡点记录
    let deathRecord = {
        pos: {
            x: deathPos.x,
            y: deathPos.y,
            z: deathPos.z,
            dimid: deathPos.dimid
        },
        time: new Date().toLocaleString(),
        dimension: transdimid[deathPos.dimid] || "未知维度"
    };
    
    // 添加到数组开头（最新的在前面）
    deathPoints[playerName].unshift(deathRecord);
    
    // 只保留最近3个死亡点
    if (deathPoints[playerName].length > 3) {
        deathPoints[playerName] = deathPoints[playerName].slice(0, 3);
    }
    
    pl.tell(info + CachePool.lang("back.helpinfo"));
});
}

if (CachePool.conf("Back")?.EnabledModule) {
let backcmd = mc.newCommand("back", "返回死亡点", PermType.Any)
backcmd.overload([])
backcmd.setCallback((cmd, ori, out, res) => {
    let pl = ori.player
    if (!pl) return out.error(CachePool.lang("warp.only.player"))
    const backCfg = CachePool.conf("Back") || {};

    let cd = Number(backCfg.cooldown) || 0;
    let next = backCooldownMap.get(pl.realName) || 0;
    if (Date.now() < next) {
        let remain = Math.ceil((next - Date.now()) / 1000);
        return pl.tell(info + CachePool.lang("back.cooldown").replace("${time}", remain));
    }
    BackGUI(pl.realName)
})
backcmd.setup()
} // end if (CachePool.conf("Back")?.EnabledModule)

function BackGUI(plname) {
    let pl = mc.getPlayer(plname)
    if (!pl) return
    
    let playerDeathPoints = deathPoints[pl.realName];
    if (!playerDeathPoints || playerDeathPoints.length === 0) {
        return pl.tell(info + CachePool.lang("back.list.Empty"));
    }
    
    // [fix] 一次读取 cost 和 coinName，避免回调内重复读配置
    let cost     = (CachePool.conf("Back") || {}).cost;
    let coinName = economyCfg.coinName;
    let fm = mc.newCustomForm()
    fm.setTitle(CachePool.lang("back.to.point"))
    fm.addLabel(CachePool.lang("back.choose"))
    
    // 显示所有死亡点信息
    playerDeathPoints.forEach((point, index) => {
        let pointInfo = `§e死亡点 ${index + 1}：\n`;
        pointInfo += `§7坐标：${Math.round(point.pos.x)}, ${Math.round(point.pos.y)}, ${Math.round(point.pos.z)}\n`;
        pointInfo += `§7维度：${point.dimension}\n`;
        pointInfo += `§7时间：${point.time}`;
        fm.addLabel(pointInfo);
    });
    
    // 添加下拉选择框
    let options = playerDeathPoints.map((point, index) => 
        `死亡点${index + 1} - ${point.dimension} (${Math.round(point.pos.x)}, ${Math.round(point.pos.y)}, ${Math.round(point.pos.z)})`
    );
    fm.addDropdown("选择要传送的死亡点", options, 0);
    
    fm.addLabel(displayMoneyInfo(pl, pl, true))
    fm.addLabel("传送需要花费" + cost + coinName)
    
    pl.sendForm(fm, (pl, data) => {
        // 修复：检查数据是否有效
        if (data === null || data === undefined) {
            return pl.tell(info + CachePool.lang("gui.exit"));
        }
        
        // 重新获取死亡点数据，确保数据最新
        let currentDeathPoints = deathPoints[pl.realName];
        if (!currentDeathPoints || currentDeathPoints.length === 0) {
            return pl.tell(info + "§c死亡点数据已失效！");
        }
        
        // 计算下拉框在表单数据中的索引位置
        let dropdownIndex = 1 + currentDeathPoints.length;
        let selectedIndex = data[dropdownIndex];
        
        // 修复：检查selectedIndex是否有效
        if (selectedIndex === undefined || selectedIndex === null) {
            return pl.tell(info + CachePool.lang("gui.exit"));
        }
        
        // 修复：确保索引在有效范围内
        if (selectedIndex < 0 || selectedIndex >= currentDeathPoints.length) {
            return pl.tell(info + CachePool.lang("back.choose.null"));
        }
        
        let selectedPoint = currentDeathPoints[selectedIndex];
        
        // 修复：检查选择的死亡点数据是否完整
        if (!selectedPoint || !selectedPoint.pos) {
            return pl.tell(info + CachePool.lang("back.deathlog.error"));
        }

        // 开关 + 冷却二次校验（防止玩家挂着表单跨过冷却窗口）
        const backCfg2 = CachePool.conf("Back") || {};
        if (backCfg2.EnabledModule === false) return pl.tell(info + CachePool.lang("back.disabled"));
        let backCd = Number(backCfg2.cooldown) || 0;
        let backNext = backCooldownMap.get(pl.realName) || 0;
        if (Date.now() < backNext) {
            let remain = Math.ceil((backNext - Date.now()) / 1000);
            return pl.tell(info + CachePool.lang("back.cooldown").replace("${time}", remain));
        }
        
        // 检查金钱
        if (!economyCfg.isLLMoney) {
            if (!smartMoneyCheck(pl.realName, backCfg2.cost)) return pl.tell(info + CachePool.lang("money.no.enough"));
        } else {
            if (!smartMoneyCheck(pl.realName, backCfg2.cost)) return pl.tell(info + CachePool.lang("money.no.enough"));
        }
        
        // 传送到选择的死亡点
        try {
            // 修复：直接使用坐标数字传参，而不是对象
            pl.teleport(
                selectedPoint.pos.x, 
                selectedPoint.pos.y, 
                selectedPoint.pos.z, 
                selectedPoint.pos.dimid
            );
            
            mc.runcmdEx("effect " + pl.realName + " resistance 15 255 true")
            
            // 传送成功才计入冷却
            if (backCd > 0) backCooldownMap.set(pl.realName, Date.now() + backCd * 1000);
            
            pl.tell(info + `§a已传送至死亡点${selectedIndex + 1}！`);
        } catch (e) {
            pl.tell(info + CachePool.lang("back.fail"));
            logger.error("Back System Error: " + e);
        }
    })
}



// 添加一个命令来查看死亡点列表（调试用）
let deathlistcmd = mc.newCommand("deathlog", "查看死亡历史记录", PermType.Any)
deathlistcmd.overload([])
deathlistcmd.setCallback((cmd, ori, out, res) => {
    let pl = ori.player
    if (!pl) return out.error(CachePool.lang("warp.only.player"))
    
    let playerDeathPoints = deathPoints[pl.realName];
    if (!playerDeathPoints || playerDeathPoints.length === 0) {
        return pl.tell(info + CachePool.lang("back.list.Empty"));
    }
    
    pl.tell("§6=== 您的死亡点列表 ===");
    playerDeathPoints.forEach((point, index) => {
        pl.tell(`§e死亡点 ${index + 1}：`);
        pl.tell(`§7坐标：${point.pos.x}, ${point.pos.y}, ${point.pos.z}`);
        pl.tell(`§7维度：${point.dimension}`);
        pl.tell(`§7时间：${point.time}`);
        pl.tell("§7-------------------");
    });
})
deathlistcmd.setup()

// 添加清理死亡点数据的函数
function clearDeathPoints(playerName) {
    if (deathPoints[playerName]) {
        delete deathPoints[playerName];
    }
}

// 获取玩家死亡点列表的函数
function getPlayerDeathPoints(playerName) {
    return deathPoints[playerName] || [];
}


// ======================
// Tpa指令
// ======================
if (CachePool.conf("tpa")?.EnabledModule) {
const tpacmd = mc.newCommand("tpa", "传送系统", PermType.Any);
tpacmd.overload([]);
tpacmd.setCallback((cmd, ori, out, res) => {
    const player = ori.player;
    if (!player) return out.error(CachePool.lang("warp.only.player"));
    showTpaMainMenu(player);
});
tpacmd.setup();
} // end TPA command registration
const pendingTpaRequests = {};

// TPA 主菜单
function showTpaMainMenu(player) {
    const fm = mc.newSimpleForm();
    fm.setTitle(CachePool.lang("tpa.main.title"));
    fm.setContent(CachePool.lang("tpa.main.content"));
    fm.addButton(CachePool.lang("tpa.btn.to"), "textures/items/ender_pearl");
    fm.addButton(CachePool.lang("tpa.btn.here"), "textures/ui/FriendsDiversity");
    fm.addButton(CachePool.lang("tpa.btn.prefs"), "textures/ui/settings_pause_menu_icon");
    player.sendForm(fm, (pl, id) => {
        if (id == null) return;
        if (id === 0) showTpaMenu(pl, "to");
        else if (id === 1) showTpaMenu(pl, "here");
        else if (id === 2) showTpaPrefsMenu(pl);
    });
}

function showTpaMenu(player, fixedDirection) {
    let cost = CachePool.conf("tpa").cost;
    let Scoreboard = economyCfg.scoreboard;
    let onlinePlayers = CachePool.getOnlinePlayers().filter(p => p.name !== player.name);
    if (onlinePlayers.length === 0) {
        player.tell(info + CachePool.lang("tpa.noplayer.online"));
        return;
    }
    let form = mc.newCustomForm();
    form.setTitle(CachePool.lang(fixedDirection === "to" ? "tpa.btn.to" : "tpa.btn.here"));
    let nameList = onlinePlayers.map(p => p.name);
    form.addDropdown(CachePool.lang("tpa.choose.player"), nameList);
    form.addLabel(CachePool.lang("tpa.cost").replace("${cost}", cost).replace("${Scoreboard}", Scoreboard));
    const tpaConfig = CachePool.conf("tpa") || {};
    let isDelayEnabled = tpaConfig.isDelayEnabled !== false;
    let maxD = Number(tpaConfig.maxDelay) || 20;
    
    let hasDelaySlider = false;
    if (isDelayEnabled) {
        form.addSlider((CachePool.lang("tpa.delay.slider") || "§e传送延迟(0~${max}秒)").replace("${max}", maxD), 0, maxD, 1, 0);
        hasDelaySlider = true;
    }
    
    let isOp = player.isOP();
    if (isOp) {
        form.addSwitch(CachePool.lang("tpa.op.msg"), false);
    }
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            pl.tell(info + CachePool.lang("tpa.exit"));
            return;
        }
        let idx = 0;
        let targetIndex = data[idx++];
        idx++; // 跳过标签
        
        let delaySec = 0;
        if (hasDelaySlider) delaySec = data[idx++];
        
        let manage = false;
        if (isOp) manage = data[idx++];
        
        if (manage === true) {
            showTpaManageForm(pl);
            return;
        }
        
        let targetName = nameList[targetIndex];
        sendTpaRequest(pl, targetName, fixedDirection, Math.floor(delaySec));
    });
}

// 玩家个人 TPA 偏好设置
// "个人偏好设置" 二级菜单：基础设置 / 传送黑名单
function showTpaPrefsMenu(player) {
    const fm = mc.newSimpleForm();
    fm.setTitle(CachePool.lang("tpa.prefs.title"));
    fm.setContent(CachePool.lang("tpa.prefs.menu.content"));
    fm.addButton(CachePool.lang("tpa.prefs.menu.btn.basic"), "textures/ui/settings_glyph_color_2x");
    fm.addButton(CachePool.lang("tpa.btn.blacklist"), "textures/blocks/barrier");
    fm.addButton(CachePool.lang("tpa.btn.back"), "textures/ui/back_button_default");

    player.sendForm(fm, (pl, id) => {
        if (id == null) return;
        if (id === 0) showTpaPrefsGui(pl);
        else if (id === 1) showTpaBlacklistMenu(pl);
        else if (id === 2) showTpaMainMenu(pl);
    });
}

function showTpaPrefsGui(player) {
    const prefs = tpacfg.get(player.realName) || {};
    const tpaConfig = CachePool.conf("tpa") || {};
    
    const fm = mc.newCustomForm();
    fm.setTitle(CachePool.lang("tpa.prefs.basic.title"));
    fm.addLabel(CachePool.lang("tpa.prefs.label"));
    fm.addSwitch(CachePool.lang("tpa.prefs.switch"), prefs.acceptTpaRequests !== false);
    fm.addDropdown(CachePool.lang("tpa.prefs.prompt"), [CachePool.lang("tpa.prefs.prompt.form"), CachePool.lang("tpa.prefs.prompt.text")],
        (prefs.promptType === "text" ? 1 : 0));
    fm.addInput("tpa请求有效时间/秒", "秒", String(prefs.requestTimeout || tpaConfig.requestTimeout || 60), CachePool.lang("tpa.timeout.tip") || "");
    
    player.sendForm(fm, (pl, data) => {
        if (!data) {
            showTpaPrefsMenu(pl);
            return;
        }
        const [, acceptSwitch, promptIdx, timeoutStr] = data;
        const timeout = parseInt(timeoutStr);
        const newPrefs = {
            ...prefs,
            acceptTpaRequests: acceptSwitch,
            promptType: promptIdx === 0 ? "form" : "text",
            requestTimeout: isNaN(timeout) || timeout <= 0 ? (tpaConfig.requestTimeout || 60) : timeout
        };
        tpacfg.set(pl.realName, newPrefs);
        pl.tell(info + CachePool.lang("tpa.save.conf.ok"));
        showTpaPrefsMenu(pl);
    });
}

// 玩家个人 TPA 传送黑名单管理
function showTpaBlacklistMenu(player) {
    const prefs = tpacfg.get(player.realName) || {};
    const blacklist = Array.isArray(prefs.blacklist) ? prefs.blacklist : [];

    const fm = mc.newSimpleForm();
    fm.setTitle(CachePool.lang("tpa.blacklist.title"));
    fm.setContent(CachePool.lang("tpa.blacklist.content") +
        (blacklist.length === 0 ? "\n" + CachePool.lang("tpa.blacklist.empty") : ""));

    blacklist.forEach(name => fm.addButton(`§c${name}`, "textures/blocks/barrier"));
    fm.addButton(CachePool.lang("tpa.blacklist.btn.add"), "textures/ui/Add-Ons_Nav_Icon36x36");
    fm.addButton(CachePool.lang("tpa.btn.back"), "textures/ui/back_button_default");

    player.sendForm(fm, (pl, id) => {
        if (id == null) {
            showTpaPrefsMenu(pl);
            return;
        }
        if (id === blacklist.length + 1) {
            showTpaPrefsMenu(pl);
            return;
        }
        if (id === blacklist.length) {
            // 倒数第二个按钮固定为"添加玩家"
            showTpaBlacklistAddForm(pl);
            return;
        }
        // 点击某个已在黑名单中的玩家 -> 移出黑名单
        const removedName = blacklist[id];
        const curPrefs = tpacfg.get(pl.realName) || {};
        const curBlacklist = Array.isArray(curPrefs.blacklist) ? curPrefs.blacklist : [];
        const newBlacklist = curBlacklist.filter(n => n !== removedName);
        tpacfg.set(pl.realName, { ...curPrefs, blacklist: newBlacklist });
        pl.tell(info + CachePool.lang("tpa.blacklist.remove.ok").replace("${player}", removedName));
        showTpaBlacklistMenu(pl);
    });
}

function showTpaBlacklistAddForm(player) {
    const prefs = tpacfg.get(player.realName) || {};
    const blacklist = Array.isArray(prefs.blacklist) ? prefs.blacklist : [];
    const onlinePlayers = CachePool.getOnlinePlayers().filter(p => p.name !== player.name);
    const nameList = [CachePool.lang("tpa.blacklist.add.dropdown.none"), ...onlinePlayers.map(p => p.name)];

    const form = mc.newCustomForm();
    form.setTitle(CachePool.lang("tpa.blacklist.add.title"));
    form.addDropdown(CachePool.lang("tpa.blacklist.add.dropdown"), nameList, 0);
    form.addInput(CachePool.lang("tpa.blacklist.add.input"), "", "", CachePool.lang("tpa.blacklist.add.input.tip"));

    player.sendForm(form, (pl, data) => {
        if (!data) {
            showTpaBlacklistMenu(pl);
            return;
        }
        const [dropdownIdx, manualInput] = data;
        let targetName = (manualInput || "").trim();
        if (!targetName && dropdownIdx > 0) targetName = nameList[dropdownIdx];

        if (!targetName) {
            pl.tell(info + CachePool.lang("tpa.blacklist.add.empty"));
            showTpaBlacklistMenu(pl);
            return;
        }
        if (targetName === pl.realName || targetName === pl.name) {
            pl.tell(info + CachePool.lang("tpa.blacklist.add.self"));
            showTpaBlacklistMenu(pl);
            return;
        }

        const curPrefs = tpacfg.get(pl.realName) || {};
        const curBlacklist = Array.isArray(curPrefs.blacklist) ? curPrefs.blacklist : [];
        if (curBlacklist.includes(targetName)) {
            pl.tell(info + CachePool.lang("tpa.blacklist.add.exist"));
            showTpaBlacklistMenu(pl);
            return;
        }

        tpacfg.set(pl.realName, { ...curPrefs, blacklist: [...curBlacklist, targetName] });
        pl.tell(info + CachePool.lang("tpa.blacklist.add.ok").replace("${player}", targetName));
        showTpaBlacklistMenu(pl);
    });
}

function showTpaManageForm(player) {
    // 修复：从配置文件获取 tpa 配置节
    const tpaConfig = CachePool.conf("tpa") || {}; // <-- 添加这行
    let form = mc.newCustomForm();
    form.setTitle(CachePool.lang("tpa.op.menu"));
    form.addInput(CachePool.lang("tpa.send.time"),CachePool.lang("number"), "" + tpaConfig.requestTimeout, CachePool.lang("tpa.send.time.tip") || "");
    form.addDropdown(CachePool.lang("tpa.send.way"), [CachePool.lang("tpa.send.form"), CachePool.lang("tpa.send.bossbar")], (tpaConfig.promptType === "bossbar" ? 1 : 0));
    let isDelayOn = (tpaConfig.isDelayEnabled !== false);
    form.addSwitch(CachePool.lang("tpa.Enabled.lag"), isDelayOn);
    form.addInput(CachePool.lang("tpa.max.lagnumber"), CachePool.lang("number"), "" + (tpaConfig.maxDelay || 20), CachePool.lang("tpa.max.lagnumber.tip") || "");
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            pl.tell(CachePool.lang("tpa.exit"));
            return;
        }
        
        let newTimeout = parseInt(data[0]);
        let promptIndex = data[1];
        let enableDelay = data[2];
        let newMaxDelay = parseInt(data[3]);
        
        if (isNaN(newTimeout) || newTimeout <= 0) {
            pl.tell(info +CachePool.lang("tpa.input.must.number"));
            return;
        }
        
        if (isNaN(newMaxDelay) || newMaxDelay < 0) {
            pl.tell(info +CachePool.lang("tpa.must.biggerzero"));
            return;
        }
        
        let newPromptType = (promptIndex === 0 ? "form" : "bossbar");
        const updatedTpaConfig = {
            ...tpaConfig,
            requestTimeout: newTimeout,
            promptType: newPromptType,
            isDelayEnabled: enableDelay,
            maxDelay: newMaxDelay
        };
        CachePool.setConf("tpa", updatedTpaConfig); // 这行会自动保存
        
        pl.tell(info +CachePool.lang("tpa.save.conf.ok"));
    });
}

function sendTpaRequest(fromPlayer, toPlayerName, direction, delaySec) {
    // 确保 delaySec 是数字，如果不是则设为默认值 0
    if (isNaN(delaySec) || delaySec === undefined) {
        delaySec = 0;
    }
    
    let toPlayer = mc.getPlayer(toPlayerName);
    if (!toPlayer) {
        fromPlayer.tell(info + CachePool.lang("tpa.send.fail"));
        return;
    }
    // 检查目标玩家是否接受传送请求
    const toPlayerPrefs = tpacfg.get(toPlayerName) || {};
    if (toPlayerPrefs.acceptTpaRequests === false) {
        fromPlayer.tell(info + CachePool.lang("tpa.send.noway"));
        return;
    }
    // 检查目标玩家是否将发起者加入了传送黑名单
    const toPlayerBlacklist = Array.isArray(toPlayerPrefs.blacklist) ? toPlayerPrefs.blacklist : [];
    if (toPlayerBlacklist.includes(fromPlayer.realName) || toPlayerBlacklist.includes(fromPlayer.name)) {
        fromPlayer.tell(info + CachePool.lang("tpa.send.blocked"));
        return;
    }
    
    let uid = Math.floor(Math.random() * 1e8);
    let req = {
        from: fromPlayer,
        to: toPlayer,
        fromName: fromPlayer.name,
        toName: toPlayerName,
        direction: direction,
        delay: delaySec,
        bossbarId: uid,
        startTime: Date.now()
    };
    pendingTpaRequests[toPlayerName] = req;
    const tpaConfig = CachePool.conf("tpa") || {};
    const toPrefs = tpacfg.get(toPlayerName) || {};
    // 优先用目标玩家的个人偏好，没设置则用全局config
    let pType = toPrefs.promptType || tpaConfig.promptType || "form";
    let timeoutSec = toPrefs.requestTimeout || tpaConfig.requestTimeout || 60;
    toPlayer.tell(`${info}§e收到传送请求(${req.fromName}想${direction === "to" ? CachePool.lang("tpa.to.here"):CachePool.lang("tpa.to.he.she")})\n` +
                 (delaySec > 0 ? (CachePool.lang("tpa.delay.set") || "§6并设置了延迟: ${delay}秒").replace("${delay}", delaySec) + "\n" : "") +
                 `${CachePool.lang("tpa.a.and.d")}\n` +
                 (CachePool.lang("tpa.request.wait") || "§c请求最多等待${timeout}秒").replace("${timeout}", timeoutSec));
 //1816   
    fromPlayer.tell(info + (CachePool.lang("tpa.sent.request") || "§a已向 ${player} 发送请求(延迟=${delay}秒), 等待对方同意(最多${timeout}秒)").replace("${player}", toPlayerName).replace("${delay}", delaySec).replace("${timeout}", timeoutSec));
    
    if (pType === "form") {
        showTpaConfirmForm(req, timeoutSec);
    } else {
        showTpaBossbarPrompt(req, timeoutSec);
    }
}

function showTpaConfirmForm(req, timeoutSec) {
    let toPlayer = req.to;
    let fromName = req.fromName;
    let dirText = (req.direction === "to" ? CachePool.lang("tpa.to.here"): CachePool.lang("tpa.to.here"));
    let delayStr = (req.delay > 0 ? (CachePool.lang("tpa.delay.info") || "(延迟${delay}秒)").replace("${delay}", req.delay) + "\n" : "");
    
    let form = mc.newSimpleForm();
    form.setTitle(CachePool.lang("tpa.request"));
    form.setContent(`${info}§b[${fromName}] 请求${dirText}\n` +
                   `${delayStr}` +
                   `${CachePool.lang("tpa.a.and.d")}n` +
                   `§e剩余时间: ${timeoutSec}s`);
    form.addButton(CachePool.lang("tpa.a"));
    form.addButton(CachePool.lang("tpa.d"));
    
    toPlayer.sendForm(form, (pl, id) => {
        if (id == null) return; 
        if (id === 0) acceptTpaRequest(pl.name);
        else denyTpaRequest(pl.name);
    });
    
    startTpaRequestCountdown(req, timeoutSec, false);
}

function showTpaBossbarPrompt(req, timeoutSec) {
    let toPlayer = req.to;
    let fromName = req.fromName;
    let dirText = (req.direction === "to" ? CachePool.lang("tpa.to.here"): CachePool.lang("tpa.to.he.she"));
    let delayStr = (req.delay > 0 ? (CachePool.lang("tpa.delay.info") || "(延迟${delay}秒)").replace("${delay}", req.delay) : "");
    let barId = req.bossbarId;
    
    toPlayer.setBossBar(barId,
        (CachePool.lang("tpa.bossbar.text") || "§a${from}请求${dir}§f${delay}\n§c(/tpayes同意 /tpano拒绝)")
            .replace("${from}", fromName).replace("${dir}", dirText).replace("${delay}", delayStr),
        100, 3
    );
    
    startTpaRequestCountdown(req, timeoutSec, true);
}

function startTpaRequestCountdown(req, timeoutSec, bossbarMode) {
    let remain = timeoutSec;
    // ✅ 提前捕获名字字符串，玩家下线后对象失效但字符串仍可用
    let toName   = req.to.name;
    let fromName = req.from.name;
    let barId    = req.bossbarId;

    let timerId = setInterval(() => {
        try {
            remain--;

            // 用字符串查玩家，避免持有失效对象导致 "Wrong type of argument"
            const toPlayer   = mc.getPlayer(toName);
            const fromPlayer = mc.getPlayer(fromName);

            if (!toPlayer || !fromPlayer) {
                clearInterval(timerId);
                cancelTpaRequest(toName, CachePool.lang("tpa.player.offline"));
                return;
            }

            if (bossbarMode) {
                let percent = Math.floor((remain / timeoutSec) * 100);
                let dirText = (req.direction === "to" ? CachePool.lang("tpa.to.here") : CachePool.lang("tpa.to.he.she"));
                let delayStr = (req.delay > 0 ? `(延迟${req.delay}秒)` : "");
                toPlayer.setBossBar(barId,
                    (CachePool.lang("tpa.bossbar.countdown") || "§a${from}请求${dir}§f${delay}(/tpayes同意 /tpano拒绝),剩余${remain}s")
                        .replace("${from}", fromName).replace("${dir}", dirText).replace("${delay}", delayStr).replace("${remain}", remain),
                    percent, 3
                );
            }

            if (remain <= 0) {
                clearInterval(timerId);
                cancelTpaRequest(toName, info + CachePool.lang("tpa.request.timeout"));
            }
        } catch (e) {
            // 任何异常都清掉 interval，防止死循环刷错误
            clearInterval(timerId);
            logger.warn(`[TPA] 倒计时异常已清理 (${fromName} → ${toName}): ${e}`);
        }
    }, 1000);

    req.timer = timerId;
}

if (CachePool.conf("tpa")?.EnabledModule) {
const tpayescmd = mc.newCommand("tpayes", "同意传送请求", PermType.Any);
tpayescmd.overload([]);
tpayescmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return out.error(CachePool.lang("warp.only.player"));
    acceptTpaRequest(pl.name);
});
tpayescmd.setup();

const tpanocmd = mc.newCommand("tpano", "拒绝传送请求", PermType.Any);
tpanocmd.overload([]);
tpanocmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return out.error(CachePool.lang("warp.only.player"));
    denyTpaRequest(pl.name);
});
tpanocmd.setup();
} // end if (CachePool.conf("tpa")?.EnabledModule) — tpayes/tpano
// v2.10.5: /crash 命令已迁移至 modules/Crash.js

function acceptTpaRequest(targetName) {
    let cost = CachePool.conf("tpa").cost;
    let req = pendingTpaRequests[targetName];
    if (!req) {
        let p = mc.getPlayer(targetName);
        if (p) p.tell(info +CachePool.lang("tpa.no.request"));
        return;
    }
    
    clearTpaRequest(req);
    
    let from = req.from, to = req.to;
    let delay = req.delay;
    let dir = req.direction;
    
    to.tell(info +CachePool.lang("tpa.accpet.request"));
    from.tell(info + (delay > 0
        ? (CachePool.lang("tpa.accept.delay") || "§a对方已同意请求，将在${delay}秒后传送...").replace("${delay}", delay)
        : CachePool.lang("tpa.accept.now")));
        if (cost >= 1) {
        if (!EconomyManager.checkAndReduce(from.realName, cost)) {
            showInsufficientMoneyGui(from, cost);
            return false;
        }
        from.sendText(info + `§e传送花费 ${cost}${CachePool.conf("Economy").CoinName}`);
    }
    if (delay > 0) {
        let secondBarId = Math.floor(Math.random() * 1e9);
        let remain = delay;
        
    let fromName2 = from.name;
    let toName2   = to.name;

        let secondTid = setInterval(() => {
            try {
                remain--;

                const fromPlayer2 = mc.getPlayer(fromName2);
                const toPlayer2   = mc.getPlayer(toName2);

                if (!fromPlayer2 || !toPlayer2) {
                    clearInterval(secondTid);
                    try { from.removeBossBar(secondBarId); } catch(_) {}
                    try { to.removeBossBar(secondBarId); } catch(_) {}
                    try { from.tell(info + CachePool.lang("tpa.request.cut")); } catch(_) {}
                    return;
                }

                let percent = Math.floor((remain / delay) * 100);
                const countdownText = (CachePool.lang("tpa.countdown.bar") || "§d传送倒计时: ${remain}s").replace("${remain}", remain);
                fromPlayer2.setBossBar(secondBarId, countdownText, percent, 1);
                toPlayer2.setBossBar(secondBarId, countdownText, percent, 1);

                if (remain <= 0) {
                    clearInterval(secondTid);
                    fromPlayer2.removeBossBar(secondBarId);
                    toPlayer2.removeBossBar(secondBarId);
                
                if (dir === "to") {
                    let targetPlayer = mc.getPlayer(to.name);
                    if (!targetPlayer) {
                        fromPlayer2.tell(info + CachePool.lang("tpa.tp.fail.noonline"));
                        return;
                    }
                    let footPos = new FloatPos(
                        targetPlayer.pos.x,
                        targetPlayer.pos.y - 1.62,
                        targetPlayer.pos.z,
                        targetPlayer.pos.dimid
                    );
                    fromPlayer2.teleport(footPos);
                } else {
                    let targetPlayer = mc.getPlayer(fromName2);
                    if (!targetPlayer) {
                        toPlayer2.tell(info + CachePool.lang("tpa.tp.fail.noonline"));
                        return;
                    }
                    let footPos = new FloatPos(
                        targetPlayer.pos.x,
                        targetPlayer.pos.y - 1.62,
                        targetPlayer.pos.z,
                        targetPlayer.pos.dimid
                    );
                    toPlayer2.teleport(footPos);
                }
                fromPlayer2.tell(info + CachePool.lang("tpa.tp.okey"));
                toPlayer2.tell(info + CachePool.lang("tpa.tp.okey"));
            }
        } catch (e) {
            clearInterval(secondTid);
            logger.warn(`[TPA] 延迟传送异常已清理 (${fromName2} → ${toName2}): ${e}`);
        }
        }, 1000);
    } else {
        if (!mc.getPlayer(from.name) || !mc.getPlayer(to.name)) {
            from.tell(info +CachePool.lang("tpa.tp.fail.noonline"));
            return;
        }
        
        if (dir === "to") {
            let targetPlayer = mc.getPlayer(to.name);
            if (!targetPlayer) {
                from.tell(info +CachePool.lang("tpa.player.offline"));
                return;
            }
            let footPos = new FloatPos(
                targetPlayer.pos.x,
                targetPlayer.pos.y - 1.62, 
                targetPlayer.pos.z,
                targetPlayer.pos.dimid
            );
            setTimeout(() => {
            from.teleport(footPos);
            },500)
            mc.runcmdEx(`camera ${from.realName} fade time 0.15 0.5 0.35 color 0 0 0`);
        } else {
            let targetPlayer = mc.getPlayer(from.name);
            if (!targetPlayer) {
                to.tell(info +CachePool.lang("tpa.tp.fail.noonline"));
                return;
            }
            let footPos = new FloatPos(
                targetPlayer.pos.x,
                targetPlayer.pos.y - 1.62, 
                targetPlayer.pos.z,
                targetPlayer.pos.dimid
            );
            setTimeout(() => {
            to.teleport(footPos);
            },500)
            mc.runcmdEx(`camera ${to.realName} fade time 0.15 0.5 0.35 color 0 0 0`);
        }
        from.tell(info +CachePool.lang("tpa.tp.okey"));
        to.tell(info +CachePool.lang("tpa.tp.okey"));
    }
    
    delete pendingTpaRequests[targetName];
}

function denyTpaRequest(targetName) {
    let req = pendingTpaRequests[targetName];
    if (!req) {
        let p = mc.getPlayer(targetName);
        if (p) p.tell(info +CachePool.lang("tpa.no.request"));
        return;
    }
    
    clearTpaRequest(req);
    req.from.tell(info +CachePool.lang("tpa.d.request"));
    req.to.tell(info +CachePool.lang("tpa.d.request.you"));
    delete pendingTpaRequests[targetName];
}

function cancelTpaRequest(targetName, msg) {
    let req = pendingTpaRequests[targetName];
    if (!req) return;
    
    clearTpaRequest(req);
    req.from.tell(msg);
    delete pendingTpaRequests[targetName];
}

function clearTpaRequest(req) {
    if (req.timer) {
        clearInterval(req.timer);
    }
    
    let to = req.to;
    if (to && mc.getPlayer(to.name)) {
        to.removeBossBar(req.bossbarId);
    }
}

if (__YEST_FIRST_LOAD__) {
mc.listen("onLeft", (pl) => {
    CachePool.invalidatePlayerList();
    let pname = pl.name;
    
    for (let [key, request] of Object.entries(pendingTpaRequests)) {
        if (!request || !request.from || !request.to) continue;
        
        if (request.toName === pname) {
            clearTpaRequest(request);
            request.from.tell(info +CachePool.lang("tpa.player.offline"));
            delete pendingTpaRequests[key];
        } else if (request.fromName === pname) {
            let rec = request.to;
            if (rec) rec.tell(info +CachePool.lang("tpa.player.offline"));
            clearTpaRequest(request);
            delete pendingTpaRequests[key];
        }
    }
});
}
// RTP已独立为模块
if (CachePool.conf("RTP")?.EnabledModule) {
const rtpResetCmd = mc.newCommand("rtpreset", "重置传送冷却", PermType.GameMasters);
rtpResetCmd.overload([]);
rtpResetCmd.mandatory("player", ParamType.Player);
rtpResetCmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    RadomTeleportSystem.cooltime.set(pl.realName, 0);
    out.success(`已重置 ${pl.realName} 的传送冷却`);
});
rtpResetCmd.setup();
const asyncRtpCmd = mc.newCommand("rtp", "异步随机传送", PermType.Any);
asyncRtpCmd.overload([]);
asyncRtpCmd.setCallback(async (cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return out.error(CachePool.lang("warp.only.player"));
    try {
        await RadomTeleportSystem.performRTPAsync(pl);
    } catch (error) {
        logger.error(`RTP命令执行失败: ${error.message}`);
        pl.tell(info + "§c传送失败，请稍后重试");
    }
});
asyncRtpCmd.setup();
}
//经济检查模块
function smartMoneyCheck(plname, value) {
    const pl = mc.getPlayer(plname);
    if (!pl) return false;
    const isLLMoney = economyCfg.isLLMoney;
    const scoreboard = economyCfg.scoreboard;
    let balance = isLLMoney ? pl.getMoney() : pl.getScore(scoreboard);
    if (balance === null || balance === undefined) {
        if (isLLMoney) pl.setMoney(0);
        else pl.setScore(scoreboard, 0);
        balance = 0;
    }
    if (balance < value) return false;
    return isLLMoney ? pl.reduceMoney(value) : pl.reduceScore(scoreboard, value);
}
// ======================
// 红包系统已迁移至 modules/Redpacket.js
// ======================
function showInsufficientMoneyGui(pl, cost, returnCmd) {
    let fm = mc.newSimpleForm();
    fm.setTitle(CachePool.lang("gui.insufficient.money.title"));
    fm.setContent(CachePool.lang("gui.insufficient.money.content")
        .replace("${cost}", cost)
        .replace("${coin}", CachePool.conf("Economy").CoinName));
    fm.addButton(CachePool.lang("gui.button.confirm"));
    if (returnCmd) {
        fm.addButton(CachePool.lang("gui.button.back"));
    }
    pl.sendForm(fm, (p, id) => {
        if (id === 1 && returnCmd) {
            p.runcmd(returnCmd);
        }
    });
}
// 标记 listener 已注册
globalThis.__YEST_listeners_registered__ = true;

