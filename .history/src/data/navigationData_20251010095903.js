export const navigationData = [
  {
    id: 1,
    name: '常用网页',
    icon: '🌐',
    tools: [
      {
        id: 1,
        name: 'Chatgpt',
        icon: '🤔',
        color: '#475569',
        url: 'https://chatgpt.com/',
        description: ''
      },
      {
        id: 2,
        name: 'Gemini',
        icon: '😄',
        color: '#64748b',
        url: 'https://gemini.google.com/app?hl=zh-cn',
        description: ''
      },
      {
        id: 3,
        name: 'Cladue',
        icon: '😎',
        color: '#6b7280',
        url: 'https://claude.ai/new',
        description: ''
      },
      {
        id: 4,
        name: 'Deepseek开放平台',
        icon: '🤖',
        color: '#374151',
        url: 'https://platform.deepseek.com/api_keys',
        description: ''
      },
      {
        id: 5,
        name: 'lobechat',
        icon: 'https://www.lobechat.com/favicon.ico',
        color: '#1f2937',
        url: 'http://117.72.14.115:3210/chat',
        description: '个人自用'
      },
      {
        id: 6,
        name: '1Panel管理面板',
        icon: 'https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/1panel-ezh0i0nmrbrw58wuhfvam9.png/1panel-2odjec9y430kxozr1tlqad.png?_a=DATAg1AAZAA0',
        color: '#059669',
        url: 'http://117.72.14.115:32266/a26153af40',
        description: '个人自用'
      },
      {
        id: 7,
        name: 'bilibili',
        icon: '🥳',
        color: '#0d9488',
        url: 'https://www.bilibili.com/',
        description: ''
      },
      {
        id: 8,
        name: '斗鱼直播',
        icon: '💻',
        color: '#7c3aed',
        url: 'https://www.douyu.com/directory/myFollow',
        description: ''
      },
      {
        id: 9,
        name: '同桌英语',
        icon: '📉',
        color: '#dc2626',
        url: 'https://ielts.itongzhuo.com/business/ielts/student/jumpAnswerWordDictation.do?sSubjects=0&leftType=1',
        description: ''
      },
      {
        id: 10,
        name: '智慧工大',
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY19O8xA63N0jngZFXh9xAQaypIFPE3yhplA&s',
        color: '#16a34a',
        url: 'https://portal.hut.edu.cn/',
        description: ''
      },
      {
        id: 11,
        name: '油管',
        icon: '👽',
        color: '#2563eb',
        url: 'https://www.youtube.com/',
        description: ''
      },
      {
        id: 12,
        name: '质谱AI开放平台',
        icon: 'data:image/png;base64,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',
        color: '#1d4ed8',
        url: 'https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys',
        description: ''
      },
      {
        id: 13,
        name: '通义千问开放平台',
        icon: 'https://upload.wikimedia.org/wikipedia/zh/3/3f/Tongyi_Qianwen_Logo.png',
        color: '#be123c',
        url: 'https://bailian.console.aliyun.com/?tab=model#/api-key',
        description: ''
      },
      {
        id: 14,
        name: 'Convertio',
        icon: '🚀',
        color: '#15803d',
        url: 'https://convertio.co/zh/',
        description: ''
      },
      {
        id: 15,
        name: '工大图书馆',
        icon: 'https://upload.wikimedia.org/wikipedia/zh/thumb/e/e7/Hunan_University_of_Technology_logo.jpg/280px-Hunan_University_of_Technology_logo.jpg',
        color: '#b91c1c',
        url: 'https://xwfw.hut.edu.cn/reader/user/login',
        description: ''
      },
      {
        id: 16,
        name: 'Cloudflare',
        icon: '🔑',
        color: '#7c2d12',
        url: 'https://dash.cloudflare.com/',
        description: ''
      },
      {
        id: 17,
        name: '京东云控制台',
        icon: 'https://console-download.s3.cn-north-1.jdcloud-oss.com/app_icon.png',
        color: '#ca8a04',
        url: 'https://lavm-console.jdcloud.com/lavm/detail/cn-north-1/lavm-adatfacori',
        description: ''
      },
      {
        id: 18,
        name: 'Scholarread',
        icon: '🔓',
        color: '#166534',
        url: 'https://www.scholaread.com/library',
        description: ''
      },
      {
        id: 19,
        name: '科研绘',
        icon: 'https://91tool.oss-cn-beijing.aliyuncs.com/wp-content/uploads/2024/03/ce3f496dc68bae1237ee9482aeb1cd25.png',
        color: '#14532d',
        url: 'https://www.figdraw.com/static/index.html#/',
        description: ''
      },
      {
        id: 19,
        name: 'DeepSeek',
        icon: '😅',
        color: '#14532d',
        url: 'https://chat.deepseek.com',
        description: ''
      },
      {
        id: 19,
        name: 'V-API',
        icon: '😅',
        color: '#14532d',
        url: 'https://api.gpt.ge/panel/profile',
        description: 'API中转站'
      }
    ]
  },
  {
    id: 2,
    name: '邮箱及交流',
    icon: '🎓',
    tools: [
      {
        id: 20,
        name: 'QQ邮箱',
        icon: '🚀',
        color: '#1e40af',
        url: 'https://mail.qq.com/?cancel_login=true&from=session_timeout',
        description: ''
      },
      {
        id: 21,
        name: '网易邮箱',
        icon: '🚀',
        color: '#047857',
        url: 'https://mail.163.com/js6/main.jsp?sid=xMSSjJnGMDjiaILoliGGxHEsmsNhRhCn&df=mail163_letter#module=welcome.WelcomeModule%7C%7B%7D',
        description: ''
      },
      {
        id: 22,
        name: '学生邮箱',
        icon: 'https://img.88icon.com/download/jpg/20201226/5d759e7d51db597e4adef5e3978c0d66_512_512.jpg!bg',
        color: '#b45309',
        url: 'https://mail.hut.edu.cn/',
        description: ''
      },
      {
        id: 23,
        name: 'Outlook邮箱',
        icon: '🚀',
        color: '#5b21b6',
        url: 'https://outlook.live.com/mail/0/drafts',
        description: ''
      },
      {
        id: 22,
        name: 'Gmail',
        icon: '🚀',
        color: '#b45309',
        url: 'https://mail.google.com/',
        description: ''
      },
      {
        id: 22,
        name: 'iCloud Mail',
        icon: 'https://support.apple.com/content/dam/edam/applecare/images/en_US/psp/psp_heroes/mini-hero-mail.png',
        color: '#b45309',
        url: 'https://www.icloud.com/mail',
        description: ''
      },
       {
        id: 22,
        name: 'iCloud',
        icon: '🚀',
        color: '#b45309',
        url: 'https://www.icloud.com.cn/',
        description: ''
      },
      {
        id: 22,
        name: 'Telegram',
        icon: '🚀',
        color: '#b45309',
        url: 'https://web.telegram.org/',
        description: ''
      },
      {
        id: 22,
        name: 'X',
        icon: '🚀',
        color: '#b45309',
        url: 'https://x.com/home',
        description: '原推特'
      },
      {
        id: 22,
        name: 'Google 云盘',
        icon: '🚀',
        color: '#b45309',
        url: 'https://drive.google.com/',
        description: ''
      },
      {
        id: 22,
        name: '阿里云盘',
        icon: '🚀',
        color: '#b45309',
        url: 'https://www.aliyundrive.com/',
        description: ''
      },
       {
        id: 22,
        name: '百度网盘',
        icon: '🚀',
        color: '#b45309',
        url: 'https://pan.baidu.com/',
        description: ''
      },
       {
        id: 22,
        name: '腾讯微云存储',
        icon: '🚀',
        color: '#b45309',
        url: 'https://www.weiyun.com/',
        description: ''
      },
       {
        id: 22,
        name: '夸克网盘',
        icon: '🚀',
        color: '#b45309',
        url: 'https://pan.quark.cn/list#/list/all',
        description: ''
      },
    ]
  },
  {
    id: 3,
    name: '杂项',
    icon: '🔥',
    tools: [
      {
        id: 26,
        name: '全民简历',
        icon: '😷',
        color: '#334155',
        url: 'https://www.qmjianli.com/login/?callurl=https%3A%2F%2Fwww.qmjianli.com%2Fcv%2Fedit%2F%3FresumeId%3D242260MQWK78Z1TM',
        description: ''
      },
      {
        id: 27,
        name: 'Libvio',
        icon: '✨',
        color: '#dc2626',
        url: 'https://www.libvio.me/',
        description: ''
      },
      {
        id: 28,
        name: '贝贝云',
        icon: 'https://订阅转换.com/05/static/picture/logo_512.png',
        color: '#0891b2',
        url: 'https://link1.beibeicloud.shop/dashboard',
        description: ''
      },
      {
        id: 29,
        name: '雅思答案',
        icon: '✏️',
        color: '#a21caf',
        url: 'http://www.laokaoya.com/48685.html',
        description: ''
      },
      {
        id: 30,
        name: '小红书',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/XiaohongshuLOGO.png',
        color: '#0369a1',
        url: 'https://www.xiaohongshu.com/explore?language=zh-CN',
        description: ''
      },
      {
        id: 31,
        name: 'Mineru',
        icon: '🧮',
        color: '#d97706',
        url: 'https://mineru.net/',
        description: ''
      },
      {
        id: 31,
        name: '火山引擎开发平台',
        icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/volcengine-color.png',
        color: '#d97706',
        url: 'https://console.volcengine.com/',
        description: ''
      },
      {
        id: 31,
        name: 'Pixiv',
        icon: '🧮',
        color: '#d97706',
        url: 'https://www.pixiv.net/',
        description: ''
      },
      {
        id: 31,
        name: 'Sapceshiip',
        icon: '🧮',
        color: '#d97706',
        url: 'https://www.spaceship.com/',
        description: ''
      },
      {
        id: 31,
        name: '飞书云文档',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Lark_Suite_logo_2022.png',
        color: '#d97706',
        url: 'https://qcn5fmkvwp27.feishu.cn/',
        description: ''
      },
      {
        id: 31,
        name: 'Lobechat部署',
        icon: '🧮',
        color: '#d97706',
        url: 'https://lobehub.com/',
        description: ''
      },
      {
        id: 31,
        name: 'ONLYOFFICE',
        icon: 'https://mattermost.com/wp-content/uploads/2023/05/OnlyOffice.webp',
        color: '#d97706',
        url: 'https://doctor-cao-team.onlyoffice.com/',
        description: ''
      },
      {
        id: 31,
        name: '子子影院',
        icon: '🧮',
        color: '#d97706',
        url: 'http://zizidm.com/',
        description: ''
      },
      {
        id: 31,
        name: 'TP-LINK',
        icon: '🧮',
        color: '#d97706',
        url: 'http://tplogin.cn/',
        description: ''
      },
      {
        id: 31,
        name: 'Google AI Studio',
        icon: '🧮',
        color: '#d97706',
        url: 'https://aistudio.google.com/prompts/new_chat',
        description: ''
      },
      {
        id: 31,
        name: '接码平台',
        icon: '🧮',
        color: '#d97706',
        url: 'https://sms-activate.io/cn/info/freeprice',
        description: 'sms-activate.io'
      },
      {
        id: 31,
        name: '豆包',
        icon: '🧮',
        color: '#d97706',
        url: 'https://www.doubao.com/chat/',
        description: ''
      },
      {
        id: 31,
        name: '硅基流动',
        icon: '🧮',
        color: '#d97706',
        url: 'https://account.siliconflow.cn/',
        description: ''
      },
      {
        id: 31,
        name: '虎牙直播',
        icon: '🧮',
        color: '#d97706',
        url: 'https://www.huya.com/',
        description: ''
      },
       {
        id: 31,
        name: '爱彼迎',
        icon: '🧮',
        color: '#d97706',
        url: 'https://www.airbnb.com/',
        description: ''
      },
       {
        id: 31,
        name: '去哪儿网',
        icon: '🧮',
        color: '#d97706',
        url: 'https://flight.qunar.com/',
        description: '买机票'
      },
      
    ]
  }
];