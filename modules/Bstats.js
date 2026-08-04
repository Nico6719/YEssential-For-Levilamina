/**
 * LeviLamina_LSE_YEssential - bStats 遥测模块
 */

const BSTATS_UUID_PATH = "./plugins/YEssential/data/Bstats/uuid.json";
const BSTATS_MAX_RETRY = 2;

// ─── UUID 工具 ────────────────────────────────────────────────────

function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function loadOrCreateUUID() {
    try {
        if (File.exists(BSTATS_UUID_PATH)) {
            const raw = File.readFrom(BSTATS_UUID_PATH);
            if (raw) {
                const obj = JSON.parse(raw);
                if (obj && typeof obj.uuid === "string" && obj.uuid.length === 36) {
                    return obj.uuid;
                }
            }
        }
    } catch (e) {
        logger.error("读取 UUID 文件失败: " + e.message);
    }

    const newUUID = generateUUID();
    try {
        File.writeTo(BSTATS_UUID_PATH, JSON.stringify({ uuid: newUUID }, null, 2));
        randomGradientLog("首次生成 UUID 并写入: " + BSTATS_UUID_PATH);
    } catch (e) {
        logger.error("写入 UUID 文件失败: " + e.message);
    }
    return newUUID;
}

// ─── 带重试的 HTTP 上报 ───────────────────────────────────────────

function postWithRetry(url, body, retryLeft, debugMode) {
    const attemptNo = BSTATS_MAX_RETRY - retryLeft + 1;
    try {
        network.httpPost(url, body, "application/json", function (status, result) {
            if (status === 200) {
                if (debugMode)
                {
                randomGradientLog("遥测数据上报成功 ");
                }
                return;
            }
            if (retryLeft > 1) {
                logger.warn(
                    "上报失败(第 " + attemptNo + " 次 / 状态码: " + status + ")," +
                    "10 秒后发起第 " + (attemptNo + 1) + " 次重试..."
                );
                setTimeout(function () { postWithRetry(url, body, retryLeft - 1, debugMode); }, 10000);
            } else {
                logger.warn(
                    "上报失败(第 " + attemptNo + " 次 / 状态码: " + status + ")," +
                    "已达最大重试次数 (" + BSTATS_MAX_RETRY + ")，本轮放弃。" 
                );
            }
        });
    } catch (e) {
        if (retryLeft > 1) {
            logger.warn(
                "网络请求异常(第 " + attemptNo + " 次: " + e.message + ")," +
                "10 秒后发起第 " + (attemptNo + 1) + " 次重试..."
            );
            setTimeout(function () { postWithRetry(url, body, retryLeft - 1, debugMode); }, 10000);
        } else {
            logger.warn(
                "网络请求异常(第 " + attemptNo + " 次: " + e.message + ")," +
                "已达最大重试次数 (" + BSTATS_MAX_RETRY + ")，本轮放弃。"
            );
        }
    }
}                                                                                                                                                                                                               

// ─── 主类 ─────────────────────────────────────────────────────────

class BStatsImpl {
    constructor(pluginId) {
        this.pluginId      = pluginId;
        this.enabled       = true;
        this.debugMode     = true;
        this.pluginName    = "YEssential";
        this.pluginVersion = this.readManifestVersion();

        this.cachedCoreCount = "Unknown";
        this.cachedOsName    = "Unknown";
        this.cachedOsArch    = "Unknown";
        this.cachedOsVersion = "Unknown";

        this.platform = "bukkit";
        this.baseUrl  = "https://bstats.org/api/v2/data/" + this.platform;

        // UUID 从独立文件读，不再依赖 conf
        this.serverUUID = loadOrCreateUUID();

        this.syncConfig();
        this.probeSystemInfo();
    }

    readManifestVersion() {
        const path = "./plugins/YEssential/manifest.json";
        try {
            if (File.exists(path)) {
                const content = File.readFrom(path);
                if (content) {
                    const json = JSON.parse(content);
                    const ver  = json.version || json.version_name;
                    if (ver) return Array.isArray(ver) ? ver.join(".") : String(ver);
                }
            }
        } catch (e) {
            logger.error("读取 manifest.json 失败: " + e.message);
        }
        return "2.12.13";
    }

