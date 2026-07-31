// LiteLoader-AIDS automatic generated
// v2.8.1 - 修复钟表无反应：事件名错误/平台过滤/mode死代码/孤立字符

// ==================== 常量定义 ====================
const info = globalThis.info || "§l§6[-YEST-] §r";
const MENU_CONFIG = {
    configPath: "./plugins/YEssential/Config/Cd/Config.json",
    menusPath:  "./plugins/YEssential/data/Menus/",
    prefix:     "§e§l[菜单] §r"
};

// ==================== 全局状态 ====================

const menuPendingThisTick = new Set();

// ==================== 配置管理器 ====================
class MenuConfigManager {
    constructor() {
        this.ensureDirectory();
        this.configFile = new JsonConfigFile(MENU_CONFIG.configPath, "{}");
        // 模块缓存，TTL 3000ms
        this._cache = (globalThis.CachePool
            ? globalThis.CachePool.createModuleCache(3000)
            : null);
        this._CACHE_KEY = "cd_menu_cfg";
    }

    ensureDirectory() {
        const dataDir  = "./plugins/YEssential/data/";
        const menusDir = MENU_CONFIG.menusPath;
        if (!File.exists(dataDir))  File.createDir(dataDir);
        if (!File.exists(menusDir)) File.createDir(menusDir);
    }

    get() {
        // 优先走缓存
        if (this._cache) {
            let v = this._cache.get(this._CACHE_KEY);
            if (v !== undefined) return v;
        }
        // 缓存 miss：读磁盘
        this.configFile.reload();
        const content = this.configFile.read();
        const result = content ? JSON.parse(content) : {};
        if (this._cache) this._cache.set(this._CACHE_KEY, result);
        return result;
    }

    set(data) {
        Object.keys(data).forEach(key => this.configFile.set(key, data[key]));
        // 写入后立即失效缓存，保证下次读取是最新值
        if (this._cache) this._cache.invalidate(this._CACHE_KEY);
    }

    getMoney()            { return this.get().money; }
    getScore()            { return this.get().score; }
    getItems()            { return this.get().items || []; }
    getMain()             { return this.get().main; }
    getShield()           { return this.get().shield || []; }
    getItemsTriggerMode() { return this.get().itemsTriggerMode; }
    getUseDogeUI()        { return this.get().UseDogeUI === 1; }

    validate() {
        const cur = this.get();
        const defaults = {
            money: 0, score: "money",
            items: ["minecraft:clock"],
            itemsTriggerMode: 0, main: "main", shield: [],
            UseDogeUI: 0
        };
        const patch = {};
        if (![0, 1].includes(cur.money))               patch.money = defaults.money;
        if (![0, 1, 2].includes(cur.itemsTriggerMode)) patch.itemsTriggerMode = defaults.itemsTriggerMode;
        if (typeof cur.score !== "string")             patch.score = defaults.score;
        if (typeof cur.main  !== "string")             patch.main  = defaults.main;
        if (!(cur.items instanceof Array) || !cur.items.every(i => typeof i === "string"))
            patch.items = defaults.items;
        if (!(cur.shield instanceof Array) || !cur.shield.every(i => typeof i === "string"))
            patch.shield = defaults.shield;
        if (![0, 1].includes(cur.UseDogeUI))           patch.UseDogeUI = defaults.UseDogeUI;
        if (Object.keys(patch).length > 0) this.set(patch);
    }
}

// ==================== 工具函数 ====================
class MenuUtils {
    static isValidFileName(str) {
        return /^[A-Za-z0-9]+$/.test(str) && str.length >= 1 && str.length <= 20;
    }

    static getMenuFiles(excludeMain) {
        if (!File.exists(MENU_CONFIG.menusPath)) return [];
        let files = File.getFilesList(MENU_CONFIG.menusPath);
        if (excludeMain === true) {
            const mainFile = menuConfig.getMain() + ".json";
            files = files.filter(f => f !== mainFile);
        }
        return files;
    }
}

// ==================== 经济系统 ====================
class MenuEconomyManager {
    static get(player) {
        if (!menuConfig.getMoney()) return Number(player.getScore(menuConfig.getScore()));
        if (typeof money !== "undefined") return Number(money.get(player.xuid));
        return 0;
    }

    static add(player, amount) {
        if (!menuConfig.getMoney()) return player.addScore(menuConfig.getScore(), Number(amount));
        if (typeof money !== "undefined") return money.add(player.xuid, Number(amount));
        return false;
    }

    static reduce(player, amount) {
        if (!menuConfig.getMoney()) return player.reduceScore(menuConfig.getScore(), Number(amount));
        if (typeof money !== "undefined") return money.reduce(player.xuid, Number(amount));
        return false;
    }
}

