// ============================================================
//  I18n.js — YEssential 国际化 / 语言文件管理模块
//  由主文件通过 globalThis 注入: YEST_LangDir, langFilePath,
//  AsyncFileManager, randomGradientLog, lang
// ============================================================

// ── 默认语言内容（中文简体）──────────────────────────────────
const defaultLangContent = {
    "gui.insufficient.money.title": "§c余额不足",
    "gui.insufficient.money.content": "§f操作失败！\n您的余额不足以支付 §e${cost} ${coin}§f。\n请检查您的账户余额。",
    "gui.button.confirm": "确定",
    "gui.button.back": "返回主菜单",

    // moneys指令相关
    "moneys.set.success": "成功将玩家 ${player} 的${coin}设置为 ${amount}",
    "moneys.add.success": "成功将玩家 ${player} 的${coin}增加 ${amount}",
    "moneys.del.success": "成功将玩家 ${player} 的${coin}减少 ${amount}",
    "moneys.get.result": "玩家 ${player} 的${coin}为 ${amount}",
    "moneys.history.title": "玩家 ${player} 的${coin}历史记录",
    "moneys.command.error": "§c无效的操作！可用: set, add, del, get, history",

    // Cd相关
    "cd.config.error": "§l§c打开菜单失败,配置文件的内容没有完善",
    "cd.button.isnull": "§l§c菜单中没有任何按钮",
    "cd.yourmoney.iszero": "§l§c你没有足够的金币使用这个按钮",
    "cd.thisbutton.error": "§l§c这个按钮的类型错误,请联系管理员处理",
    "cd.vip.deny": "§l§c会员功能未启用",
    "cd.op.deny": "§l§c你没有权限使用这个按钮,抱歉",

    // 钟表领取相关
    "cd.clock.create.fail":   "§c获取钟表失败",
    "cd.clock.join.got":      "§a首次进服赠品：已获得钟，此物品每人仅限一次",
    "cd.clock.join.full":     "§e首次进服赠品：钟已掉落在你脚下（背包已满），此物品每人仅限一次",
    "cd.clock.manual.got":    "§a已获得钟表，此物品每人仅限领取一次",
    "cd.clock.manual.full":   "§e已获得钟（背包已满，已掉落在你脚下），此物品每人仅限领取一次",
    "cd.clock.already":       "§c你已经领取过了",
    "cd.clock.no.console":    "§c请不要使用命令方块或控制台执行此命令",

    // warp相关
    "warp.command.desc": "公共传送点",
    "warp.only.player": "仅限玩家执行",
    "warp.teleport.name": "传送点名称：",
    "warp.teleport.coord": "坐标：",
    "warp.teleport.cost": "传送花费：",
    "warp.teleported": "已前往传送点 ${name}",
    "warp.del.success": "删除公共传送点 ${name} 成功！",
    "warp.add.success": "添加公共传送点 ${name} 成功！",
    "warp.menu.public": "公共传送点",
    "warp.menu.public.op": "(OP)公共传送点",
    "warp.go.to": "前往传送点",
    "warp.add": "添加传送点",
    "warp.add.point": "添加公共传送点",
    "warp.del": "删除传送点",
    "warp.del.point": "删除公共传送点",
    "warp.input.name": "请输入传送点名称",
    "warp.name": "传送点名称",
    "warp.input.name.tip": "传送点名称不能重复，不能含有特殊字符",
    "warp.list": "传送点列表",
    "warp.add.point.xyz": "添加当前坐标为公共传送点",
    "warp.noinput.name": "传送点名称不能为空！",
    "warp.name.repetitive": "传送点名称已存在！",

    // 转账相关
    "money.transfer.title": "转账",
    "money.transfer.balance": "您的余额为: ${balance} ${coin}",
    "money.transfer.tax": "当前转账税率: ${rate}%",
    "money.transfer.input.amount": "输入数量或 'all'",
    "money.transfer.log.send": "转账给 ${target}, 数量:${amount}, 到账:${received}, 手续费:${tax}",
    "money.transfer.log.receive": "收到 ${sender} 转账, 数量:${amount}, 到账:${received}, 手续费:${tax}",
    "money.transfer.tax.notenough": "转账金额不足以支付手续费！",
    "money.gui.useplayer": "使用玩家的金钱菜单",
    "money.create.score": "计分板项目不存在，以为您自动创建",
    "money.callback.menu": "§a正在返回经济系统主界面...",
    "money.player.list": "排行榜",
    "moneys.help": "您的语法有误！\n/moneys <n> add \n /monneys <n> del \n /moneys <n> set",
    "money.transfer": "转账",
    "money.view": "查看",
    "money.query": "查询",
    "money.history": "历史记录(最近50条)：",
    "money.history.empty": "暂无记录",
    "money.success": "成功",
    "money.decrease.number": "请输入要减少的",
    "money.add.number": "请输入要增加的",
    "money.set.number": "请输入要设置的",
    "money.no.enough": "您的余额不足！",
    "money.tr.error1": "无效的接收方！",
    "money.tr.error2": "不能给自己转账!",
    "money.tr.noonline": "目标玩家离线",
    "money.tr.noinput": "请输入转账数量!",
    "money.tr.beizhu": "转账的备注（可以留空）",
    "money.tr.amount.tip": "输入数字或 all（全部转出），需大于0且余额充足",
    "money.tr.beizhu.tip": "备注仅收款方可见，可不填",
    "money.tr.amount": "输入转账数量(all为全部)",
    "money.del.number": "请输入减少数量!",
    "money.cannotpay.totax": "转账金额不足以支付手续费！",
    "money.setting.number": "请输入设置数量",
    "money.must.bigger0": " 转账数量必须大于0！",
    "money.must.biggerzero":" 数量必须大于0！ ",
    "money.cannot.smaller0": "§c实际到账金额不能为负数！",
    "money.op.add": "增加玩家的",
    "money.op.remove": "减少玩家的",
    "money.op.set": "设置玩家的",
    "money.op.look": "查看玩家的",
    "money.getinfo.fail": "信息获取失败!",
    "money.callback.lastgui":"返回经济系统主菜单",

    // 离线转账 - 玩家端按钮
    "money.offline.transfer.btn": "转账给离线玩家",
    "money.offline.transfer.title": "转账给离线玩家",
    "money.offline.transfer.label": "当前余额：${balance} ${coin}\n税率：${rate}%\n注意：转账后将在对方下次上线时自动到账",
    "money.offline.transfer.input.target": "目标玩家名（精确，区分大小写）",
    "money.offline.transfer.input.target.hint": "例：Steve",
    "money.offline.transfer.input.amount": "转账金额",
    "money.offline.transfer.input.amount.hint": "输入整数或 all（全部）",
    "money.offline.transfer.input.note": "备注（可选）",
    "money.offline.transfer.input.note.hint": "留空则不附加备注",
    "money.offline.transfer.input.target.tip": "玩家名区分大小写，需与游戏名精确匹配",
    "money.offline.transfer.input.amount.tip": "输入整数或 all（全部），对方上线后自动到账",
    "money.offline.transfer.input.note.tip": "备注可选，对方上线到账时可见",
    "money.offline.transfer.no.target": "请输入目标玩家名！",
    "money.offline.transfer.self": "不能转账给自己！",
    "money.offline.transfer.target.online": "该玩家当前在线，请使用【转账】功能！",
    "money.offline.transfer.confirm.title": "确认离线转账",
    "money.offline.transfer.confirm.content": "转账对象：${target}\n转出金额：${amount} ${coin}\n税费：${tax} ${coin}  (${rate}%)\n对方到账：${received} ${coin}",
    "money.offline.transfer.confirm.warn": "对方上线后才会收到金币，确认后不可撤回！",
    "money.offline.transfer.btn.confirm": "确认转账",
    "money.offline.transfer.btn.cancel": "取消",
    "money.offline.transfer.cancelled": "已取消转账。",
    "money.offline.transfer.log": "[离线转账→${target}] 转出:${amount} 税:${tax} 到账:${received}",
    "money.offline.transfer.note.suffix": " 备注: ${note}",
    "money.offline.transfer.sender.offline.tip": "（对方上线后到账）",

    // 离线操作 - OP端按钮
    "money.op.offline.btn": "对离线玩家进行金币操作",
    "money.op.offline.title": "(OP) 离线玩家金币操作",
    "money.op.offline.label": "对离线玩家的操作将在其下次上线时执行并通知。\n若目标玩家在线，请使用普通管理界面。",
    "money.op.offline.input.target": "目标玩家名（精确，区分大小写）",
    "money.op.offline.input.target.hint": "例：Steve",
    "money.op.offline.dropdown": "操作类型",
    "money.op.offline.type.add": "增加",
    "money.op.offline.type.reduce": "扣除",
    "money.op.offline.type.set": "设置为",
    "money.op.offline.input.amount": "操作金额（整数）",
    "money.op.offline.input.amount.hint": "例：100",
    "money.op.offline.input.note": "备注（可选）",
    "money.op.offline.input.target.tip": "玩家名区分大小写，需与游戏名精确匹配",
    "money.op.offline.input.amount.tip": "输入正整数，操作将在玩家下次上线时执行",
    "money.op.offline.input.note.tip": "备注可选，操作执行时会通知玩家",
    "money.op.offline.target.online": "该玩家当前在线，请使用普通 OP 管理界面！",
    "money.op.offline.confirm.title": "(OP) 确认离线操作",
    "money.op.offline.confirm.content": "目标玩家：${target} (离线)\n操作类型：${opWord}\n操作金额：${amount} ${coin}",
    "money.op.offline.confirm.tip": "操作将在玩家下次上线时执行并通知玩家。",
    "money.op.offline.cancelled": "已取消操作。",
    "money.op.offline.log": "[OP离线操作] ${opWord} ${amount} ${coin} (操作员:${admin})",
    "money.op.offline.success": "操作已缓存 | ${target} ${opWord} ${amount} ${coin}",

    // EconomyNotify - 备注标签（仍在confirm表单中使用）
    "notify.transfer.note": "备注：${note}",

    // TPA相关
    "tpa.cost": "传送将花费 ${cost} ${Scoreboard} ",
    "tpa.d": "§c拒绝",
    "tpa.d.request": "§c对方拒绝了传送请求。",
    "tpa.d.request.you": "§e你已拒绝传送请求。",
    "tpa.a": "§a同意",
    "tpa.tp.okey": "§a传送成功!",
    "tpa.accpet.request": "§a已同意传送请求。",
    "tpa.request": "§a传送请求",
    "tpa.request.cut": "§c传送中断，对方或你下线。",
    "tpa.tp.fail.noonline": "§c传送失败，目标玩家已离线。",
    "tpa.a.and.d": "§e可在表单点击【同意/拒绝】或输入 /tpayes(同意)/tpano(拒绝)",
    "tpa.name.ls": "§d互传系统",
    "tpa.tp.msg": "§a互传请求",
    "tpa.exit": "§c操作已取消。",
    "tpa.op.msg": "§c管理互传(开启后进入管理页面)",
    "tpa.op.menu": "§c管理互传",
    "tpa.send.time": "§e请求超时时间(秒)",
    "tpa.send.fail": "§c目标玩家离线,无法发送请求",
    "tpa.send.noway": "§c对方拒绝了所有传送请求",
    "tpa.send.way": "§e请求提示方式",
    "tpa.send.form": "form(对方弹窗)",
    "tpa.send.bossbar": "bossbar(血条)",
    "tpa.Enabled.lag": "§b是否启用延迟功能",
    "tpa.max.lagnumber": "§b最大延迟秒数",
    "tpa.send.time.tip": "TPA请求超时时间（秒），超过后请求自动取消，默认60秒",
    "tpa.max.lagnumber.tip": "允许的最大网络延迟（ms），超过则拒绝传送，0为不限制",
    "tpa.timeout.tip": "超过此时间未响应则请求自动取消，默认60秒",
    "tpa.player.offline": "§c对方(或你)下线,请求取消",
    "tpa.request.timeout": "§c传送请求已超时",
    "tpa.no.request": "§c你没有待处理的请求。",
    "tpa.input.must.number": "§c请求超时必须是正整数！",
    "tpa.must.biggerzero": "§c最大延迟必须>=0！",
    "tpa.save.conf.ok": "保存配置成功！",
    "tpa.no.callback": "§c对方已有未处理的请求, 稍后再试",
    "tpa.choose.player": "§s选择目标玩家",
    "tpa.allow.tp": "你现在 接受 所有传送请求。",
    "tpa.noallow.tp": "你现在 拒绝 所有传送请求。",
    "tpa.choose.fs": "§a传送方式",
    "tpa.to.he.she": "§a传送到对方",
    "tpa.to.here": "§e传送到我",
    "tpa.noplayer.online": "§c当前没有其他在线玩家",
    "tpa.fail": "传送失败:",
    "tpa.main.title": "TPA 主菜单",
    "tpa.main.content": "请选择您要进行的操作：",
    "tpa.btn.to": "传送到玩家",
    "tpa.btn.here": "把玩家传过来",
    "tpa.btn.prefs": "个人偏好设置",
    "tpa.delay.slider": "§e传送延迟(0~${max}秒)",
    "tpa.prefs.title": "TPA 个人偏好设置",
    "tpa.prefs.menu.content": "请选择要修改的设置：",
    "tpa.prefs.menu.btn.basic": "基础设置",
    "tpa.prefs.basic.title": "TPA 基础设置",
    "tpa.btn.back": "返回上一级",
    "tpa.prefs.label": "关闭此开关将立即拒绝任何TPA请求。",
    "tpa.prefs.switch": "TPA 开关",
    "tpa.prefs.prompt": "接收到TPA请求时",
    "tpa.prefs.prompt.form": "弹窗提醒",
    "tpa.prefs.prompt.text": "文字提醒",
    "tpa.btn.blacklist": "传送黑名单",
    "tpa.blacklist.title": "TPA 传送黑名单",
    "tpa.blacklist.content": "被拉黑的玩家将无法向你发起TPA请求(不影响你的其他请求)。\n点击玩家名可将其移出黑名单。",
    "tpa.blacklist.empty": "§7(黑名单为空)",
    "tpa.blacklist.btn.add": "§a+ 添加玩家",
    "tpa.blacklist.add.title": "添加玩家到黑名单",
    "tpa.blacklist.add.dropdown": "从在线玩家中选择",
    "tpa.blacklist.add.dropdown.none": "-- 不选择 --",
    "tpa.blacklist.add.input": "或手动输入玩家名(优先生效)",
    "tpa.blacklist.add.input.tip": "适用于离线玩家,留空则使用上方下拉框",
    "tpa.blacklist.add.empty": "§c请选择或输入一个玩家名",
    "tpa.blacklist.add.self": "§c不能将自己加入黑名单",
    "tpa.blacklist.add.exist": "§e该玩家已在黑名单中",
    "tpa.blacklist.add.ok": "§a已将 ${player} 加入传送黑名单",
    "tpa.blacklist.remove.ok": "§a已将 ${player} 移出传送黑名单",
    "tpa.send.blocked": "§c对方已将你拉黑,无法发起传送请求",
    "tpa.delay.set": "§6并设置了延迟: ${delay}秒",
    "tpa.request.wait": "§c请求最多等待${timeout}秒",
    "tpa.sent.request": "§a已向 ${player} 发送请求(延迟=${delay}秒), 等待对方同意(最多${timeout}秒)",
    "tpa.delay.info": "(延迟${delay}秒)",
    "tpa.bossbar.text": "§a${from}请求${dir}§f${delay}\n§c(/tpayes同意 /tpano拒绝)",
    "tpa.bossbar.countdown": "§a${from}请求${dir}§f${delay}(/tpayes同意 /tpano拒绝),剩余${remain}s",
    "tpa.accept.delay": "§a对方已同意请求，将在${delay}秒后传送...",
    "tpa.accept.now": "§a对方已同意请求，正在传送...",
    "tpa.countdown.bar": "§d传送倒计时: ${remain}s",

    // 公告相关
    "notice.backupto": "§a原公告已备份为 notice.txt.bak",
    "notice.cannot.del": "§c不能删除所有行，至少保留一行！",
    "notice.editor": "§l§e公告编辑器",
    "notice.no.change": "§e公告内容未更改！",
    "notice.exit.edit": "已取消编辑",
    "notice.for.server": "§l§e服务器公告",
    "notice.dont.showagain": "以后进服不自动弹出(除非公告更新或停用此开关)",
    "notice.is.changed": "检测到新公告，玩家下次加入将强制显示",
    "notice.save.ok": "保存公告成功！",

    // 更新相关
    "Upd.check": "正在检查新版本中.... 您可在config.json禁用自动更新！",
    "Upd.success": "更新成功！稍后将重载插件",
    "Upd.timeout": "获取版本信息超时，请检查网络连接",
    "Upd.json.error": "版本信息格式错误，无法解析JSON",
    "Upd.backup.now": "正在创建备份...",
    "Upd.fail.backing": "更新失败，正在恢复备份...",
    "Upd.back.success": "已恢复到更新前的版本",
    "Upd.fail": "更新失败",
    "network.error.1": "网络连接失败，请检查网络设置或稍后重试",
    "file.permission.error": "文件写入权限不足，请检查插件目录权限",
    "file.parse.error": "数据解析失败，可能是服务器返回格式错误",
    "No.backup.canuse": "没有可用的备份",

    // Tip相关
    "Tip1": "如有Bug请联系作者反馈！！！！",
    "Tip2": "感谢PHEyeji和小黑可爱喵提供技术支持和指导！感谢ender罗小黑提供在线网页支持！",
    "Tip3": "在线config编辑器：https://jzrxh.work/projects/yessential/index.html",
    "Version.Chinese": "版本:",

    "wh.warn": "服务器启动时维护模式已启用，非OP玩家将无法加入!!!!!",
    "Motd.config.isemp": "MOTD配置为空，跳过轮播",
    "player.isnull": "玩家对象无效或已离线！",
    "player.not.op": "§c权限不足！",
    "gui.exit": "表单已关闭,未收到操作",
    "server.tp.ok": "传送成功！",
    "no.server.can.tp": "暂无可传送服务器!",
    "no.ranking.data": "§c暂无排行榜数据！",
    "ranking.list": "排行榜",
    "server.config.loaderror": "读取 跨服传送 配置失败:",
    "server.load.error": "服务器配置加载失败，请联系管理员！",
    "server.no.select": "§c服务器选择无效！",
    "server.from.title": "跨服传送列表",
    "choose.a.server": "请选择一个服务器",
    "server.tp.fail": "§c跨服传送失败，请检查目标服务器状态！",
    "no.server.cantpto": "server.json 内容为空或 servers 键不存在！",
    "suicide.kill.ok": "自杀执行成功！",
    "suicide.disabled": "§c自杀功能当前已关闭！",
    "suicide.cooldown": "§c自杀功能冷却中，剩余 ${time} 秒！",
    "pls.input.number": "请输入增加数量!",
    "key.not.number": "请输入数字！",
    "key.not.number.tip": "请输入一个正整数",
    "rp.loading.error": "加载红包数据失败",
    "rp.menu.1": "红包",
    "rp.send.packet": "发送红包",
    "rp.open.packet": "领取红包",
    "rp.all.help": "红包使用帮助",
    "rp.send.amount": "红包金额：",
    "rp.send.count": "红包数量：",
    "rp.send.amount.tip": "总金额需≥红包个数，单个红包最少1元",
    "rp.send.count.tip": "红包个数至少1个，不能超过总金额",
    "rp.count.bigger.yourmoney": "红包总额度不能大于你的",
    "redpacket.type": "红包类型：",
    "rp.random.packet": "拼手气红包",
    "rp.average.packet": "普通红包",
    "back.to.point": "返回死亡点",
    "back.helpinfo": "§a已记录您的死亡点！使用 /back 查看所有死亡点。",
    "back.to.point.sure": "确认返回死亡点？",
    "back.choose": "§6请选择要传送的死亡点：",
    "back.list.Empty": "您没有死亡历史记录!",
    "back.disabled": "§c死亡点传送功能当前已关闭！",
    "back.cooldown": "§c死亡点传送冷却中，剩余 ${time} 秒！",
    "back.successful": "返回成功！",
    "back.fail": "§c传送失败！",
    "back.choose.null": "§c选择无效！",
    "back.deathlog.error": "§c死亡点数据错误！",
    "home.tp.system": "§l家园系统",
    "home.set.public":"设置为公共家（其他玩家可传送至此）",
    "home.add": "§l添加家",
    "home.choose.public.home": "§7请选择要传送的公共家：",
    "home.no.homes": "§c您还没有任何家，请先添加！",
    "home.choose.home": "§7请选择要管理的家：",
    "home.no.public.homes": "§7暂无公共家\n「添加家」时开启「设置为公共家」即可分享！",
    "home.add.input.tip": "家名称不能为空，不能与已有的家重名",
    "home.rename": "重命名（留空则保持原名）",
    "home.settings": "§l家设置",
    "home.add.input": "请输入您的家名称",
    "home.add.input.tip": "家名称不能为空，不能与已有的家重名",
    "home.del": "§l删除家",
    "home.del.choose": "请选择要删除的家",
    "home.tp": "§l传送家",
    "home.share":"§l公共家",
    "home.tp.choose": "请选择要传送的家",
    "home.name.repetitive": "家名称已存在!",
    "home.name.noinput": "请输入家名称!",
    "home.input.name": "请输入您的家名称",
    "home.create.new": "添加家",
    "bag.is.full": "§c背包已满，无法给予物品！",
    "rtp.onlycanusein.overworld": "§c只能在主世界使用随机传送！",
    "module.no.Enabled": "所选功能尚未开启！",
    "fc.error": "无法对非玩家对象执行此命令",
    "fc.error2": "你都是管理员了用这个功能干什么（）",
    "fc.success.quit": "成功退出灵魂出窍",
    "fc.success.getin": "成功进入灵魂出窍，花费§e${Fcam}金币",
    "fc.error.log1": "FCAM: setGameMode 恢复失败: ",
    "fc.error.log2": "FCAM: TP 回原位失败: ",
    "fc.error.log3": "FCAM: simulateDisconnect 失败: ",
    "fc.error.log4": "FCAM: 自动退出失败: ",
    "fc.error.log5": "FCAM: 移除 BossBar 失败: ",
    "fc.timeout": "§c灵魂出窍时间已到，已自动退出！",
    "hub.tp.check": "§l§a回城确认",
    "hub.tp.now": "§a✔ 立即传送",
    "hub.tp.notnow": "§c✘ 不是现在",
    "hub.tp.success": "§a成功传送到主城！",
    "hub.tp.fail": "§l 传送失败！原因：",
    "crash.player.ok": "成功把玩家崩溃了！",
    "crash.player.client": "§c使玩家客户端崩溃",
    "carsh.function.list": "§c崩溃功能如下",
    "crash.no.online": "§e当前没有其他在线玩家。",
    "crash.target.offline": "§c目标玩家已离线，操作取消。",
    "stop.msg": "服务器关闭\n请稍后再来",
    "pls.input.notice": "请输入公告内容，（换行用 \\n）",
    "gamerule.KeepInventory.true": "死亡不掉落已启用",
    "cannot.create.newfile": "无法创建数据存储对象",
    "rtp.search.chunks": "§a正在寻找安全的传送位置，请稍候...",
    "rtp.search.chunks2": "§e未找到理想位置，使用备用传送方案...",
    "rtp.loading.chunks3": "§7正在加载区块...",
    "rtp.loading.chunks2": "§7正在加载区块..",
    "rtp.loading.chunks1": "§7正在加载区块.",
    "rtp.cannotfind.safexyz": "§c无法找到安全的传送位置，请稍后再试",
    "rtp.tp.success": "§a传送成功！",
    "rtp.tp.success2": "§6已传送到安全高度，请自行寻找落脚点",
    "rtp.loadchunks.timeout": "§c目标区块加载超时",
    "rtp.error": "§c传送过程发生错误",
    "pvp.is.on": "§6PVP 已开启",
    "pvp.is.off": "§6PVP 已关闭",
    "pvp.player.isoff": "附近玩家 ${player.realName} PVP 关闭, 你无法攻击他",
    "your.pvp.isoff": "§l§b你关闭了 PVP",
    "then.pvp.isoff": "§l§b对方关闭了 PVP",
    "init.success": "所有模块加载成功！",
    "init.fail": "部分模块加载失败，请检查日志",
    "choose": "选择",
    "success": "成功",
    "one": "一个",
    "player": "玩家",
    "number": "数字",
    "CoinName": "金币",
    "to": "将",
    "add": "加",

    // ── 红包系统 ──────────────────────────────────────────────
    "rp.type.random.short":   "拼手气",
    "rp.type.average.short":  "普通",
    "rp.type.random.colored": "§6拼手气",
    "rp.type.average.colored":"§b普通",
    "rp.type.random.tag":     "§6[拼]",
    "rp.type.average.tag":    "§b[普]",

    "rp.expired.refund": "§a你的红包#${id}已过期，退还§e${amount}§a${coin}",

    "rp.send.duplicate":        "§c请勿重复发送红包！",
    "rp.send.param.error":      "§c参数错误: 金额和数量必须是数字",
    "rp.send.usage":            "§c用法: /redpacket send <总金额> <红包个数> [玩家名] [祝福语] [类型]",
    "rp.send.usage.type":       "§7类型: random(拼手气) 或 average(普通)",
    "rp.send.amount.range":     "§c红包金额必须在${min}-${max}之间",
    "rp.send.count.range":      "§c红包个数必须在1-${max}之间",
    "rp.send.no.balance":       "§c余额不足，无法发送红包",
    "rp.send.notify.target":    "§a你收到来自${sender}的${type}红包，输入§e/rp open§a领取",
    "rp.send.success.specific": "§a成功向${player}发送${type}红包，金额:§e${amount}§a，数量:§e${count}",
    "rp.send.broadcast":        "§a玩家§e${sender}§a发送了${type}全服红包，输入§e/rp open§a领取",
    "rp.send.success.all":      "§a成功发送${type}全服红包，金额:§e${amount}§a，数量:§e${count}",
    "rp.default.message":       "${sender}的红包",

    "rp.open.none":          "§c当前没有可领取的红包",
    "rp.open.success":       "§a恭喜你领取到§e${sender}§a的${type}红包，获得§e${amount}§a${coin}!",
    "rp.open.notify.sender": "§a玩家§e${player}§a领取了你的红包，获得§e${amount}§a${coin}",

    "rp.list.title":   "§l§6可领取红包",
    "rp.list.content": "§7点击查看详情并领取",
    "rp.list.button":  "§l${type} §e${sender}的红包\n§7金额: §f${amount} §7剩余: §a${remaining}/${count}\n§7过期: §f${expire}秒",
    "rp.list.close":   "§c关闭菜单",

    "rp.history.title":          "§l§6红包历史记录",
    "rp.history.content":        "§7点击查看红包详情",
    "rp.history.empty":          "§c你还没有红包记录",
    "rp.history.status.active":  "§a进行中",
    "rp.history.status.ended":   "§c已结束",
    "rp.history.sent.amount":    "§7已领取: §f${amount}",
    "rp.history.recv.amount":    "§7获得: §f${amount}",
    "rp.role.sender":            "§b[发]",
    "rp.role.receiver":          "§a[收]",

    "rp.detail.title":            "§l§6红包详情",
    "rp.detail.sender":           "§f发送者: §e${sender}",
    "rp.detail.target.type":      "§f目标类型: §e${type}",
    "rp.target.all":              "全服红包",
    "rp.target.specific":         "指定红包",
    "rp.detail.packet.type":      "§f红包类型: §e${type}",
    "rp.detail.target.player":    "§f指定玩家: §e${player}",
    "rp.detail.amount":           "§f总金额: §e${amount}${coin}",
    "rp.detail.count":            "§f红包个数: §e${count}",
    "rp.detail.remaining.amount": "§f剩余金额: §e${amount}${coin}",
    "rp.detail.remaining.count":  "§f剩余个数: §e${count}",
    "rp.detail.message":          "§f祝福语: §e${msg}",
    "rp.detail.expire":           "§f过期时间: §e${time}",
    "rp.detail.recipients":       "§f领取记录:",
    "rp.detail.recipient.item":   "§7- §e${name}",

    "rp.help.content":      "选择命令查看详细说明",
    "rp.help.view":         "查看红包",
    "rp.help.history.btn":  "红包历史",
    "rp.help.types.btn":    "红包类型说明",
    "rp.help.detail.title": "§l§6红包帮助",
    "rp.help.send.detail":
        "§6发送红包命令: §a/rp send <金额> <数量> [玩家名] [祝福语] [类型]\n" +
        "§7- §f金额: 红包总金额\n" +
        "§7- §f数量: 红包个数\n" +
        "§7- §f玩家名: 指定接收玩家(可选)\n" +
        "§7- §f祝福语: 红包祝福语(可选)\n" +
        "§7- §f类型: random(拼手气)或average(普通)(可选，默认random)\n" +
        "§e示例: §a/rp send 1000 5 §7(发送5个总金额1000的拼手气红包)\n" +
        "§e示例: §a/rp send 1000 5 average §7(发送5个总金额1000的普通红包)\n" +
        "§e示例: §a/rp send 1000 5 Steve \"恭喜发财\" random §7(指定玩家的拼手气红包)",
    "rp.help.open.detail":
        "§6领取红包命令: §a/rp open\n" +
        "§7自动领取最早可用的红包\n\n" +
        "§6查看可领红包: §a/rp list\n" +
        "§7查看所有可领取的红包列表",
    "rp.help.list.detail":
        "§6查看红包详情: §a/rp list\n" +
        "§7查看所有可领取的红包\n\n" +
        "§7点击红包可直接领取",
    "rp.help.history.detail":
        "§6查看红包历史: §a/rp history\n" +
        "§7查看你发送和领取的红包记录",
    "rp.help.type.detail":
        "§6红包类型说明:\n" +
        "§a1. 拼手气红包(random):\n" +
        "§7- 每个红包金额随机分配\n" +
        "§7- 金额在1到剩余均值的两倍之间随机\n" +
        "§7- 最后一人获得剩余所有金额\n\n" +
        "§b2. 普通红包(average):\n" +
        "§7- 每个红包金额平均分配\n" +
        "§7- 金额 = 剩余金额 / 剩余个数(取整)\n" +
        "§7- 最后一人获得剩余所有金额",
};