    // 将 Economy.PayTaxRate（数字 或 阶梯数组）转换为 Disabled/Enabled 两种分类
    // 避免直接 toString() 阶梯数组导致 "[object Object]" 的问题
    describePayTaxRate(rate) {
        if (rate == null) return "Disabled";
        if (typeof rate === "number") {
            return rate > 0 ? "Enabled" : "Disabled";
        }
        if (Array.isArray(rate)) {
            // 只要存在任意一档税率 >0，即视为启用
            const hasPositiveRate = rate.some(tier => tier && typeof tier.rate === "number" && tier.rate > 0);
            return hasPositiveRate ? "Enabled" : "Disabled";
        }
        return "Disabled";
    }

    // 将 Home.MaxHome（家数量上限）归并为有限区间分类，避免原始数值导致饼图碎片化
    bucketHomeMax(max) {
        if (max == null || typeof max !== "number" || isNaN(max)) return "Default(10)";
        if (max <= 0)   return "Disabled(0)";
        if (max <= 5)   return "Low(1-5)";
        if (max <= 10)  return "Mid(6-10)";
        if (max <= 20)  return "High(11-20)";
        return "VeryHigh(20+)";
    }

    // 通用 cost 分桶：None / 10<cost<25 / 25<cost<50 / 50++
    bucketCost(cost) {
        if (cost == null || typeof cost !== "number" || isNaN(cost) || cost <= 0) return "None";
        if (cost < 10)  return "1-10";
        if (cost < 25)  return "10-25";
        if (cost < 50)  return "25-50";
        return "50++";
    }

    readServerProperties() {
        const path = "./server.properties";
        try {
            if (File.exists(path)) {
                const content = File.readFrom(path);
                const match   = content.match(/^online-mode\s*=\s*(true|false)/m);
                if (match) {
                    if (this.debugMode)
                        randomGradientLog("online-mode = " + match[1]);
                    return match[1] === "true" ? 1 : 0;
                }
            }
        } catch (e) {
            if (this.debugMode)
                logger.error("读取 server.properties 失败: " + e.message);
        }
        return 1;
    }

    // 只同步开关，UUID 不再从 conf 读写
    syncConfig() {
        try {
            if (typeof CachePool !== "undefined") {
                const bstatsConf = CachePool.conf("Bstats") || {};
                this.enabled     = bstatsConf.EnableModule != null ? bstatsConf.EnableModule : true;
                this.debugMode   = bstatsConf.logSentData  != null ? bstatsConf.logSentData  : true;
            }
        } catch (e) {
            logger.error("同步配置失败: " + e.message);
        }
    }

    probeSystemInfo() {
        const self = this;
        const set = function (cmd, prop) {
            try {
                system.cmd(cmd, function (exit, out) {
                    if (exit === 0 && out) self[prop] = out.trim();
                });
            } catch (e) {}
        };

        // Linux
        set("nproc",    "cachedCoreCount");
        set("uname -s", "cachedOsName");
        set("uname -m", "cachedOsArch");
        set("uname -r", "cachedOsVersion");

        // Windows 兜底
        set("echo %NUMBER_OF_PROCESSORS%",                             "cachedCoreCount");
        set("echo %OS%",                                               "cachedOsName");
        set("echo %PROCESSOR_ARCHITECTURE%",                           "cachedOsArch");
    }