// ==================== 菜单数据管理器 ====================
// MenuDataManager 专用缓存：TTL 2000ms，避免 showAddSubMenu 等批量调用多次读磁盘
const _menuDataCache = Object.create(null);  // { fileName: { data, expiry } }
const MENU_CACHE_TTL = 2000;

class MenuDataManager {
    static getDefaultMainMenu() {
        return {
            title: "服务器菜单", content: "选择:",
            buttons: [
                { images: true,  image: "textures/items/apple", money: 0, text: "获取一个苹果", command: "give @s apple", type: "comm" },
                { images: false, image: "textures/items/apple", money: 0, text: "发送一句你好",  command: "msg @a 你好",   type: "comm" },
                { images: false, image: "textures/items/apple", money: 0, text: "管理员菜单",   command: "admin",        type: "form", oplist: [] }
            ]
        };
    }

    static getDefaultAdminMenu() {
        return {
            title: "管理员菜单", content: "选择:",
            buttons: [
                { images: false, image: "textures/items/apple", money: 0, text: "菜单设置", command: "cd set", type: "comm", oplist: [] },
                { images: false, image: "textures/items/apple", money: 0, text: "返回",     command: "main",   type: "form", oplist: [] }
            ]
        };
    }

    static getDefaultSubMenu() {
        return {
            title: "初始菜单", content: "选择:",
            buttons: [{ images: true, image: "textures/items/apple", money: 0, text: "返回", command: "main", type: "form" }]
        };
    }

    static getMenu(fileName) {
        if (!fileName.includes(".json")) fileName += ".json";
        const now = Date.now();
        const cached = _menuDataCache[fileName];
        if (cached && now < cached.expiry) return cached.data;
        // 缓存 miss：读磁盘
        const menuFile = new JsonConfigFile(
            MENU_CONFIG.menusPath + fileName,
            JSON.stringify(this.getDefaultSubMenu())
        );
        const data = JSON.parse(menuFile.read());
        _menuDataCache[fileName] = { data, expiry: now + MENU_CACHE_TTL };
        return data;
    }

    static setMenu(fileName, data) {
        if (!fileName.includes(".json")) fileName += ".json";
        // 统一用 File.writeTo，与 addButton/deleteButton/updateButton 保持一致
        File.writeTo(MENU_CONFIG.menusPath + fileName, JSON.stringify(data, null, 4));
        // 写入后立即失效缓存
        delete _menuDataCache[fileName];
    }

    static deleteMenu(fileName) {
        if (!fileName.includes(".json")) fileName += ".json";
        if (File.exists(MENU_CONFIG.menusPath + fileName))
            File.delete(MENU_CONFIG.menusPath + fileName);
        delete _menuDataCache[fileName];
    }

    static removeOrphanButtons(deletedFileName) {
        const target = deletedFileName.replace(".json", "");
        if (!File.exists(MENU_CONFIG.menusPath)) return;
        let files = File.getFilesList(MENU_CONFIG.menusPath);
        files.forEach(function(f) {
            const menuData = MenuDataManager.getMenu(f);
            if (!menuData || !menuData.buttons) return;
            const before = menuData.buttons.length;
            menuData.buttons = menuData.buttons.filter(function(btn) {
                return !((btn.type === "form" || btn.type === "opfm") && btn.command === target);
            });
            if (menuData.buttons.length !== before) {
                File.writeTo(MENU_CONFIG.menusPath + f, JSON.stringify(menuData, null, 4));
            }
        });
    }

    static addButton(fileName, button, index) {
        if (!fileName.includes(".json")) fileName += ".json";
        const menuData = this.getMenu(fileName);
        if (index == null || index === "") menuData.buttons.push(button);
        else menuData.buttons.splice(index, 0, button);
        File.writeTo(MENU_CONFIG.menusPath + fileName, JSON.stringify(menuData, null, 4));
        delete _menuDataCache[fileName];
    }

    static deleteButton(fileName, buttonIndex) {
        if (!fileName.includes(".json")) fileName += ".json";
        const menuData = this.getMenu(fileName);
        if (buttonIndex >= 0 && buttonIndex < menuData.buttons.length) {
            menuData.buttons.splice(buttonIndex, 1);
            File.writeTo(MENU_CONFIG.menusPath + fileName, JSON.stringify(menuData, null, 4));
            delete _menuDataCache[fileName];
            return true;
        }
        return false;
    }

    static updateButton(fileName, buttonIndex, newButton) {
        if (!fileName.includes(".json")) fileName += ".json";
        const menuData = this.getMenu(fileName);
        if (buttonIndex >= 0 && buttonIndex < menuData.buttons.length) {
            menuData.buttons[buttonIndex] = newButton;
            File.writeTo(MENU_CONFIG.menusPath + fileName, JSON.stringify(menuData, null, 4));
            delete _menuDataCache[fileName];
            return true;
        }
        return false;
    }

