/*
 * Sign.js - 签到系统模块
 * YEssential 子模块
 */

module.exports = {
    init: function () {
        initSignModule();
    }
};

function initSignModule() {

    // ── 全局依赖 ──────────────────────────────────────────────
    var _info    = globalThis.info    || "§l§6[-YEST-] §r";
    var _lang    = globalThis.lang;
    var _Economy = globalThis.Economy;
    var _eco     = globalThis.economyCfg;

    function L(key, fallback) {
        try {
            var v = globalThis.CachePool ? CachePool.lang(key) : (_lang && _lang.get(key));
            return (v && v !== key) ? v : (fallback || key);
        } catch (e) { return fallback || key; }
    }

    // ── 路径常量 ──────────────────────────────────────────────
    var SIGN_DIR        = "./plugins/YEssential/data/Sign/";
    var CONFIG_PATH     = "./plugins/YEssential/config/Sign/config.json";
    var SIGNDATA_PATH   = "./plugins/YEssential/data/Sign/signdata.json";
    var REWARDDATA_PATH = "./plugins/YEssential/data/Sign/reward.json";

    var DEFAULT_REWARD_ITEMS = JSON.stringify([
        "{\"Count\":1b,\"Damage\":0s,\"Name\":\"minecraft:cooked_chicken\",\"WasPickedUp\":0b}",
        "{\"Count\":1b,\"Damage\":0s,\"Name\":\"minecraft:bread\",\"WasPickedUp\":0b}",
        "{\"Count\":1b,\"Damage\":0s,\"Name\":\"minecraft:apple\",\"WasPickedUp\":0b}",
        "{\"Count\":1b,\"Damage\":0s,\"Name\":\"minecraft:enchanted_golden_apple\",\"WasPickedUp\":0b}"
    ]);

    var DEFAULT_CONFIG = JSON.stringify({
        version: "1.0.0",
        sign: { switch: true, gui_arrange: 3 },
        random_money: { min_money: 1000, max_money: 10000 },
        random_exp:   { min_exp: 100,    max_exp:   1000  },
        reward: ["item_1","item_2","money_1000","money_1000","random_money","item_1","money_1000"],
        addition: { "3":"item_1","5":"money_500","7":"item_2","15":"item_2","30":"money_2000" }
    });

    // ── 确保目录存在 ──────────────────────────────────────────
    if (!File.exists(SIGN_DIR)) File.createDir(SIGN_DIR);

    // ── 数据文件 ──────────────────────────────────────────────
    var config_data  = new JsonConfigFile(CONFIG_PATH,     DEFAULT_CONFIG);
    var sign_data    = new JsonConfigFile(SIGNDATA_PATH,   "{}");
    var reward_data  = new JsonConfigFile(REWARDDATA_PATH, DEFAULT_REWARD_ITEMS);

    // ════════════════════════════════════════════════════════════
    // 经济封装
    // ════════════════════════════════════════════════════════════
    var Money = {
        add: function (player, amount) {
            if (_Economy) return _Economy.execute(player, "add", amount);
            var sb = _eco ? _eco.scoreboard : "money";
            return player.addScore(sb, Number(amount));
        },
        coinName: function () {
            return (_eco && _eco.coinName) ? _eco.coinName : "金币";
        }
    };

    // ════════════════════════════════════════════════════════════
    // 配置管理
    // ════════════════════════════════════════════════════════════
    var _signConfigCache = globalThis.CachePool
        ? globalThis.CachePool.createModuleCache(2000)
        : null;
    var _SIGN_CFG_KEY = "sign_cfg_all";

    var Config = {
        get: function (key) {
            // 尝试从缓存取整个 config 对象
            var all;
            if (_signConfigCache) {
                all = _signConfigCache.get(_SIGN_CFG_KEY);
            }
            if (all === undefined) {
                // 缓存 miss，读一次磁盘
                config_data.reload();
                all = JSON.parse(config_data.read() || "{}");
                if (_signConfigCache) _signConfigCache.set(_SIGN_CFG_KEY, all);
            }
            return key == null ? all : all[key];
        },
        set: function (obj) {
            Object.keys(obj).forEach(function(k) { config_data.set(k, obj[k]); });
            // 写入后失效缓存
            if (_signConfigCache) _signConfigCache.invalidate(_SIGN_CFG_KEY);
        },
        getSign:        function () { return this.get("sign"); },
        getRandomMoney: function () { return this.get("random_money"); },
        getRandomExp:   function () { return this.get("random_exp"); },
        getReward:      function () { return this.get("reward"); },
        getAddition:    function () { return this.get("addition"); }
    };

    // ════════════════════════════════════════════════════════════
    // 物品中文名映射（服务端语言为英文时作为兜底）
    // ════════════════════════════════════════════════════════════
    var ITEM_ZH = {
        "minecraft:apple":                    "苹果",
        "minecraft:golden_apple":             "金苹果",
        "minecraft:enchanted_golden_apple":   "附魔金苹果",
        "minecraft:bread":                    "面包",
        "minecraft:cooked_chicken":           "熟鸡肉",
        "minecraft:cooked_beef":              "牛排",
        "minecraft:cooked_porkchop":          "熟猪排",
        "minecraft:cooked_mutton":            "熟羊肉",
        "minecraft:cooked_rabbit":            "熟兔肉",
        "minecraft:cooked_cod":               "熟鳕鱼",
        "minecraft:cooked_salmon":            "熟鲑鱼",
        "minecraft:cookie":                   "曲奇",
        "minecraft:cake":                     "蛋糕",
        "minecraft:pumpkin_pie":              "南瓜派",
        "minecraft:melon":                    "西瓜片",
        "minecraft:carrot":                   "胡萝卜",
        "minecraft:golden_carrot":            "金胡萝卜",
        "minecraft:potato":                   "土豆",
        "minecraft:baked_potato":             "烤土豆",
        "minecraft:beetroot":                 "甜菜根",
        "minecraft:diamond":                  "钻石",
        "minecraft:emerald":                  "绿宝石",
        "minecraft:gold_ingot":               "金锭",
        "minecraft:iron_ingot":               "铁锭",
        "minecraft:netherite_ingot":          "下界合金锭",
        "minecraft:coal":                     "煤炭",
        "minecraft:lapis_lazuli":             "青金石",
        "minecraft:quartz":                   "下界石英",
        "minecraft:amethyst_shard":           "紫水晶碎片",
        "minecraft:experience_bottle":        "附魔之瓶",
        "minecraft:book":                     "书",
        "minecraft:enchanted_book":           "附魔书",
        "minecraft:name_tag":                 "命名牌",
        "minecraft:saddle":                   "鞍",
        "minecraft:elytra":                   "鞘翅",
        "minecraft:totem_of_undying":         "不死图腾",
        "minecraft:ender_pearl":              "末影珍珠",
        "minecraft:blaze_rod":                "烈焰棒",
        "minecraft:ghast_tear":               "恶魂之泪",
        "minecraft:nether_star":              "下界之星",
        "minecraft:heart_of_the_sea":         "海洋之心",
        "minecraft:shulker_shell":            "潜影贝壳",
        "minecraft:prismarine_crystals":      "海晶碎片",
        "minecraft:trident":                  "三叉戟",
        "minecraft:arrow":                    "箭",
        "minecraft:spectral_arrow":           "光灵箭",
        "minecraft:tipped_arrow":             "药箭",
        "minecraft:snowball":                 "雪球",
        "minecraft:egg":                      "鸡蛋",
        "minecraft:gunpowder":                "火药",
        "minecraft:string":                   "线",
        "minecraft:feather":                  "羽毛",
        "minecraft:leather":                  "皮革",
        "minecraft:wool":                     "羊毛",
        "minecraft:glass":                    "玻璃",
        "minecraft:torch":                    "火把",
        "minecraft:lantern":                  "灯笼",
        "minecraft:soul_lantern":             "灵魂灯笼",
        "minecraft:flower_pot":               "花盆",
        "minecraft:painting":                 "画",
        "minecraft:item_frame":               "物品展示框"
    };

    function itemZhName(item) {
        // 优先用映射表，否则用游戏返回的名字
        var id = item.type; // e.g. "minecraft:cooked_chicken"
        return ITEM_ZH[id] || item.name;
    }


    var Reward = {
        getItems: function () {
            reward_data.reload();
            return JSON.parse(reward_data.read());
        },
        randomMoney: function () {
            var cfg = Config.getRandomMoney();
            var min = cfg.min_money || 1000;
            var max = cfg.max_money || 10000;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        randomExp: function () {
            var cfg = Config.getRandomExp();
            var min = cfg.min_exp || 100;
            var max = cfg.max_exp || 1000;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        // 解析奖励标识符 => { name, reward, type }
        parse: function (str) {
            str = (str || "").trim();
            var coin = Money.coinName();
            if (str === "random_money") {
                var m = this.randomMoney();
                return { name: "随机" + coin + "x" + m, reward: m, type: "money" };
            }
            if (str === "random_item") {
                var items = this.getItems();
                var idx   = Math.floor(Math.random() * items.length);
                var item  = mc.newItem(NBT.parseSNBT(items[idx]));
                return { name: "随机物品:" + itemZhName(item) + "x" + item.count, reward: item, type: "item" };
            }
            if (str === "random_exp") {
                var e = this.randomExp();
                return { name: "随机经验x" + e, reward: e, type: "exp" };
            }
            var parts = str.split("_");
            var type  = parts[0];
            var sub   = parts.slice(1).join("_");
            if (type === "item") {
                var iList = this.getItems();
                var iIdx  = Number(sub) - 1;
                if (iIdx < 0 || iIdx >= iList.length)
                    return { name: "无奖励", reward: 0, type: "none" };
                var it = mc.newItem(NBT.parseSNBT(iList[iIdx]));
                return { name: itemZhName(it) + "x" + it.count, reward: it, type: "item" };
            }
            if (type === "money") {
                var n = Number(sub);
                return { name: coin + "x" + n, reward: n, type: "money" };
            }
            if (type === "exp") {
                var n = Number(sub);
                return { name: "经验x" + n, reward: n, type: "exp" };
            }
            return { name: "无奖励", reward: 0, type: "none" };
        },
        // 生成当月每日奖励列表
        buildMonthly: function () {
            var cfg  = Config.getReward();
            var self = this;
            var list = cfg.map(function (r) { return self.parse(r); });
            var days = Sign.totalDaysInMonth();
            while (list.length < days) list = list.concat(list);
            return list.slice(0, days);
        },
        // 格式化为界面文本（补空格对齐列，中文字符按双倍宽度计算）
        format: function (list) {
            var today = new Date().getDate();
            var cols  = Config.getSign().gui_arrange || 3;
            // 每格视觉宽度（ASCII=1，中文=2），根据列数调整
            var colW  = cols <= 2 ? 22 : cols === 3 ? 15 : cols === 4 ? 11 : 9;

            // 计算字符串的视觉宽度（中文/全角算2）
            function visLen(str) {
                var w = 0;
                for (var i = 0; i < str.length; i++) {
                    w += str.charCodeAt(i) > 0x2E7F ? 2 : 1;
                }
                return w;
            }

            // 按视觉宽度截断字符串
            function visTrunc(str, maxW) {
                var w = 0;
                for (var i = 0; i < str.length; i++) {
                    var cw = str.charCodeAt(i) > 0x2E7F ? 2 : 1;
                    if (w + cw > maxW) return str.slice(0, i) + ".";
                    w += cw;
                }
                return str;
            }

            var text = "";
            for (var i = 0; i < list.length; i++) {
                var day    = i + 1;
                var dayStr = (day < 10 ? "0" : "") + day;
                var name   = list[i].name;
                var maxName = colW - 3; // 减去 "01 " 的位置（3个ASCII）
                name = visTrunc(name, maxName);
                var raw  = dayStr + " " + name;
                // 按视觉宽度补空格
                var rw   = visLen(raw);
                while (rw < colW) { raw += " "; rw++; }

                var cell;
                if (day < today)        cell = "§8" + raw + "§r";
                else if (day === today) cell = "§e§l" + raw + "§r";
                else                    cell = "§7" + raw;

                text += cell;
                if (day % cols === 0) text += "\n";
            }
            return text.trimRight ? text.trimRight() : text;
        }
    };

    // ════════════════════════════════════════════════════════════
    // 签到数据
    // ════════════════════════════════════════════════════════════
    var Sign = {
        get: function (player) {
            sign_data.reload();
            if (player == null) return JSON.parse(sign_data.read());
            var name = (typeof player === "string") ? player : player.realName;
            return sign_data.get(name);
        },
        save: function (name, data) {
            sign_data.set(name, data);
        },
        getCount:        function (player) { return Number((this.get(player) || {}).count         || 0); },
        getWeeklyCount:  function (player) { return Number((this.get(player) || {}).weekly_count  || 0); },
        getMonthlyCount: function (player) { return Number((this.get(player) || {}).monthly_count || 0); },
        getContSign:     function (player) { return Number((this.get(player) || {}).cont_sign     || 0); },
        getSignDate:     function (player) { return String((this.get(player) || {}).sign_date     || "---"); },
        todayStr: function () {
            var now = new Date();
            var m   = now.getMonth() + 1;
            var d   = now.getDate();
            return now.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
        },
        totalDaysInMonth: function () {
            var n = new Date();
            return new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
        },
        // 与今天的天数差 (0=今天已签, >0=未签)
        timeDiff: function (player) {
            var d = this.get(player);
            if (!d || !d.sign_date) return 99;
            var today = this.todayStr();
            return Math.floor((new Date(today) - new Date(d.sign_date)) / 86400000);
        },
        // 打卡
        clockIn: function (player) {
            var name  = (typeof player === "string") ? player : player.realName;
            var today = this.todayStr();
            var d     = this.get(player);
            if (d == null) {
                d = { count: 1, weekly_count: 1, monthly_count: 1, cont_sign: 1, sign_date: today };
            } else {
                d.count = (d.count || 0) + 1;
                if (new Date().getDay() === 0)    d.weekly_count  = 1;
                else                              d.weekly_count  = (d.weekly_count  || 0) + 1;
                if (new Date().getDate() === 1)   d.monthly_count = 1;
                else                              d.monthly_count = (d.monthly_count || 0) + 1;
                if (this.timeDiff(player) <= 1)   d.cont_sign     = (d.cont_sign     || 0) + 1;
                else                              d.cont_sign     = 1;
                d.sign_date = today;
            }
            this.save(name, d);
        }
    };

    // ════════════════════════════════════════════════════════════
    // 发放奖励 & 连续奖励检查
    // ════════════════════════════════════════════════════════════
    function giveReward(player, rewardObj) {
        if (rewardObj.type === "item") {
            var item = rewardObj.reward;
            if (player.getInventory().hasRoomFor(item)) {
                player.giveItem(item);
            } else {
                mc.spawnItem(item, player.pos);
                player.sendToast("§l签到提示", "§e背包已满，奖励物品已掉落到脚下 ↓");
            }
        } else if (rewardObj.type === "money") {
            Money.add(player, rewardObj.reward);
        } else if (rewardObj.type === "exp") {
            // LSE 的 Player API 没有 addExp，增加经验点数的方法是 addExperience(count)
            // 参考: https://lse.levimc.org/apis/GameAPI/Player/
            player.addExperience(Number(rewardObj.reward));
        }
    }

    function checkAddition(player) {
        var cont     = Sign.getContSign(player);
        var addition = Config.getAddition() || {};
        var key      = String(cont);
        if (addition[key]) {
            var bonus = Reward.parse(addition[key]);
            giveReward(player, bonus);
            player.tell(_info + "§b§l连续签到里程碑！§r §e第 §6§l" + cont + "§r§e 天附加奖励：§f" + bonus.name);
        }
    }

    // ════════════════════════════════════════════════════════════
    // GUI - 签到主界面
    // ════════════════════════════════════════════════════════════
    function openSignForm(player) {
        var rewardList   = Reward.buildMonthly();
        var rewardText   = Reward.format(rewardList);
        var today        = new Date().getDate();
        var canSign      = (Sign.timeDiff(player) > 0 || Sign.getCount(player) === 0);
        var monthCnt     = Sign.getMonthlyCount(player);
        var contCnt      = Sign.getContSign(player);
        var totalCnt     = Sign.getCount(player);

        var fm = mc.newSimpleForm();
        fm.setTitle("§l§e每日签到");
        fm.setContent(
            "§e本月 §f" + monthCnt + " §7次   §b连续 §f" + contCnt + " §7天   §a累计 §f" + totalCnt + " §7次\n\n" +
            "§7── 本月奖励一览 ──\n" +
            rewardText + "\n\n" +
            (canSign
                ? "§a▶ 点击按钮立即签到并领取今日奖励！"
                : "§7今日已完成签到，明天再来吧~")
        );
        if (canSign) fm.addButton("§l§a立即签到", "textures/items/emerald");
        else         fm.addButton("§8§l今日已签到", "textures/ui/confirm");

        player.sendForm(fm, function (pl, id) {
            if (id == null) return;
            if (!canSign) {
                pl.tell(_info + "§e今日签到已完成，明天 §6" + Sign.todayStr().slice(0,7) + "§e 继续哦~");
                return;
            }
            var todayReward = rewardList[today - 1];
            giveReward(pl, todayReward);
            Sign.clockIn(pl);
            checkAddition(pl);
            var isFirst = Sign.getCount(pl) === 1;
            if (isFirst)
                pl.tell(_info + "§a§l签到成功！§r §e欢迎首次打卡 ✦  今日奖励：§f" + todayReward.name);
            else
                pl.tell(_info + "§a§l签到成功！§r §e连续打卡 §6§l" + Sign.getContSign(pl) + "§r§e 天 ✦  今日奖励：§f" + todayReward.name);
        });
    }

    // ════════════════════════════════════════════════════════════
    // GUI - 管理主菜单
    // ════════════════════════════════════════════════════════════
    function openSetMain(player) {
        var fm = mc.newSimpleForm();
        fm.setTitle("§l§3签到管理后台");
        fm.setContent("§7当前服务器签到系统配置中心，请选择要管理的模块：");
        fm.addButton("§e§l经济参数查看\n§8查看当前经济模式与计分板", "textures/items/gold_ingot");
        fm.addButton("§a§l签到参数设置\n§8开关、随机范围、列数", "textures/ui/settings_glyph_color_2x");
        fm.addButton("§6§l每日奖励序列\n§8配置每天的签到奖励", "textures/ui/recipe_book_icon");
        fm.addButton("§d§l奖励物品库\n§8管理可用的物品奖励列表", "textures/blocks/chest_front");
        fm.addButton("§b§l连续签到奖励\n§8设置连续打卡里程碑奖励", "textures/items/diamond");
        player.sendForm(fm, function (pl, id) {
            if (id == null) return;
            if (id === 0) openMoneyView(pl);
            else if (id === 1) openSignParamSet(pl);
            else if (id === 2) openDailyRewardSet(pl);
            else if (id === 3) openItemLibSet(pl);
            else if (id === 4) openAdditionSet(pl);
        });
    }

    // ════════════════════════════════════════════════════════════
    // GUI - 经济查看（只读，由 YEssential 主配置统一管理）
    // ════════════════════════════════════════════════════════════
    function openMoneyView(player) {
        var sb   = _eco ? _eco.scoreboard : "money";
        var mode = _eco ? _eco.mode       : "scoreboard";
        var coin = Money.coinName();
        var fm   = mc.newCustomForm();
        fm.setTitle("§l§e经济参数概览");
        fm.addLabel("§e当前经济模式  §f" + mode);
        fm.addLabel("§e计分板名称    §f" + sb);
        fm.addLabel("§e货币单位名称  §f" + coin);
        fm.addLabel("§7以上参数在 YEssential 主配置 Economy 块统一管理，此处仅供查看。");
        player.sendForm(fm, function (pl, id) {
            if (id == null) openSetMain(pl);
        });
    }

    // ════════════════════════════════════════════════════════════
    // GUI - 签到参数设置
    // ════════════════════════════════════════════════════════════
    function openSignParamSet(player, errMsg) {
        var signCfg   = Config.getSign();
        var randMoney = Config.getRandomMoney();
        var randExp   = Config.getRandomExp();

        var fm = mc.newCustomForm();
        fm.setTitle("§l§a签到参数设置");
        fm.addSwitch("§l签到功能总开关§r §7(当前: " + (signCfg.switch ? "§a开启" : "§c关闭") + "§7)", signCfg.switch);
        fm.addLabel("§6§l随机金币范围");
        fm.addInput("§e最小值§7 (当前: " + randMoney.min_money + ")", "例如: 1000");
        fm.addInput("§e最大值§7 (当前: " + randMoney.max_money + ")", "例如: 10000");
        fm.addLabel("§b§l随机经验范围");
        fm.addInput("§3最小值§7 (当前: " + randExp.min_exp + ")", "例如: 100");
        fm.addInput("§3最大值§7 (当前: " + randExp.max_exp + ")", "例如: 1000");
        fm.addLabel("§d§l界面布局");
        fm.addInput("§5每行列数§7 (当前: " + signCfg.gui_arrange + "，范围 1~10)", "例如: 3");
        if (errMsg) fm.addLabel("\n" + errMsg);

        player.sendForm(fm, function (pl, id) {
            if (id == null) { openSetMain(pl); return; }

            function parseNum(raw, cur, min, max, label) {
                if (raw === "") return cur;
                var n = Number(raw);
                if (isNaN(n) || n < min || n > max)
                    throw new Error(label + " 必须是 " + min + "~" + max + " 之间的整数");
                return n;
            }
            try {
                // 修复：CustomForm 的 addLabel 也会在返回数组中占用一个索引位（值为 null），
                // 表单结构为：[0]开关 [1]label [2]最小值 [3]最大值 [4]label [5]最小值(经验) [6]最大值(经验) [7]label [8]列数
                // 原代码未跳过 label 造成索引全部错位，读到的其实是 label 对应的 null，导致数值校验必错。
                var sw  = id[0];
                var mn  = parseNum(id[2], randMoney.min_money, 1, 1000000, "随机金币最小值");
                var mx  = parseNum(id[3], randMoney.max_money, 1, 1000000, "随机金币最大值");
                var en  = parseNum(id[5], randExp.min_exp,     1, 10000,   "随机经验最小值");
                var ex  = parseNum(id[6], randExp.max_exp,     1, 10000,   "随机经验最大值");
                var ga  = parseNum(id[8], signCfg.gui_arrange, 1, 10,      "列数");
                if (mn > mx) throw new Error("随机金币最小值不能大于最大值");
                if (en > ex) throw new Error("随机经验最小值不能大于最大值");
                Config.set({
                    sign:         { switch: sw, gui_arrange: ga },
                    random_money: { min_money: mn, max_money: mx },
                    random_exp:   { min_exp:   en, max_exp:   ex }
                });
                openSignParamSet(pl, "§a✔ 修改成功");
            } catch (err) {
                openSignParamSet(pl, "§c✘ " + err.message);
            }
        });
    }

    // ════════════════════════════════════════════════════════════
    // GUI - 每日奖励序列设置
    // ════════════════════════════════════════════════════════════
    function openDailyRewardSet(player, errMsg, modeHint) {
        var rewardCfg  = Config.getReward();
        var itemLib    = Reward.getItems();
        var self       = Reward;

        var rewardNames = rewardCfg.map(function (r, i) {
            return "第" + (i + 1) + "天  " + self.parse(r).name;
        });
        var itemNames = itemLib.map(function (s, i) {
            try { var it = mc.newItem(NBT.parseSNBT(s)); return (i + 1) + ". " + itemZhName(it) + " x" + it.count; }
            catch (e) { return (i + 1) + ". (物品" + (i + 1) + ")"; }
        });

        var fm = mc.newCustomForm();
        fm.setTitle("§l§6每日奖励序列");
        fm.addLabel("§7当前共 §f" + rewardCfg.length + " §7项奖励（循环覆盖整月）");
        fm.addDropdown("§l操作模式", ["✚ 添加", "✖ 删除", "✎ 修改"], modeHint || 0);
        fm.addDropdown("§e序列位置§7 (删除/修改时生效)", rewardNames);
        fm.addDropdown("§e奖励类型§7 (添加/修改时生效)",
            ["随机物品", "随机" + Money.coinName(), "随机经验", "指定物品", "指定" + Money.coinName(), "指定经验"]);
        fm.addDropdown("§e选择物品§7 (类型为指定物品时生效)", itemNames.length ? itemNames : ["(物品库为空)"]);
        fm.addInput("§e" + Money.coinName() + "/经验数量§7 (类型为指定金币/经验时生效，留空默认100)", "例如: 500");
        if (errMsg) fm.addLabel("\n" + errMsg);

        player.sendForm(fm, function (pl, id) {
            if (id == null) { openSetMain(pl); return; }
            // 修复：同奖励物品库设置一样，开头的 addLabel 占用了 id[0]（值为 null），
            // 真实顺序为 [0]label [1]操作模式 [2]序列位置 [3]奖励类型 [4]选择物品 [5]数量。
            var mode  = id[1];
            var pos   = id[2];
            var type  = id[3];

            function buildToken() {
                if (type === 0) return "random_item";
                if (type === 1) return "random_money";
                if (type === 2) return "random_exp";
                if (type === 3) return "item_" + (Number(id[4]) + 1);
                var amt = (id[5] === "" || isNaN(id[5])) ? 100 : Number(id[5]);
                return type === 4 ? "money_" + amt : "exp_" + amt;
            }

            var token = buildToken();
            if (mode === 0) {
                rewardCfg.push(token);
            } else if (mode === 1) {
                if (rewardCfg.length <= 1) { openDailyRewardSet(pl, "§c✘ 至少保留一项奖励", mode); return; }
                rewardCfg.splice(pos, 1);
            } else {
                rewardCfg.splice(pos, 1, token);
            }
            Config.set({ reward: rewardCfg });
            openDailyRewardSet(pl, "§a✔ 操作成功", mode);
        });
    }

    // ════════════════════════════════════════════════════════════
    // GUI - 奖励物品库设置
    // ════════════════════════════════════════════════════════════
    function openItemLibSet(player, errMsg, modeHint) {
        var itemLib = Reward.getItems();
        var itemNames = itemLib.map(function (s, i) {
            try { var it = mc.newItem(NBT.parseSNBT(s)); return (i + 1) + ". " + itemZhName(it) + " x" + it.count; }
            catch (e) { return (i + 1) + ". (物品" + (i + 1) + ")"; }
        });

        var inv      = player.getInventory().getAllItems();
        var invItems = [];
        var invIndex = [];
        for (var i = 0; i < inv.length; i++) {
            if (inv[i] && inv[i].name !== "") {
                invItems.push(itemZhName(inv[i]) + " x" + inv[i].count);
                invIndex.push(i);
            }
        }

        var fm = mc.newCustomForm();
        fm.setTitle("§l§d奖励物品库");
        fm.addLabel("§7当前物品库共 §f" + itemLib.length + " §7种物品\n§e添加/修改时将从背包中选取物品");
        fm.addDropdown("§l操作模式", ["✚ 添加", "✖ 删除", "✎ 修改"], modeHint || 0);
        fm.addDropdown("§e物品库选择§7 (删除/修改时生效)", itemNames.length ? itemNames : ["(物品库为空)"]);
        fm.addDropdown("§e背包物品§7 (添加/修改时生效)", invItems.length ? invItems : ["(背包为空)"]);
        fm.addInput("§e设置数量§7 (留空则使用背包实际数量，最大 64)", "例如: 32");
        if (errMsg) fm.addLabel("\n" + errMsg);

        player.sendForm(fm, function (pl, id) {
            if (id == null) { openSetMain(pl); return; }
            // 修复：表单首位是 addLabel（§7当前物品库...），会占用返回数组的 id[0]（值为 null），
            // 真正的控件顺序是 [0]label [1]操作模式 [2]物品库选择 [3]背包物品 [4]设置数量。
            // 原代码把 id[0] 当作 mode、id[2] 当作背包选择、id[3] 当作数量，全部整体错了一位，
            // 导致选到的背包物品/数量都是错的，写入的物品库自然“无法生效”。
            var mode = id[1];
            if (invItems.length === 0 && mode !== 1) {
                openItemLibSet(pl, "§c✘ 背包为空，无法添加或修改", mode); return;
            }
            var selItem = inv[invIndex[id[3]]];
            var count   = 1;
            if (selItem) {
                count = (id[4] === "" || isNaN(id[4])) ? selItem.count : Math.min(Math.max(1, Number(id[4])), 64);
            }

            function makeSnbt() {
                return selItem.getNbt().setByte("Count", count).toSNBT();
            }

            if (mode === 0) {
                itemLib.push(makeSnbt());
            } else if (mode === 1) {
                if (itemLib.length <= 1) { openItemLibSet(pl, "§c✘ 至少保留一种物品", mode); return; }
                itemLib.splice(id[2], 1);
            } else {
                itemLib.splice(id[2], 1, makeSnbt());
            }
            reward_data.write(JSON.stringify(itemLib, null, 4));
            openItemLibSet(pl, "§a✔ 操作成功", mode);
        });
    }

    // ════════════════════════════════════════════════════════════
    // GUI - 连续签到附加奖励设置
    // ════════════════════════════════════════════════════════════
    function openAdditionSet(player, errMsg, modeHint) {
        var addition = Config.getAddition() || {};
        var itemLib  = Reward.getItems();
        var itemNames = itemLib.map(function (s, i) {
            try { var it = mc.newItem(NBT.parseSNBT(s)); return (i + 1) + ". " + itemZhName(it) + " x" + it.count; }
            catch (e) { return (i + 1) + ". (物品" + (i + 1) + ")"; }
        });

        var addKeys = Object.keys(addition).sort(function (a, b) { return Number(a) - Number(b); });
        var listText = "§l当前连续签到里程碑奖励：§r\n";
        if (addKeys.length === 0) {
            listText += "§7  (暂未配置)\n";
        } else {
            for (var i = 0; i < addKeys.length; i++) {
                listText += "  §6第 §e§l" + addKeys[i] + "§r§6 天  §f➜  §a" + Reward.parse(addition[addKeys[i]]).name + "\n";
            }
        }
        listText += "";

        var fm = mc.newCustomForm();
        fm.setTitle("§l§b连续签到附加奖励");
        fm.addLabel(listText);
        fm.addDropdown("§l操作模式", ["✚ 添加/修改", "✖ 删除"], modeHint || 0);
        fm.addInput("§e目标天数§7 (1~365，到达该天数时触发)", "例如: 7");
        fm.addDropdown("§e奖励类型§7 (添加/修改时生效)",
            ["随机物品", "随机" + Money.coinName(), "随机经验", "指定物品", "指定" + Money.coinName(), "指定经验"]);
        fm.addDropdown("§e选择物品§7 (类型为指定物品时生效)", itemNames.length ? itemNames : ["(物品库为空)"]);
        fm.addInput("§e" + Money.coinName() + "/经验数量§7 (留空默认100)", "例如: 1000");
        if (errMsg) fm.addLabel("\n" + errMsg);

        player.sendForm(fm, function (pl, id) {
            if (id == null) { openSetMain(pl); return; }
            // 修复：同奖励物品库/每日奖励序列一样，开头的 addLabel 占用了 id[0]（值为 null），
            // 真实顺序为 [0]label [1]操作模式 [2]目标天数 [3]奖励类型 [4]选择物品 [5]数量。
            // 原代码整体少读一位：id[1] 拿到的是下拉框返回的数字，调 .trim() 抛 "not a function"
            // 导致提交必崩；且 id[0] 恒为 null，删除模式永远进不去。
            var mode   = id[1];
            var dayStr = String(id[2]).trim();
            var day    = Number(dayStr);
            if (dayStr === "" || isNaN(day) || day < 1 || day > 365) {
                openAdditionSet(pl, "§c✘ 目标天数必须是 1~365 之间的整数", mode); return;
            }
            var key = String(day);
            if (mode === 1) {
                delete addition[key];
            } else {
                var type  = id[3];
                var token;
                if (type === 0)      token = "random_item";
                else if (type === 1) token = "random_money";
                else if (type === 2) token = "random_exp";
                else if (type === 3) token = "item_" + (Number(id[4]) + 1);
                else {
                    var amtStr = String(id[5]).trim();
                    var amt    = (amtStr === "" || isNaN(amtStr)) ? 100 : Number(amtStr);
                    token      = type === 4 ? "money_" + amt : "exp_" + amt;
                }
                addition[key] = token;
            }
            Config.set({ addition: addition });
            openAdditionSet(pl, "§a✔ 操作成功", mode);
        });
    }

    // ════════════════════════════════════════════════════════════
    // 命令注册
    // ════════════════════════════════════════════════════════════
    var signCmd = mc.newCommand("sign", "打开签到界面", PermType.Any);
    signCmd.overload([]);
    signCmd.setCallback(function (_cmd, ori, out) {
        if (ori.type === 7) { out.error(_info + "§c请在游戏内执行 /sign 命令，不支持控制台"); return; }
        if (!ori.player)    return;
        if (!Config.getSign().switch) { ori.player.tell(_info + "§7签到功能当前已关闭"); return; }
        openSignForm(ori.player);
    });
    signCmd.setup();

    var setCmd = mc.newCommand("signset", "签到管理设置", PermType.GameMasters);
    setCmd.overload([]);
    setCmd.setCallback(function (_cmd, ori, out) {
        if (!ori.player) { out.error(_info + "§c请在游戏内执行此命令"); return; }
        openSetMain(ori.player);
    });
    setCmd.setup();

    // ════════════════════════════════════════════════════════════
    // 事件监听
    // ════════════════════════════════════════════════════════════
    mc.listen("onJoin", function (player) {
        if (!Config.getSign().switch) return;
        var neverSigned = Sign.getCount(player) === 0;
        var needSign    = Sign.timeDiff(player) > 0;
        if (neverSigned || needSign) {
            setTimeout(function () {
                var pl = mc.getPlayer(player.xuid);
                if (pl) openSignForm(pl);
            }, 3000);
        }
    });

    mc.listen("onChat", function (player, msg) {
        if (!/^签到$/.test(msg)) return;
        if (!Config.getSign().switch) { player.tell(_info + "§7签到功能当前已关闭"); return; }
        openSignForm(player);
    });

}