    collectData() {
        this.syncConfig();

        let playerCount = 0;
        try { playerCount = mc.getOnlinePlayers().length; } catch (e) {}

        let moduleCount = 0;
        try {
            const mlPath = "./plugins/YEssential/modules/modulelist.json";
            if (File.exists(mlPath)) {
                const raw  = File.readFrom(mlPath);
                const json = raw ? JSON.parse(raw) : null;
                if (json && json.modules) moduleCount = json.modules.length;
            }
        } catch (e) {}

        const lseVerRaw  = (typeof ll !== "undefined") ? ll.versionString() : "Unknown";
        const pureLseVer = lseVerRaw.replace("LSE-QuickJS ", "").split(" ")[0];

        let mcVer = (typeof mc !== "undefined") ? mc.getBDSVersion() : "1.21.0";
        if (mcVer.startsWith("v")) mcVer = mcVer.substring(1);

        const finalOsName    = this.cachedOsName    !== "Unknown" ? this.cachedOsName    : "Windows";
        const finalOsArch    = this.cachedOsArch    !== "Unknown" ? this.cachedOsArch    : "x86_64";
        const finalCoreCount = this.cachedCoreCount !== "Unknown" ? this.cachedCoreCount : "8";
        const finalOsVersion = this.cachedOsVersion !== "Unknown" ? this.cachedOsVersion : "10.0";

        const econConf = (typeof CachePool !== "undefined") ? CachePool.conf("Economy") : null;
        const rtpConf  = (typeof CachePool !== "undefined") ? CachePool.conf("RTP")     : null;
        const homeConf = (typeof CachePool !== "undefined") ? CachePool.conf("Home")    : null;
        const tpaConf  = (typeof CachePool !== "undefined") ? CachePool.conf("tpa")     : null;

        // Update 配置已迁移至独立的 Updateconfig.json，优先从 globalThis.updateConf 读取
        const _updSrc  = (typeof globalThis.updateConf !== "undefined") ? globalThis.updateConf : conf;
        const updConf  = (_updSrc !== undefined && _updSrc !== null) ? _updSrc.get("Update") : null;

        return {
            serverUUID:     this.serverUUID,
            metricsVersion: "2",
            playerAmount:   playerCount,
            onlineMode:     this.readServerProperties(),
            bukkitVersion:  mcVer,
            javaVersion:    "N/A (Bedrock)",
            osName:         finalOsName,
            osArch:         finalOsArch,
            osVersion:      finalOsVersion,
            coreCount:      parseInt(finalCoreCount) || 8,
            service: {
                id:            this.pluginId,
                pluginVersion: this.pluginVersion,
                customCharts: [
                    { chartId: "lse_version",             type: "simple_pie", data: { value: pureLseVer } },
                    { chartId: "economy_type",            type: "simple_pie", data: { value: (econConf && String(econConf.mode).toLowerCase() === "llmoney") ? "LLMoney" : "Scoreboard" } },
                    { chartId: "installed_modules_count", type: "simple_pie", data: { value: moduleCount.toString() } },
                    { chartId: "AutoUpdate",              type: "simple_pie", data: { value: (updConf && updConf.EnableModule) ? "Enabled" : "Disabled" } },
                    { chartId: "playerpaytaxrate",        type: "simple_pie", data: { value: this.describePayTaxRate(econConf && econConf.PayTaxRate) } },
                    { chartId: "MaxHome",                 type: "simple_pie", data: { value: this.bucketHomeMax(homeConf && homeConf.MaxHome) } },
                    { chartId: "TpaCost",                 type: "simple_pie", data: { value: this.bucketCost(tpaConf && tpaConf.cost) } },
                    { chartId: "rtp_status",              type: "simple_pie", data: { value: (rtpConf && rtpConf.EnabledModule) ? "Enabled" : "Disabled" } }
                ]
            }
        };
    }

    submit() {
        if (!this.enabled) {
            if (this.debugMode)
                randomGradientLog("遥测模块已禁用，跳过上报。");
            return;
        }

        const payload = this.collectData();

        if (this.debugMode) {
            randomGradientLog("准备上报数据包：");
            randomGradientLog(JSON.stringify(payload, null, 2));
        }

        postWithRetry(this.baseUrl, JSON.stringify(payload), BSTATS_MAX_RETRY, this.debugMode);
    }

    start() {
    const self = this;
    const randRange = function (min, max) {
        return (Math.random() * (max - min) + min) * 1000;
    };

    // 首次上报：30~60 秒随机延迟
    setTimeout(function () {
        self.submit();

        // 第二次上报：25~30 分钟随机延迟
        setTimeout(function () {
            self.submit();

            // 此后固定每 30 分钟上报一次
            setInterval(function () {
                self.submit();
            }, 30 * 60 * 1000);

        }, randRange(25 * 60, 30 * 60));

    }, randRange(30, 60));

    setTimeout(function () {
        randomGradientLog("遥测模块已启动。首次上报将在 30~60 秒后发送，失败最多重试 " + BSTATS_MAX_RETRY + " 次。");
    }, 2000);
    }
}

// ─── 启动入口 ─────────────────────────────────────────────────────
const metrics = new BStatsImpl(29071);
metrics.start();