    static filterButtonsForPlayer(player, menuData) {
        // 返回新对象，不修改传入引用（避免缓存污染）
        return {
            ...menuData,
            buttons: menuData.buttons.filter(function(button) {
                if (button.type === "vipfm" || button.type === "vipcm") return false;
                if (!player.isOP() && (button.type === "opfm" || button.type === "opcm")) return false;
                return true;
            })
        };
    }

    static initializeAdminMenu() {
        if (!File.exists(MENU_CONFIG.menusPath + "admin.json"))
            this.setMenu("admin", this.getDefaultAdminMenu());
    }
}

// ==================== 玩家菜单交互 ====================
class MenuPlayerHandler {
    static showMenu(player, fileName) {
        let menuData = MenuDataManager.getMenu(fileName);
        menuData = MenuDataManager.filterButtonsForPlayer(player, menuData);

        if (!menuData.title || !menuData.content || !menuData.buttons) {
            player.tell(info + "菜单配置错误", 5); return;
        }
        if (menuData.buttons.length === 0) {
            player.tell(info + "菜单按钮为空", 5); return;
        }
        const form = mc.newSimpleForm();
        // DogeUI 判断：UseDogeUI=1 且当前是主菜单时，使用 /D 前缀格式由客户端渲染广告图
        if (menuConfig.getUseDogeUI() && fileName === menuConfig.getMain()) {
            form.setTitle("/D textures/menu/ad/1");
        } else {
            form.setTitle(menuData.title);
        }
        form.setContent(menuData.content);
        menuData.buttons.forEach(function(button) {
            form.addButton(button.text, button.images ? button.image : "");
        });

        const self = this;
        player.sendForm(form, function(pl, id) {
            if (id == null) return;
            if (id >= 0 && id < menuData.buttons.length)
                self.handleButtonClick(player, menuData.buttons[id], fileName);
        });
    }

    static handleButtonClick(player, button, currentMenu) {
        const requiredMoney = Number(button.money);
        if (requiredMoney > 0 && MenuEconomyManager.get(player) < requiredMoney) {
            player.tell(info + "金币不足", 5);
            this.showMenu(player, currentMenu);
            return;
        }
        switch (button.type) {
            case "form": this.showMenu(player, button.command); break;
            case "opfm": this.handleOpForm(player, button, currentMenu); break;
            case "comm": this.executeCommand(player, button.command); break;
            case "opcm": this.handleOpCommand(player, button, currentMenu); break;
            default:
                this.showMenu(player, currentMenu);
                player.tell(info + "按钮类型错误", 5);
                return;
        }
        if (requiredMoney > 0) MenuEconomyManager.reduce(player, requiredMoney);
    }

    static handleOpForm(player, button, currentMenu) {
        if (!player.isOP()) {
            this.showMenu(player, currentMenu);
            player.tell(info + "权限不足", 5);
            return;
        }
        this.showMenu(player, button.command);
    }

    static handleOpCommand(player, button, currentMenu) {
        if (!player.isOP()) {
            this.showMenu(player, currentMenu);
            player.tell(info + "权限不足", 5);
            return;
        }
        this.executeCommand(player, button.command);
    }

    static executeCommand(player, command) {
        // 命令含 @s 且玩家非 OP 时：以控制台身份执行，并把 @s 替换为玩家名。
        // 这样普通玩家也能通过菜单触发受权限保护的原版命令（tag / scoreboard / effect 等），
        // 无需给玩家发 OP。注意不能用 mc.runcmdEx 直接跑带 @s 的命令——
        // 控制台身份下 @s 无执行对象，命令会失败，必须先替换成具体玩家名。
        //
        // 其余情况走 player.runcmd()，以玩家身份执行，可触发插件注册的命令（home、warp、pland 等），
        // 这类命令在 mc.runcmdEx 下无响应。
        // 参考 LSE API: https://lse.levimc.org/apis/GameAPI/Command/
        if (command.includes("@s") && !player.isOP()) {
            mc.runcmdEx(command.replace(/@s/g, player.realName));
        } else {
            player.runcmd(command);
        }
    }
}

// ==================== 实例初始化 ====================
const menuConfig = new MenuConfigManager();
menuConfig.validate();
MenuDataManager.initializeAdminMenu();

