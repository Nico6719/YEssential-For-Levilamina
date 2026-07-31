// 配置版本管理类
// randomGradientLog 由主文件通过 globalThis 注入，此处无需重复定义
class ConfigManager {
    constructor() {
        this.currentVersion = 295;
        this.pluginPath = pluginpath || "./plugins/YEssential";
        this.moduleListPath = `${this.pluginPath}/modules/modulelist.json`;
        // Update 配置独立文件路径（与 config.json 同级，均在 Config/ 目录下）
        this.updateConfigPath = `${this.pluginPath}/Config/Updateconfig.json`;
        // 配置备份独立文件路径（不再混入 config.json，避免主配置被一堆备份记录刷屏）
        this.backupConfigPath = `${this.pluginPath}/Config/ConfigBackup.json`;
        this.backupConf = null;
        // 默认配置（不含 Update，Update 已独立到 Updateconfig.json）
        this.configDefaults = {
            "Version": 295,
            "Economy": {
                "mode": "scoreboard",
                "RankingModel" : "New",
                // PayTaxRate 支持两种格式：
                //   旧版兼容：单一数字，如 5 表示全额固定 5% 税率
                //   新版阶梯：对象数组，按转账金额区间分级征税
                //     min: 区间下限（含），max: 区间上限（不含），-1 表示无上限，rate: 税率百分比
                "PayTaxRate": [
                    { "min": 0,      "max": 1000,   "rate": 0  },
                    { "min": 1000,   "max": 10000,  "rate": 2  },
                    { "min": 10000,  "max": 100000, "rate": 5  },
                    { "min": 100000, "max": -1,     "rate": 10 }
                ],
                "Scoreboard": "money",
                "CoinName": "金币"
            },
            "PVP": {
                "EnabledModule": true,
                "DangerousBlocks": [
                    "minecraft:tnt",
                    "minecraft:respawn_anchor",
                    "minecraft:bed",
                    "minecraft:undyed_shulker_box"
                ]
            },
            "Fcam": {
                "EnableModule": false,
                "CostMoney": 0,
                "TimeOut": 0
            },
            "Notice":{
                "EnableModule": false,
                "Join_ShowNotice": false,
                "IsUpdate":false,
            },
            "RedPacket": {
                "EnabledModule": false,
                "expireTime": 300,
                "maxAmount": 10000,
                "maxCount": 50,
                "minAmount": 1
            },
            "RTP": {
                "EnabledModule": false,
                "minRadius": 100,
                "maxRadius": 5000,
                "cooldown": 300,
                "cost": 50,
                "allowDimensions": [0, 1, 2],
                "safeCheck": true,
                "maxAttempts": 50,
                "Animation": 0,
                "enableParticle": true,
                "enableSound": true,
                "logToFile": true
            },
            "Hub": {
                "EnabledModule": false,
                "x": 0,
                "y": 100,
                "z": 0,
                "dimid": 0,
                "isSet": false
            },
            "tpa": {
                "EnabledModule": false,
                "isDelayEnabled": true,
                "cost": 1,
                "maxDelay": 20,
                "requestTimeout": 60,
                "promptType": "form"
            },
            "Home": {
                "add": 0,
                "del": 0,
                "tp": 0,
                "MaxHome": 10
            },
            "wh": {
                "EnableModule": true,
                "status": 0,
                "whmotdmsg": "服务器维护中，请勿进入！",
                "whgamemsg": "服务器正在维护中，请您稍后再来!"
            },
            "Bstats": {
                "EnableModule": true, // 模块总开关
                "logSentData": false   // 是否在控制台显示发送的数据内容
            },
            "CrossServerTransfer": {
                "EnabledModule": false,
                "servers": [
                    { "server_name": "生存服", "server_ip": "127.0.0.1", "server_port": 19132 }
                ]
            },
            "Motd": {
                "EnabledModule": true,
                "message" : ["Bedrock_Server", "Geyser"],
            },
            "Crash": {
                "EnabledModule": true ,
                "LogCrashInfo": true
            },
            "SimpleLogOutPut": false,
            "Suicide": {
                "EnabledModule": true,   // 自杀功能总开关
                "cost": 0,               // 自杀花费
                "cooldown": 0            // 冷却时间（秒），0 表示不冷却
            },
            "Back": {
                "EnabledModule": true,   // 死亡点传送功能总开关
                "cost": 0,               // 传送花费
                "cooldown": 0,           // 冷却时间（秒），0 表示不冷却
                "tipAfterDeath": false   // 死亡复活后是否自动弹出返回GUI
            },
            "Warp": 0,
            "KeepInventory": false,
        };

        // Update 模块的默认配置（独立存放于 Updateconfig.json）
        // 参考 LSE JsonConfigFile API: new JsonConfigFile(path, defaultContent)
        this.updateConfigDefaults = {
            "Update": {
                "EnableModule": true,
                "CheckInterval": 120,
                "versionUrl": "https://plugin.tobecraft.xyz/file/manifest.json",
                "baseUrl": "https://plugin.tobecraft.xyz/file/",
                "files": [
                    { "url": "YEssential.js",                    "path": "YEssential.js" },
                    { "url": "modules/I18n.js",                  "path": "./modules/I18n.js" },
                    { "url": "modules/Cleanmgr.js",              "path": "./modules/Cleanmgr.js" },
                    { "url": "modules/ConfigManager.js",         "path": "./modules/ConfigManager.js" },
                    { "url": "modules/AsyncUpdateChecker.js",    "path": "./modules/AsyncUpdateChecker.js" },
                    { "url": "modules/RadomTeleportSystem.js",   "path": "./modules/RadomTeleportSystem.js" },
                    { "url": "modules/Bstats.js",                "path": "./modules/Bstats.js" },
                    { "url": "modules/Cd.js",                    "path": "./modules/Cd.js" },
                    { "url": "modules/PVP.js",                   "path": "./modules/PVP.js" },
                    { "url": "modules/Redpacket.js",             "path": "./modules/Redpacket.js" },
                    { "url": "modules/Fcam.js",                  "path": "./modules/Fcam.js" },
                    { "url": "modules/Notice.js",                "path": "./modules/Notice.js" },
                    { "url": "modules/Sign.js",                  "path": "./modules/Sign.js" },
                    { "url": "modules/Crash.js",                 "path": "./modules/Crash.js" },
                    { "url": "modules/Warp.js",                  "path": "./modules/Warp.js" },
                    { "url": "modules/PluginInfo.js",            "path": "./modules/PluginInfo.js" },
                    { "url": "modules/Home.js",                  "path": "./modules/Home.js" },
                    { "url": "modules/CachePool.js",             "path": "./modules/CachePool.js" },
                    { "url": "modules/WriteBackStore.js",        "path": "./modules/WriteBackStore.js" }
                ],
                "reloadDelay": 1000,
                "timeout": 30000,
                "checkMissingFilesOnStart": true
            }
        };

        // Update 配置文件对象（在 initUpdateConfig 中初始化）
        this.updateConf = null;

        // 默认模块列表
        this.defaultModules = [
            {
                "path": "I18n.js",
                "name": "I18n"
            },
            {
                "path": "cleanmgr.js",
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
        ];

        // 废弃的配置项列表(需要删除的旧配置)
        // "Update" 已迁移至独立的 Updateconfig.json，在此列为废弃以清理 config.json 中的残留
        this.deprecatedConfigs = [
            "OldConfigKey1",
            "ObsoleteFeature",
            "LegacySetting",
            "Update"
        ];

        // 废弃的嵌套配置项(格式:父键.子键)
        this.deprecatedNestedConfigs = {
            "RTP": ["oldProperty", "deprecatedSetting"],
            "Hub": ["unusedField"]
        };

        // 初始化模块列表配置文件
        this.moduleListConfig = null;
    }

    /**
     * 初始化配置系统
     */
    init() {
        // 清空缓存池（如果是 reload 触发的 init）
        if (globalThis.CachePool) {
            globalThis.CachePool.clearAll();
            logger.info("[CachePool] 缓存已全部清空（reload/init）");
        }
        
        // 强制刷盘所有写回存储（如果是 reload 触发的 init）
        if (globalThis.WriteBackStore) {
            globalThis.WriteBackStore.flushAll();
            logger.info("[WriteBackStore] 所有数据已强制刷盘（reload/init）");
        }

        // 初始化独立的 Update 配置文件（Updateconfig.json）
        this.initUpdateConfig();

        // 初始化独立的配置备份文件（ConfigBackup.json），避免备份记录混入 config.json
        this.initBackupConfig();

        // 初始化模块列表
        this.initModuleList();
        
        // 扫描并同步模块
        this.syncModules();
        
        // 原有的配置初始化逻辑
        let savedVersion = conf.get("Version") || 0;
        
        if (savedVersion < this.currentVersion) {
            randomGradientLog(`检测到配置版本更新: ${savedVersion} -> ${this.currentVersion}, 开始迁移配置...`);
            this.migrateConfig(savedVersion);
            conf.set("Version", this.currentVersion);
            randomGradientLog("配置迁移完成!");
        }
        
        // 确保所有配置项都存在
        this.ensureAllConfigs();
        
        // 确保 Update 配置项在独立文件中存在
        this.ensureUpdateConfig();
        
        // 清理废弃的配置
        this.cleanupDeprecatedConfigs();
    }

    /**
     * 初始化 ConfigBackup.json（与 config.json 同级）
     * 所有迁移备份记录都存放在这个独立文件中，不再混入 config.json
     */
    initBackupConfig() {
        try {
            this.backupConf = new JsonConfigFile(this.backupConfigPath, JSON.stringify({}));
        } catch (error) {
            logger.error(`配置备份文件初始化失败: ${error.message}`);
        }
    }

    // ========== Update 独立配置文件管理 ==========

    /**
     * 初始化 Updateconfig.json（与 config.json 同级）
     * 参考 LSE JsonConfigFile API: new JsonConfigFile(path, defaultContent)
     * https://lse.levimc.org/apis/DataAPI/ConfigFile/
     */
    initUpdateConfig() {
        try {
            // 只创建文件对象，不传默认值
            // 原因：默认值写入必须在 migrateConfig（迁移旧 Update 键）之后才能执行，
            // 否则 migrateTo294 会误判文件已存在而跳过迁移。
            // 默认值由后续的 ensureUpdateConfig() 负责补全。
            this.updateConf = new JsonConfigFile(this.updateConfigPath);
            // 暴露到全局，供 CachePool 等模块通过 updateConf.get("Update") 访问
            globalThis.updateConf = this.updateConf;
        } catch (error) {
            logger.error(`Update 配置文件初始化失败: ${error.message}`);
        }
    }

    /**
     * 确保 Updateconfig.json 中 Update 块存在且字段完整（补全缺失子键）
     */
    ensureUpdateConfig() {
        if (!this.updateConf) return;
        try {
            const defaultUpdate = this.updateConfigDefaults.Update;
            let current = this.updateConf.get("Update");

            if (!this.isValidObject(current)) {
                this.updateConf.set("Update", defaultUpdate);
                randomGradientLog("Updateconfig.json: Update 块不存在，已写入默认值");
                return;
            }

            // 合并缺失的子键（不覆盖已有值）
            const merged = this.mergeConfigs(defaultUpdate, current);
            this.updateConf.set("Update", merged);

            const added = this.getAddedProperties(defaultUpdate, current);
            if (added.length > 0) {
                randomGradientLog(`Updateconfig.json 新增缺失字段: ${added.join(", ")}`);
            }
        } catch (error) {
            logger.error(`ensureUpdateConfig 失败: ${error.message}`);
        }
    }

    // ========== 模块列表管理 ==========

    /**
     * 初始化模块列表配置文件
     */
    initModuleList() {
        try {
            this.moduleListConfig = new JsonConfigFile(
                this.moduleListPath,
                JSON.stringify({
                    "modules": this.defaultModules
                })
            );
            //randomGradientLog("模块列表配置文件初始化成功");
        } catch (error) {
            logger.error(`模块列表配置文件初始化失败: ${error.message}`);
        }
    }

    /**
     * 扫描模块目录并同步到配置文件
     */
    syncModules() {
        try {
            const modulesDir = `${this.pluginPath}/modules`;
            
            // 获取目录中的所有 .js 文件
            const files = File.getFilesList(modulesDir);
            if (!files || files.length === 0) {
                logger.warn("未找到任何模块文件");
                return;
            }

            // 过滤出 .js 文件
            const jsFiles = files.filter(file => file.endsWith('.js'));
            
            // 获取当前配置的模块列表
            let currentModules = this.moduleListConfig.get("modules") || [];
            let modulesMap = new Map();
            
            // 构建现有模块的映射
            currentModules.forEach(mod => {
                modulesMap.set(mod.path, mod);
            });

            let addedCount = 0;
            let updatedModules = [];

            // 检查文件系统中的模块
            jsFiles.forEach(file => {
                const fileName = file.split(/[/\\]/).pop(); // 兼容不同操作系统路径
                
                if (modulesMap.has(fileName)) {
                    // 模块已存在,保留原有配置
                    updatedModules.push(modulesMap.get(fileName));
                } else {
                    // 发现新模块
                    const moduleName = this.getModuleNameFromFile(fileName);
                    const newModule = {
                        "path": fileName,
                        "name": moduleName
                    };
                    updatedModules.unshift(newModule);
                    randomGradientLog(`发现新模块: ${fileName} (${moduleName})`);
                    addedCount++;
                }
            });

            // 检查是否有模块被删除
            let removedCount = 0;
            currentModules.forEach(mod => {
                if (!jsFiles.some(file => file.endsWith(mod.path))) {
                    randomGradientLog(`模块已被删除: ${mod.path}`);
                    removedCount++;
                }
            });

            // 更新配置文件
            if (addedCount > 0 || removedCount > 0) {
                this.moduleListConfig.set("modules", updatedModules);
                randomGradientLog(`模块同步完成: 新增 ${addedCount} 个, 删除 ${removedCount} 个`);
            } else {
                //randomGradientLog("模块列表无变化");
            }

        } catch (error) {
            logger.error(`模块同步失败: ${error.message}`);
        }
    }

    /**
     * 从文件名推断模块名称
     * @param {string} fileName 文件名
     * @returns {string} 模块名称
     */
    getModuleNameFromFile(fileName) {
        // 移除 .js 后缀
        let name = fileName.replace(/\.js$/i, '');
        
        // 将常见的命名格式转换为标准格式
        // 例如: random-teleport-system.js -> RandomTeleportSystem
        //      async_update_checker.js -> AsyncUpdateChecker
        
        // 处理横线和下划线分隔
        if (name.includes('-') || name.includes('_')) {
            name = name.split(/[-_]/)
                       .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                       .join('');
        } else {
            // 首字母大写
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }
        
        return name;
    }

    /**
     * 获取所有已注册的模块
     * @returns {Array} 模块列表
     */
    getModules() {
        return this.moduleListConfig.get("modules") || [];
    }

    /**
     * 添加新模块到列表
     * @param {string} path 模块路径
     * @param {string} name 模块名称
     */
    addModule(path, name) {
        let modules = this.getModules();
        
        // 检查模块是否已存在
        if (modules.some(mod => mod.path === path)) {
            logger.warn(`模块已存在: ${path}`);
            return false;
        }

        modules.push({ path, name });
        this.moduleListConfig.set("modules", modules);
        randomGradientLog(`添加模块: ${path} (${name})`);
        return true;
    }

    /**
     * 从列表中移除模块
     * @param {string} path 模块路径
     */
    removeModule(path) {
        let modules = this.getModules();
        let filtered = modules.filter(mod => mod.path !== path);
        
        if (filtered.length === modules.length) {
            logger.warn(`模块不存在: ${path}`);
            return false;
        }

        this.moduleListConfig.set("modules", filtered);
        randomGradientLog(`移除模块: ${path}`);
        return true;
    }

    /**
     * 手动触发模块扫描
     */
    scanModules() {
        randomGradientLog("开始扫描模块目录...");
        this.syncModules();
    }

    // ========== 原有的配置管理方法 ==========

    /**
     * 迁移配置到最新版本
     * @param {number} oldVersion 旧版本号
     */
    migrateConfig(oldVersion) {
        // 备份当前配置
        this.backupConfig(oldVersion);
        
        const migrations = [
            { version: 293, handler: () => this.migrateTo293() },
            { version: 294, handler: () => this.migrateTo294() },
            { version: 295, handler: () => this.migrateTo295() }
        ];

        migrations.forEach(migration => {
            if (oldVersion < migration.version) {
                try {
                    migration.handler();
                } catch (error) {
                    logger.error(`迁移到v${migration.version}失败: ${error.message}`);
                }
            }
        });
    }

    /**
     * 备份配置
     * 写入独立的 ConfigBackup.json，不再混入 config.json
     * 仅备份 config.json 的内容（不含 Updateconfig.json），且只保留最近一份备份：
     * 每次都写入同一个固定 key，新备份会直接覆盖旧备份，无需额外清理逻辑。
     */
    backupConfig(version) {
        if (!this.backupConf) {
            logger.error("backupConfig: backupConf 未初始化，跳过备份");
            return;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        let allConfigs = {};
        for (let key in this.configDefaults) {
            let value = conf.get(key);
            if (value !== undefined) {
                allConfigs[key] = value;
            }
        }

        // 固定 key，覆盖写入，确保 ConfigBackup.json 中只保留最近一份 config.json 备份
        this.backupConf.set("LatestConfigBackup", {
            version: version,
            timestamp: timestamp,
            configs: allConfigs
        });
    }

    // ========== 版本特定迁移方法 ==========
    /*
     迁移到 v293：将旧版单一数字 PayTaxRate 自动转换为阶梯数组
     */
    migrateTo293() {
        randomGradientLog("更新配置版本到293：迁移 PayTaxRate 为阶梯税率格式");

        const economy = conf.get("Economy");
        if (!this.isValidObject(economy)) {
            // Economy 块不存在，由 mergeConfigs 补全默认值，此处无需处理
            randomGradientLog("Economy 配置不存在，将使用默认阶梯税率");
            return;
        }

        const oldRate = economy.PayTaxRate;

        // 已经是数组 → 无需迁移
        if (Array.isArray(oldRate)) {
            randomGradientLog("PayTaxRate 已为阶梯数组，跳过迁移");
            return;
        }

        let newRate;
        if (typeof oldRate === "number" && oldRate > 0) {
            // 旧值为非零数字：保留原税率，转为单档（行为完全兼容）
            newRate = [{ "min": 0, "max": -1, "rate": oldRate }];
            randomGradientLog(`PayTaxRate 旧值 ${oldRate}% → 转为单档阶梯 [{min:0, max:-1, rate:${oldRate}}]`);
        } else {
            // 旧值为 0 或非预期值：写入默认四档阶梯
            newRate = this.configDefaults.Economy.PayTaxRate;
            randomGradientLog("PayTaxRate 旧值为 0，写入默认阶梯税率配置");
        }

        economy.PayTaxRate = newRate;
        conf.set("Economy", economy);
        randomGradientLog("PayTaxRate 迁移完成，请根据需要在配置文件中调整各档位参数");
        // 确保 modulelist.json 中 I18n.js 始终排在第一位
        this.ensureI18nFirst();
    }

    /**
     * 迁移到 v294：将 config.json 中的 Update 块迁移到独立的 Updateconfig.json
     *
     * 迁移策略：
     *   1. 若 config.json 存在 Update 键 → 写入 Updateconfig.json，再从 config.json 删除
     *   2. 若 config.json 不存在 Update 键 → Updateconfig.json 将由 ensureUpdateConfig 补全默认值
     *   3. 若 Updateconfig.json 已存在 Update 键 → 不覆盖，仅删除 config.json 中的旧键
     */
    migrateTo294() {
        randomGradientLog("更新配置版本到294：将 Update 配置迁移到独立的 Updateconfig.json");

        // updateConf 必须在迁移前已初始化（init 中已优先调用 initUpdateConfig）
        if (!this.updateConf) {
            logger.error("migrateTo294: updateConf 未初始化，跳过迁移");
            return;
        }

        const oldUpdate = conf.get("Update");

        if (this.isValidObject(oldUpdate)) {
            // Updateconfig.json 中已有 Update 键时不覆盖，保留用户已有配置
            const existingUpdate = this.updateConf.get("Update");
            if (!this.isValidObject(existingUpdate)) {
                this.updateConf.set("Update", oldUpdate);
                randomGradientLog("Update 配置已写入 Updateconfig.json");
            } else {
                randomGradientLog("Updateconfig.json 中 Update 已存在，保留现有配置，不覆盖");
            }

            // 从 config.json 中删除旧的 Update 键
            conf.delete("Update");
            randomGradientLog("已从 config.json 中删除旧的 Update 键");
        } else {
            randomGradientLog("config.json 中不存在 Update 键，将由 ensureUpdateConfig 写入默认值");
        }

        randomGradientLog("Update 配置迁移完成，今后请在 Updateconfig.json 中修改更新相关配置");
    }

    /**
     * 迁移到 v295：将旧版扁平的 suicide / Back 数字配置（仅表示花费）
     * 迁移为嵌套对象格式 Suicide / Back（{EnabledModule, cost, cooldown}），
     * 与 tpa / Home 等模块的配置风格保持一致，同时新增开关与冷却字段。
     *
     * 迁移策略：
     *   1. 若存在旧的 "suicide"（小写，数字）键 → 取其值作为新 Suicide.cost，删除旧键
     *   2. 若 "Back" 键仍是数字（旧格式）→ 取其值作为新 Back.cost，覆盖为嵌套对象
     *   3. 若已经是嵌套对象（说明已迁移过，或是全新安装）→ 跳过，不覆盖用户已有配置
     */
    migrateTo295() {
        randomGradientLog("更新配置版本到295：迁移 suicide/Back 旧配置为 Suicide/Back 嵌套格式");

        // ── suicide → Suicide ──────────────────────────────
        const oldSuicide = conf.get("suicide");
        const curSuicide = conf.get("Suicide");
        if (typeof oldSuicide === "number" && !this.isValidObject(curSuicide)) {
            conf.set("Suicide", {
                EnabledModule: true,
                cost: oldSuicide,
                cooldown: 0
            });
            randomGradientLog(`suicide 旧花费 ${oldSuicide} → 迁移为 Suicide.cost，新增开关/冷却字段`);
        } else if (this.isValidObject(curSuicide)) {
            randomGradientLog("Suicide 已为嵌套对象格式，跳过迁移，保留现有配置");
        }
        if (oldSuicide !== undefined) {
            conf.delete("suicide");
            randomGradientLog("已从 config.json 中删除旧的 suicide 键");
        }

        // ── Back（数字花费）→ Back（嵌套对象）──────────────
        const oldBack = conf.get("Back");
        if (typeof oldBack === "number") {
            conf.set("Back", {
                EnabledModule: true,
                cost: oldBack,
                cooldown: 0
            });
            randomGradientLog(`Back 旧花费 ${oldBack} → 迁移为 Back.cost，新增开关/冷却字段`);
        } else if (this.isValidObject(oldBack)) {
            randomGradientLog("Back 已为嵌套对象格式，跳过迁移，保留现有配置");
        }

        // ── BackTipAfterDeath（旧顶级键，0/1 数字或布尔）→ Back.tipAfterDeath ──
        const oldBackTip = conf.get("BackTipAfterDeath");
        if (oldBackTip !== undefined) {
            const newBack = conf.get("Back");
            if (this.isValidObject(newBack) && newBack.tipAfterDeath === undefined) {
                newBack.tipAfterDeath = typeof oldBackTip === "number" ? oldBackTip !== 0 : !!oldBackTip;
                conf.set("Back", newBack);
                randomGradientLog(`BackTipAfterDeath 旧值 ${oldBackTip} → 迁移为 Back.tipAfterDeath`);
            }
            conf.delete("BackTipAfterDeath");
            randomGradientLog("已从 config.json 中删除旧的 BackTipAfterDeath 键");
        }

        randomGradientLog("Suicide/Back 配置迁移完成，今后请通过 Suicide.EnabledModule / Suicide.cooldown / Back.EnabledModule / Back.cooldown / Back.tipAfterDeath 等字段配置");
    }

    /**
     * 确保 modulelist.json 中 I18n.js 排在第一位
     * 若不存在则自动插入
     */
    ensureI18nFirst() {
        try {
            if (!this.moduleListConfig) {
                randomGradientLog("moduleListConfig 未初始化，跳过 I18n 排序");
                return;
            }

            let modules = this.moduleListConfig.get("modules");
            if (!Array.isArray(modules)) {
                randomGradientLog("modulelist.json 格式异常，跳过 I18n 排序");
                return;
            }

            const i18nEntry = { "path": "I18n.js", "name": "I18n" };

            // 移除已有的 I18n 条目（无论在哪个位置）
            const filtered = modules.filter(m => m.path !== "I18n.js");

            // 插到最前面
            const reordered = [i18nEntry, ...filtered];

            this.moduleListConfig.set("modules", reordered);
            randomGradientLog("modulelist.json 已确保 I18n.js 排在第一位");
        } catch (error) {
            logger.error(`调整 modulelist.json 顺序失败: ${error.message}`);
        }
    }

    
    // ========== 配置管理核心方法 ==========

    setIfMissing(key, defaultValue) {
        if (conf.get(key) === undefined) {
            conf.set(key, defaultValue);
            randomGradientLog(`添加缺失配置: ${key} = ${JSON.stringify(defaultValue)}`);
        }
    }

    ensureObjectConfig(key, defaultConfig) {
        let currentConfig = conf.get(key);
        
        if (!this.isValidObject(currentConfig)) {
            conf.set(key, defaultConfig);
            randomGradientLog(`创建对象配置: ${key}`);
            return;
        }

        let merged = this.mergeConfigs(defaultConfig, currentConfig);
        conf.set(key, merged);
        
        let addedProps = this.getAddedProperties(defaultConfig, currentConfig);
        if (addedProps.length > 0) {
            randomGradientLog(`配置 ${key} 新增属性: ${addedProps.join(", ")}`);
        }
    }

    isValidObject(value) {
        return value !== undefined && 
               value !== null && 
               typeof value === 'object' && 
               !Array.isArray(value);
    }

    mergeConfigs(defaultConfig, currentConfig) {
        let merged = JSON.parse(JSON.stringify(currentConfig));
        
        for (let key in defaultConfig) {
            if (merged[key] === undefined) {
                merged[key] = defaultConfig[key];
            } else if (this.isValidObject(defaultConfig[key]) && this.isValidObject(merged[key])) {
                merged[key] = this.mergeConfigs(defaultConfig[key], merged[key]);
            }
        }
        
        return merged;
    }

    getAddedProperties(defaultConfig, currentConfig) {
        let added = [];
        for (let key in defaultConfig) {
            if (currentConfig[key] === undefined) {
                added.push(key);
            }
        }
        return added;
    }

    ensureAllConfigs() {
        for (let key in this.configDefaults) {
            if (this.isValidObject(this.configDefaults[key])) {
                this.ensureObjectConfig(key, this.configDefaults[key]);
            } else {
                this.setIfMissing(key, this.configDefaults[key]);
            }
        }
    }

    // ========== 清理废弃配置 ==========

    cleanupDeprecatedConfigs() {
        let removedCount = 0;

        this.deprecatedConfigs.forEach(key => {
            if (conf.get(key) !== undefined) {
                conf.delete(key);
                randomGradientLog(`删除废弃配置: ${key}`);
                removedCount++;
            }
        });

        for (let parentKey in this.deprecatedNestedConfigs) {
            let parentConfig = conf.get(parentKey);
            
            if (!this.isValidObject(parentConfig)) continue;

            let modified = false;
            let deprecatedProps = this.deprecatedNestedConfigs[parentKey];

            deprecatedProps.forEach(prop => {
                if (parentConfig.hasOwnProperty(prop)) {
                    delete parentConfig[prop];
                    randomGradientLog(`删除废弃配置: ${parentKey}.${prop}`);
                    modified = true;
                    removedCount++;
                }
            });

            if (modified) {
                conf.set(parentKey, parentConfig);
            }
        }

        removedCount += this.cleanupLegacyConfigBackupKeys();

        if (removedCount > 0) {
            randomGradientLog(`清理完成,共删除 ${removedCount} 个废弃配置`);
        }
    }

    /**
     * 注：旧版本曾依赖 cleanupOldBackups()/getBackupConfigKeys() 来清理多份历史备份，
     * 但 LSE 官方 JsonConfigFile API（conf.init/set/get/delete/reload/close/getPath/read/write）
     * 并未提供 keys()/getKeys() 接口，依赖它是非官方/不可靠的写法。
     * 现在 backupConfig() 固定使用同一个 key 覆盖写入，ConfigBackup.json 天然只保留最近一份备份，
     * 因此不再需要这两个方法。
     */

    getAllConfigKeys() {
        try {
            let raw = conf.read();
            let parsed = JSON.parse(raw);
            if (this.isValidObject(parsed)) {
                return Object.keys(parsed);
            }
        } catch (error) {
            logger.error(`getAllConfigKeys: 读取/解析 config.json 失败: ${error.message}`);
        }
        return [];
    }

    /**
     * 清理 config.json 中残留的旧版备份记录（"ConfigBackup_v..." 格式的 key）。
     * 这些是早期版本（备份未独立到 ConfigBackup.json 之前）遗留下来的旧数据，
     * 现在备份已经迁移到独立的 ConfigBackup.json 文件，这些残留 key 不再需要。
     * LSE 官方 JsonConfigFile 没有 keys()/getKeys() 接口，因此通过官方支持的
     * conf.read() 读取整个文件内容并 JSON.parse 来获取所有 key，再逐一 conf.delete()。
     */
    cleanupLegacyConfigBackupKeys() {
        let allKeys = this.getAllConfigKeys();
        let legacyBackupKeys = allKeys.filter(key => key.startsWith("ConfigBackup_"));

        if (legacyBackupKeys.length === 0) {
            return 0;
        }

        legacyBackupKeys.forEach(key => {
            // 走缓存池的写穿删除：底层文件 delete 的同时同步失效 CachePool 里的旧值，
            // 避免其他模块通过 CachePool.conf(key) 在 TTL(5s) 内读到已经被删除的脏缓存。
            if (globalThis.CachePool && typeof globalThis.CachePool.deleteConf === 'function') {
                globalThis.CachePool.deleteConf(key, conf);
            } else {
                conf.delete(key);
            }
            randomGradientLog(`清理 config.json 中残留的旧版备份: ${key}`);
        });

        return legacyBackupKeys.length;
    }
}

// 创建配置管理器实例并初始化
const configManager = new ConfigManager();

// 初始化配置(在插件加载时自动执行)
function initializeConfig() {
    configManager.init();
}

// 如果作为模块使用,延迟初始化
// 如果直接在主文件中使用,立即初始化
if (typeof ll !== 'undefined' && ll.registerPlugin) {
    // 在插件环境中,立即初始化
    initializeConfig();
} else if (typeof module !== 'undefined' && module.exports) {
    // 作为模块导出时,提供初始化方法
    module.exports = {
        ConfigManager: ConfigManager,
        configManager: configManager,
        init: initializeConfig
    };
}