// ── 异步语言文件管理器 ─────────────────────────────────────────
class AsyncLanguageManager {
    static async mergeLangFiles() {
        try {
            // 确保语言目录存在
            if (!file.exists(YEST_LangDir)) {
                file.mkdir(YEST_LangDir);
            }

            // 异步读取现有语言文件
            const currentLangData = await AsyncFileManager.readFile(
                langFilePath,
                JSON.stringify(defaultLangContent)
            );

            // 合并：只补充新增的 key，不覆盖用户自定义内容
            const mergedData = { ...currentLangData };
            let addedCount = 0;

            for (const key in defaultLangContent) {
                if (!(key in mergedData)) {
                    mergedData[key] = defaultLangContent[key];
                    addedCount++;
                }
            }

            // 有新 key 才写盘并刷新 lang 对象
            if (addedCount > 0) {
                const isFirstLoad = addedCount === Object.keys(defaultLangContent).length;

                await AsyncFileManager.writeFile(langFilePath, mergedData);

                if (isFirstLoad) {
                    // [fix] 不再触发 ll reload YEssential：
                    // reload 会让已注册命令的 setCallback 被 LSE 忽略（"运行时命令已存在"），
                    // 旧 JS 上下文随即被销毁，命令执行时回调引用失效 → "get on empty Global"。
                    // 直接热替换 globalThis.lang 即可，与非首次加载路径行为一致。
                    randomGradientLog(`语言文件首次释放完成，共 ${addedCount} 个条目，已热更新语言缓存`);
                    lang = new JsonConfigFile(langFilePath, JSON.stringify(mergedData));
                    globalThis.lang = lang;
                } else {
                    randomGradientLog(`语言文件已更新，新增 ${addedCount} 个条目`);
                    lang = new JsonConfigFile(langFilePath, JSON.stringify(mergedData));
                    globalThis.lang = lang;
                }
            }
        } catch (error) {
            logger.error("合并语言文件时出错: " + error.message);
        }
    }
}
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
// ── 模块加载时立即执行 ─────────────────────────────────────────
// 1. 将 defaultLangContent 暴露到全局，供其他模块引用
globalThis.defaultLangContent = defaultLangContent;

// 2. 用完整默认内容重新初始化 lang（覆盖主文件的空占位）
//    JsonConfigFile 若文件已存在则从文件读取，否则以第二参数写入
lang = new JsonConfigFile(langFilePath, JSON.stringify(defaultLangContent));
globalThis.lang = lang;

// 3. 异步合并，补充磁盘文件中缺失的新 key
AsyncLanguageManager.mergeLangFiles();