// ==================== 指令注册 ====================
function registerCommands() {
    const cdCmd = mc.newCommand("cd", "菜单系统", PermType.Any);
    cdCmd.setAlias("menu");

    cdCmd.setEnum("SetAction", ["set"]);
    cdCmd.setEnum("StrAction", ["add", "del", "open"]);

    cdCmd.mandatory("setAction", ParamType.Enum, "SetAction", 1);
    cdCmd.mandatory("strAction", ParamType.Enum, "StrAction", 1);
    cdCmd.mandatory("name", ParamType.String);

    cdCmd.overload([]);                      
    cdCmd.overload(["setAction"]);           
    cdCmd.overload(["strAction", "name"]);   

    cdCmd.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return;

        const action = res.setAction || res.strAction || "";
        const target = res.name || "";

        switch (action) {
            case "set":
                if (!pl.isOP()) return pl.tell(info + "权限不足");
                MenuAdminHandler.showMainSettings(pl);
                break;

            case "add":
                if (!pl.isOP()) return pl.tell(info + "权限不足");
                MenuAdminHandler.showAddMenu(pl, target);
                break;

            case "del":
                if (!pl.isOP()) return pl.tell(info + "权限不足");
                MenuAdminHandler.showDeleteMenu(pl, target);
                break;

            case "open":
                if (!pl.isOP()) return pl.tell(info + "权限不足");
                // 与 /cd add 保持一致，防止路径穿越（如 ../Config/Cd/Config）
                if (!MenuUtils.isValidFileName(target)) { pl.tell(info + "文件名不合法"); return; }
                MenuPlayerHandler.showMenu(pl, target);
                break;

            default:
                MenuPlayerHandler.showMenu(pl, menuConfig.getMain());
                break;
        }
    });

    cdCmd.setup();
}
// ==================== 获取钟表 ====================
const CLOCK_CLAIMED_PATH = MENU_CONFIG.menusPath + "PlayerSet/getclock_claimed.json";

function ensureClockDir() {
    const dir = MENU_CONFIG.menusPath + "PlayerSet/";
    if (!File.exists(dir)) File.createDir(dir);
}

// 启动时一次性读入内存，避免每次 onJoin 都读磁盘（O(n) → O(1)）
// LSE Player API: xuid 是 String，Set.has() 是 O(1)
let _claimedSet = null;
function getClaimedSet() {
    if (_claimedSet !== null) return _claimedSet;
    ensureClockDir();
    try {
        if (!File.exists(CLOCK_CLAIMED_PATH)) {
            File.writeTo(CLOCK_CLAIMED_PATH, "[]");
            _claimedSet = new Set();
        } else {
            const parsed = JSON.parse(File.readFrom(CLOCK_CLAIMED_PATH));
            _claimedSet = new Set(Array.isArray(parsed) ? parsed : []);
        }
    } catch(e) {
        _claimedSet = new Set();
    }
    return _claimedSet;
}

function hasClaimed(xuid)  { return getClaimedSet().has(xuid); }

function markClaimed(xuid) {
    const set = getClaimedSet();
    if (set.has(xuid)) return;
    set.add(xuid);
    File.writeTo(CLOCK_CLAIMED_PATH, JSON.stringify([...set]));
}

function giveClock(player, isJoin) {
    const clockItem = mc.newItem("minecraft:clock", 1);
    if (!clockItem) { player.tell(info + CachePool.lang("cd.clock.create.fail")); return; }
    // 锁定该物品，防止在背包/容器界面被移动或丢弃
    const clockNbt = clockItem.getNbt();
    clockNbt.setTag("tag", (clockNbt.getTag("tag") ?? new NbtCompound())
        .setByte("minecraft:item_lock", 2));
    clockItem.setNbt(clockNbt);
    const msg     = CachePool.lang(isJoin ? "cd.clock.join.got"  : "cd.clock.manual.got");
    const msgFull = CachePool.lang(isJoin ? "cd.clock.join.full" : "cd.clock.manual.full");
    if (!player.getInventory().hasRoomFor(clockItem)) {
        // 背包已满：不强制丢在地上，提示玩家自己腾出空间后重新领取（进服触发的也不占用领取次数，方便之后手动 /getclock）
        player.tell(info + msgFull);
        return;
    }
    player.giveItem(clockItem);
    player.refreshItems();
    player.tell(info + msg);
    markClaimed(player.xuid);
}

function registerClockCommand() {
    const cmd = mc.newCommand("getclock", "获取钟表（每人限领一次）", PermType.Any);
    cmd.overload([]);
    cmd.setCallback((_cmd, ori, out) => {
        if (!ori.player) { out.error(CachePool.lang("cd.clock.no.console")); return; }
        const player = ori.player;
        if (hasClaimed(player.xuid)) { player.tell(info + CachePool.lang("cd.clock.already")); return; }
        giveClock(player, false);
    });
    cmd.setup();
}

function hasClockInInventory(player) {
    const items = player.getInventory().getAllItems();
    return items.some(item => item && item.type === "minecraft:clock");
}
function registerClockJoinEvent() {
    mc.listen("onJoin", (player) => {
        // 未领取过 且 背包里没有钟，才自动给
        if (!hasClaimed(player.xuid) && !hasClockInInventory(player)) {
            giveClock(player, true);
        }
    });
}
// ==================== 管理员设置界面 ====================
class MenuAdminHandler {
    static showMainSettings(player) {
        const form = mc.newSimpleForm();
        form.setTitle(info + "菜单设置");
        form.setContent("选择:");
        form.addButton("经济设置");
        form.addButton("添加菜单");
        form.addButton("删除菜单");
        form.addButton("修改菜单");
        form.addButton("修改其他");
        const self = this;
        player.sendForm(form, function(pl, id) {
            if (id == null) return;
            switch (id) {
                case 0: self.showMoneySettings(player); break;
                case 1: self.showAddMenu(player);       break;
                case 2: self.showDeleteMenu(player);    break;
                case 3: self.showEditMenu(player);      break;
                case 4: self.showOtherSettings(player); break;
            }
        });
    }

    static showMoneySettings(player, error, moneyType, scoreName) {
        const currentMoneyType = menuConfig.getMoney();
        const currentScore     = menuConfig.getScore();
        const form = mc.newCustomForm();
        form.setTitle("设置经济参数");
        form.addDropdown("选择经济模式---当前: " + (currentMoneyType ? "LLMoney" : "计分板"),
            ["计分板", "LLMoney"], moneyType != null ? moneyType : currentMoneyType);
        form.addInput("输入计分板项--当前: " + currentScore, "例如: money",
            scoreName != null ? scoreName : "");
        if (error) form.addLabel(error);
        const self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showMainSettings(player); return; }
            const selectedMoneyType = data[0], inputScore = data[1];
            if (selectedMoneyType === currentMoneyType && inputScore === "") {
                self.showMoneySettings(player, "§l§c你好像什么都没有操作", selectedMoneyType, inputScore);
                return;
            }
            menuConfig.set({ money: selectedMoneyType });
            if (inputScore !== "") menuConfig.set({ score: inputScore });
            player.sendModalForm("§l§2修改成功", "已保存更改经济配置", "§1返回", "§1完成",
                function(pl, btnId) {
                    if (btnId === 0) self.showMainSettings(player);
                    else self.showMoneySettings(player, "§l§2已完成更改");
                });
        });
    }

    static showAddMenu(player, type) {
        if (!type) {
            const form = mc.newSimpleForm();
            form.setTitle("添加菜单");
            form.setContent("选择操作:");
            form.addButton("添加二级菜单");
            form.addButton("添加菜单按钮");
            form.addButton("返回上级");
            const self = this;
            player.sendForm(form, function(pl, id) {
                if (id == null) return;
                if (id === 0) self.showAddMenu(player, "add_menu");
                else if (id === 1) self.showAddMenu(player, "add_button");
                else if (id === 2) self.showMainSettings(player);
            });
            return;
        }
        if (type === "add_menu")        this.showAddSubMenu(player);
        else if (type === "add_button") this.showAddButton(player);
    }

    static showAddSubMenu(player, error, formData) {
        formData = formData || {};
        const menuFiles   = MenuUtils.getMenuFiles();
        const fileOptions = menuFiles.map(f => MenuDataManager.getMenu(f).title + " | " + f);
        const form = mc.newCustomForm();
        form.setTitle("添加二级菜单");
        form.addDropdown("选择上级菜单", fileOptions, formData.parentIndex || 0);
        form.addInput("二级菜单文件名称", "例如: aaa 或 menu2", formData.fileName || "");
        form.addInput("二级菜单标题",     "例如: 二级菜单",      formData.title   || "");
        form.addInput("二级菜单提示",     "例如: 选择:",         formData.content || "");
        if (error) form.addLabel(error);
        const self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showAddMenu(player); return; }
            const parentIndex = data[0], fileName = data[1], title = data[2], content = data[3];
            if (!MenuUtils.isValidFileName(fileName)) {
                self.showAddSubMenu(player, "§l§c文件名称不合法（仅限英文字母和数字，1-20个字符）",
                    { parentIndex, fileName, title, content });
                return;
            }
            if (File.exists(MENU_CONFIG.menusPath + fileName + ".json")) {
                self.showAddSubMenu(player, "§l§c文件已存在", { parentIndex, fileName, title, content });
                return;
            }
            MenuDataManager.addButton(menuFiles[parentIndex], {
                images: true, image: "textures/items/apple", money: 0,
                text: title, command: fileName, type: "form"
            });
            MenuDataManager.setMenu(fileName, {
                title: title, content: content || "选择:",
                buttons: MenuDataManager.getDefaultSubMenu().buttons
            });
            self.showAddMenu(player, "add_menu");
            player.tell(MENU_CONFIG.prefix + "§2添加成功");
        });
    }

    static showAddButton(player, error, formData) {
        formData = formData || {};
        const menuFiles = MenuUtils.getMenuFiles();
        if (menuFiles.length === 0) {
            player.tell(MENU_CONFIG.prefix + "§c没有可用的菜单文件");
            this.showAddMenu(player); return;
        }
        const fileOptions = menuFiles.map(f => MenuDataManager.getMenu(f).title + " | " + f);
        const buttonTypes = ["玩家二级菜单", "管理员二级菜单", "玩家执行指令", "管理员执行指令"];
        const form = mc.newCustomForm();
        form.setTitle("添加菜单按钮");
        form.addDropdown("选择菜单文件",          fileOptions,  formData.fileIndex   || 0);
        form.addDropdown("选择按钮类型",          buttonTypes,  formData.buttonType  || 0);
        form.addSwitch("是否开启按钮贴图",                      formData.enableImage || false);
        form.addInput("[选填]按钮贴图地址",  "textures/items/apple", formData.imagePath  || "");
        form.addInput("[必填]按钮标题",      "例如: 说你好",          formData.buttonText || "");
        form.addInput("[必填]按钮执行的结果","例如: say @a 你好",     formData.command    || "");
        form.addInput("[选填]按钮所需金币",  "例如: 999",             formData.money      || "");
        form.addInput("[选填]按钮位置(0为首)","例如: 0",              formData.position ?? "");
        if (error) form.addLabel(error);
        const self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showAddMenu(player); return; }
            const fileIndex   = data[0], typeIndex  = data[1], enableImage = data[2],
                imagePath   = data[3], buttonText = data[4], command     = data[5],
                money       = data[6], position   = data[7];
            if (!buttonText || !command) {
                self.showAddButton(player, "§c标题和指令必填",
                    { fileIndex, buttonType: typeIndex, enableImage, imagePath, buttonText, command, money, position });
                return;
            }
            const typeMap   = ["form", "opfm", "comm", "opcm"];
            const newButton = {
                images: enableImage, image: enableImage ? (imagePath || "textures/items/apple") : "",
                money: parseInt(money) || 0, text: buttonText, command: command, type: typeMap[typeIndex]
            };
            if (typeMap[typeIndex].includes("op")) newButton.oplist = [];
            MenuDataManager.addButton(menuFiles[fileIndex], newButton,
                position !== "" ? parseInt(position) : null);
            self.showAddMenu(player, "add_button");
            player.tell(MENU_CONFIG.prefix + "§2添加成功");
        });
    }

    static showDeleteMenu(player, type) {
        if (!type) {
            const form = mc.newSimpleForm();
            form.setTitle("删除菜单");
            form.setContent("选择操作:");
            form.addButton("删除二级菜单");
            form.addButton("删除菜单按钮");
            form.addButton("返回上级");
            const self = this;
            player.sendForm(form, function(pl, id) {
                if (id == null) return;
                if (id === 0) self.showDeleteMenu(player, "del_menu");
                else if (id === 1) self.showDeleteMenu(player, "del_button");
                else if (id === 2) self.showMainSettings(player);
            });
            return;
        }

        if (type === "del_menu") {
            const files = MenuUtils.getMenuFiles(true);
            if (!files.length) {
                player.tell(MENU_CONFIG.prefix + "§c无可删除的菜单");
                this.showDeleteMenu(player); return;
            }
            const form = mc.newSimpleForm();
            form.setTitle("删除二级菜单");
            form.setContent("选择要删除的菜单:");
            files.forEach(f => form.addButton(MenuDataManager.getMenu(f).title + " | " + f));
            form.addButton("§c返回上级");
            const self = this;
            player.sendForm(form, function(pl, id) {
                if (id == null || id === files.length) { self.showDeleteMenu(player); return; }
                if (id >= 0 && id < files.length) {
                    const deleted = files[id];
                    MenuDataManager.deleteMenu(deleted);
                    MenuDataManager.removeOrphanButtons(deleted);
                    player.tell(MENU_CONFIG.prefix + "§2删除成功: " + deleted);
                    self.showDeleteMenu(player, type);
                } else { self.showDeleteMenu(player); }
            });

        } else if (type === "del_button") {
            const files = MenuUtils.getMenuFiles();
            if (!files.length) {
                player.tell(MENU_CONFIG.prefix + "§c无可用的菜单");
                this.showDeleteMenu(player); return;
            }
            const form = mc.newSimpleForm();
            form.setTitle("删除菜单按钮");
            form.setContent("选择菜单:");
            files.forEach(f => form.addButton(MenuDataManager.getMenu(f).title + " | " + f));
            form.addButton("§c返回上级");
            const self = this;
            player.sendForm(form, function(pl, fileId) {
                if (fileId == null || fileId === files.length) { self.showDeleteMenu(player); return; }
                if (fileId >= 0 && fileId < files.length) self.showDeleteButtonList(player, files[fileId]);
                else self.showDeleteMenu(player);
            });
        }
    }

    static showDeleteButtonList(player, fileName) {
        const menuData = MenuDataManager.getMenu(fileName);
        if (!menuData.buttons || menuData.buttons.length === 0) {
            player.tell(MENU_CONFIG.prefix + "§c该菜单没有按钮");
            this.showDeleteMenu(player, "del_button"); return;
        }
        const form = mc.newSimpleForm();
        form.setTitle("删除按钮 - " + menuData.title);
        form.setContent("选择要删除的按钮:");
        menuData.buttons.forEach(function(btn) {
            const t = btn.text + " [" + btn.type + "]";
            if (btn.money > 0) t += " (需" + btn.money + "金币)";
            form.addButton(t);
        });
        form.addButton("§c返回上级");
        const self = this;
        player.sendForm(form, function(pl, btnId) {
            if (btnId == null || btnId === menuData.buttons.length) {
                self.showDeleteMenu(player, "del_button"); return;
            }
            if (btnId >= 0 && btnId < menuData.buttons.length) {
                const deletedBtn = menuData.buttons[btnId];
                if (MenuDataManager.deleteButton(fileName, btnId))
                    player.tell(MENU_CONFIG.prefix + "§2删除成功: " + deletedBtn.text);
                else
                    player.tell(MENU_CONFIG.prefix + "§c删除失败");
                self.showDeleteButtonList(player, fileName);
            } else { self.showDeleteMenu(player, "del_button"); }
        });
    }

    static showEditMenu(player, type) {
        if (!type) {
            const form = mc.newSimpleForm();
            form.setTitle("修改菜单");
            form.setContent("选择操作:");
            form.addButton("修改菜单信息");
            form.addButton("修改菜单按钮");
            form.addButton("返回上级");
            const self = this;
            player.sendForm(form, function(pl, id) {
                if (id == null) return;
                if (id === 0) self.showEditMenu(player, "edit_menu");
                else if (id === 1) self.showEditMenu(player, "edit_button");
                else if (id === 2) self.showMainSettings(player);
            });
            return;
        }
        if (type === "edit_menu")        this.showEditMenuInfo(player);
        else if (type === "edit_button") this.showEditButtonSelect(player);
    }

    static showEditMenuInfo(player) {
        const files = MenuUtils.getMenuFiles();
        if (!files.length) {
            player.tell(MENU_CONFIG.prefix + "§c无可用的菜单");
            this.showEditMenu(player); return;
        }
        const form = mc.newSimpleForm();
        form.setTitle("修改菜单信息");
        form.setContent("选择要修改的菜单:");
        files.forEach(f => form.addButton(MenuDataManager.getMenu(f).title + " | " + f));
        form.addButton("§c返回上级");
        const self = this;
        player.sendForm(form, function(pl, id) {
            if (id == null || id === files.length) { self.showEditMenu(player); return; }
            if (id >= 0 && id < files.length) self.showEditMenuInfoForm(player, files[id]);
            else self.showEditMenu(player);
        });
    }

    static showEditMenuInfoForm(player, fileName, error) {
        const menuData = MenuDataManager.getMenu(fileName);
        const form = mc.newCustomForm();
        form.setTitle("修改菜单: " + fileName);
        form.addInput("菜单标题", "当前: " + menuData.title,   menuData.title);
        form.addInput("菜单内容", "当前: " + menuData.content, menuData.content);
        if (error) form.addLabel(error);
        const self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showEditMenuInfo(player); return; }
            const newTitle = data[0], newContent = data[1];
            if (!newTitle || !newContent) {
                self.showEditMenuInfoForm(player, fileName, "§c标题和内容不能为空"); return;
            }
            menuData.title = newTitle; menuData.content = newContent;
            MenuDataManager.setMenu(fileName, menuData);
            player.tell(MENU_CONFIG.prefix + "§2修改成功");
            self.showEditMenuInfo(player);
        });
    }

    static showEditButtonSelect(player) {
        const files = MenuUtils.getMenuFiles();
        if (!files.length) {
            player.tell(MENU_CONFIG.prefix + "§c无可用的菜单");
            this.showEditMenu(player); return;
        }
        const form = mc.newSimpleForm();
        form.setTitle("修改菜单按钮");
        form.setContent("选择菜单:");
        files.forEach(f => form.addButton(MenuDataManager.getMenu(f).title + " | " + f));
        form.addButton("§c返回上级");
        const self = this;
        player.sendForm(form, function(pl, id) {
            if (id == null || id === files.length) { self.showEditMenu(player); return; }
            if (id >= 0 && id < files.length) self.showEditButtonList(player, files[id]);
            else self.showEditMenu(player);
        });
    }

    static showEditButtonList(player, fileName) {
        const menuData = MenuDataManager.getMenu(fileName);
        if (!menuData.buttons || menuData.buttons.length === 0) {
            player.tell(MENU_CONFIG.prefix + "§c该菜单没有按钮");
            this.showEditButtonSelect(player); return;
        }
        const form = mc.newSimpleForm();
        form.setTitle("修改按钮 - " + menuData.title);
        form.setContent("选择要修改的按钮:");
        menuData.buttons.forEach(btn => form.addButton(btn.text + " [" + btn.type + "]"));
        form.addButton("§c返回上级");
        const self = this;
        player.sendForm(form, function(pl, btnId) {
            if (btnId == null || btnId === menuData.buttons.length) {
                self.showEditButtonSelect(player); return;
            }
            if (btnId >= 0 && btnId < menuData.buttons.length)
                self.showEditButtonForm(player, fileName, btnId);
            else self.showEditButtonSelect(player);
        });
    }

    static showEditButtonForm(player, fileName, buttonIndex, error) {
        const menuData = MenuDataManager.getMenu(fileName);
        const button   = menuData.buttons[buttonIndex];
        const typeMap     = ["form", "opfm", "comm", "opcm"];
        const buttonTypes = ["玩家二级菜单", "管理员二级菜单", "玩家执行指令", "管理员执行指令"];
        const rawType = button.type;
        if (rawType === "vipfm") rawType = "form";
        if (rawType === "vipcm") rawType = "comm";
        const currentTypeIndex = typeMap.indexOf(rawType);
        if (currentTypeIndex === -1) currentTypeIndex = 0;
        const form = mc.newCustomForm();
        form.setTitle("修改按钮: " + button.text);
        form.addDropdown("按钮类型",        buttonTypes, currentTypeIndex);
        form.addSwitch("是否开启按钮贴图",               button.images  || false);
        form.addInput("按钮贴图地址", "textures/items/apple", button.image   || "");
        form.addInput("按钮标题",     "例如: 说你好",           button.text);
        form.addInput("按钮执行的结果","例如: say @a 你好",     button.command);
        form.addInput("按钮所需金币", "例如: 999",              String(button.money || 0));
        if (error) form.addLabel(error);
        const self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showEditButtonList(player, fileName); return; }
            const typeIndex   = data[0], enableImage = data[1], imagePath  = data[2],
                buttonText  = data[3], command     = data[4], money      = data[5];
            if (!buttonText || !command) {
                self.showEditButtonForm(player, fileName, buttonIndex, "§c标题和指令不能为空"); return;
            }
            const newButton = {
                images: enableImage, image: enableImage ? (imagePath || "textures/items/apple") : "",
                money: parseInt(money) || 0, text: buttonText, command: command, type: typeMap[typeIndex]
            };
            if (typeMap[typeIndex].includes("op")) newButton.oplist = button.oplist || [];
            if (MenuDataManager.updateButton(fileName, buttonIndex, newButton))
                player.tell(MENU_CONFIG.prefix + "§2修改成功");
            else
                player.tell(MENU_CONFIG.prefix + "§c修改失败");
            self.showEditButtonList(player, fileName);
        });
    }

    static showOtherSettings(player, error) {
        const files = MenuUtils.getMenuFiles();
        const form = mc.newCustomForm();
        form.setTitle("其他设置");
        form.addDropdown("主菜单文件（当前: " + menuConfig.getMain() + "）",
            ["不修改", ...files], 0);
        if (error) form.addLabel(error);
        const self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showMainSettings(player); return; }
            if (data[0] > 0) {
                menuConfig.set({ main: files[data[0] - 1].replace(".json", "") });
                self.showOtherSettings(player, "§2修改成功");
            } else {
                self.showOtherSettings(player, "§e未做任何修改");
            }
        });
    }
}
// ==================== 事件监听 ====================
function registerEvents() {
    // 修复：原逻辑用 itemsTriggerMode（默认值 0）分别限制两个事件是否生效，
    // 但没有任何界面可以修改这个配置，导致默认情况下 onUseItem（对着空气右键）
    // 完全不会触发菜单，只有对着方块右键（onUseItemOn）才有反应，
    // 玩家反馈"钟表点了没反应"大多是这种情况。
    // 现在两个事件始终都监听，同时用 menuPendingThisTick 做 50ms 内的去重，
    // 防止同一次点击方块时 onUseItemOn/onUseItem 都触发导致菜单弹两次。
    mc.listen("onUseItemOn", (pl, item) => {
        if (menuPendingThisTick.has(pl.xuid)) return;

        const items = menuConfig.getItems();
        if (items.includes(item.type)) {
            menuPendingThisTick.add(pl.xuid);
            MenuPlayerHandler.showMenu(pl, menuConfig.getMain());
            setTimeout(() => menuPendingThisTick.delete(pl.xuid), 50);
        }
    });

    mc.listen("onUseItem", (pl, item) => {
        if (menuPendingThisTick.has(pl.xuid)) return;

        const items = menuConfig.getItems();
        if (items.includes(item.type)) {
            menuPendingThisTick.add(pl.xuid);
            MenuPlayerHandler.showMenu(pl, menuConfig.getMain());
            setTimeout(() => menuPendingThisTick.delete(pl.xuid), 50);
        }
    });
}

// ==================== 模块导出 ====================
module.exports = {
    init: function() {
        registerCommands();
        registerEvents();
        registerClockCommand(); 
        registerClockJoinEvent();
    }
};
