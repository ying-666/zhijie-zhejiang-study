import type { Node, Subject } from './types.ts'

const essential = ['教材学习', '学考']
const national = [...essential, '高考']
const elective = [...essential, '浙江选考']

export const subjects: Subject[] = [
  { id: 'math', name: '数学', mark: '∑', tracks: national, focus: '从代数式变形到方程与不等式', modules: ['集合与逻辑用语', '函数与导数', '几何与代数', '概率与统计'] },
  { id: 'english', name: '英语', mark: 'Aa', tracks: national, focus: '从句子结构到语篇证据', modules: ['主题与语篇', '语言知识', '语言技能', '文化知识与学习策略'] },
  { id: 'chinese', name: '语文', mark: '文', tracks: national, modules: ['整本书阅读', '文学阅读与写作', '思辨性阅读与表达', '语言积累与梳理'] },
  { id: 'physics', name: '物理', mark: 'φ', tracks: elective, modules: ['运动与相互作用', '能量与动量', '电磁学', '热学、振动与波、近代物理'] },
  { id: 'chemistry', name: '化学', mark: '化', tracks: elective, modules: ['物质及其变化', '化学反应原理', '物质结构与性质', '有机化学'] },
  { id: 'biology', name: '生物学', mark: '生', tracks: elective, modules: ['分子与细胞', '遗传与进化', '稳态与调节', '生物与环境', '生物技术与工程'] },
  { id: 'history', name: '历史', mark: '史', tracks: elective, modules: ['中外历史纲要', '国家制度与社会治理', '经济与社会生活', '文化交流与传播'] },
  { id: 'geography', name: '地理', mark: '地', tracks: elective, modules: ['自然地理', '人文地理', '区域发展', '资源、环境与国家安全'] },
  { id: 'politics', name: '思想政治', mark: '政', tracks: elective, modules: ['中国特色社会主义', '经济与社会', '政治与法治', '哲学与文化', '当代国际政治与经济', '法律与生活', '逻辑与思维'] },
  { id: 'technology', name: '技术', mark: '技', tracks: elective, modules: ['信息技术 · 数据与计算', '信息技术 · 信息系统与社会', '通用技术 · 技术与设计', '通用技术 · 结构、流程、系统与控制'] },
]

const groups = (subject: string, rows: [string, string, string, string?][], planned = false): Node[] =>
  rows.map(([id, name, definition, parent]) => ({ id, subject, name, definition, parent, planned }))

export const groupsAndPlanned = [
  ...groups('math', [
    ['calculation', '运算能力', '在保留条件的前提下，把数学对象变到可求解、可核验的形式。'],
    ['algebra', '代数式运算', '通过恒等变形将代数式整理为目标形式。', 'calculation'],
    ['polynomial', '整式运算', '按幂次整理或拆解多项式。', 'algebra'],
    ['fraction', '分式运算', '在定义域内化简并合并有理式。', 'algebra'],
    ['functions-calc', '常见函数式运算', '依照指数、对数、三角关系选择改写。', 'calculation'],
    ['equations', '方程求解', '在原方程定义域内获得解集。', 'calculation'],
    ['quadratic', '一元二次方程', '利用系数、根和图像信息求解或判根。', 'equations'],
    ['parametric', '含参数二次方程', '按参数使次数或根的性质变化的位置分情况。', 'quadratic'],
    ['inequality', '不等式求解', '按符号与临界点确定解集。', 'calculation'],
  ]),
  ...groups('math', [
    ['math-reason','逻辑推理','识别必要与充分条件，构造证明或反例。'],
    ['math-abstract','数学抽象','从实例中提取变量、结构和不变量。'],
    ['math-model','数学建模','把现实约束写成模型并校验结果。'],
    ['math-space','空间想象','在图形、坐标、向量之间转换。'],
    ['math-data','数据分析','用数据分布、概率与统计量支持判断。'],
    ['math-strategy','解题策略','比较表示方式并选择可验证的解法。'],
  ], true),
  ...groups('english', [
    ['reading','阅读理解能力','从词句和语篇中提取证据，判断选项的支持程度。'],
    ['vocabulary','词汇理解','结合构词与上下文推断语境义。','reading'],
    ['syntax','句法理解','借助谓语、连接词与修饰边界还原句子结构。','reading'],
    ['discourse','语篇理解','识别上下文的指代、逻辑与中心。','reading'],
    ['information','信息提取','定位证据并比较语义一致性。','reading'],
    ['inference','推理与判断','在文本证据允许的范围内作出推论。','reading'],
    ['strategy','选项辨析与应试策略','核对证据与选项，分配答题时间。','reading'],
  ]),
  ...groups('english',[
    ['en-listen','听力理解','捕捉语意重音与说话者意图。'],
    ['en-speak','口语交际','根据情境组织回应并请求澄清。'],
    ['en-write','书面表达','按写作目的组织材料、衔接与修订。'],
    ['en-language','语言运用','在语境中选择词汇、句法与语用形式。'],
  ],true),
]

const outlines: Record<string, [string, string, string[]][]> = {
  chinese: [['文本阅读','用文本证据解释内容、语言和结构。',['圈定论点与限定语','用上下文解释古文实词','从环境描写判断人物处境']],['表达与写作','组织语言并使材料支撑表达目的。',['区分论据与论点','改写指代不明的句子','围绕任务安排论证段落']]],
  physics: [['模型与规律','在指定参考系和研究对象下应用物理定律。',['画指定物体的受力图','判断动量守恒条件','确定回路感应电流方向']],['实验与证据','用图像和测量结果检验模型。',['读取位移—时间图像的局部斜率','用伏安图像求电阻','比较重复测量的离散程度']]],
  chemistry: [['概念与计算','用宏观、微观和符号三种表征处理化学问题。',['判断离子方程式中物质拆写','用化合价变化配平氧化还原方程','用反应商判断平衡移动方向']],['实验推理','从实验条件、对照和现象得出有限结论。',['选择气体检验的对照','区分沉淀生成和干扰现象','用图表判断反应速率变化']]],
  biology: [['生命过程与遗传','用教材模型解释生命过程与遗传现象。',['判断物质跨膜运输方式','用配子组合计算单基因遗传比例','分析负反馈调节环路']],['证据与生态','根据数据判断生命系统中的关系。',['从对照组识别自变量','读种群数量变化曲线','判断食物链能量流向']]],
  history: [['时空与史料','在具体时空中辨认史料来源和证据价值。',['判断史料是直接观察还是转述','用纪年把事件放入时间轴','识别叙述者立场']],['解释与论证','把具体史实与因果判断相连。',['区分背景与直接诱因','用史实支撑比较结论','识别因果链中缺失的一环']]],
  geography: [['地图与过程','利用空间表示和地理过程解释现象。',['在等高线图识别山谷','根据风向判断迎风坡','读气温与降水图的季节变化']],['区域与决策','基于区位条件比较区域发展方案。',['从地图提取交通区位条件','比较两地产业布局约束','用水量平衡解释流域变化']]],
  politics: [['概念与材料','根据材料行为识别适用的学科概念。',['识别市场调节失灵的具体表现','判定材料中的国家机关职权','区分社会存在与社会意识']],['论证与应用','用相关原理和材料事实形成完整论证。',['从材料中提取原理解答证据','辨别必要条件和充分条件','解释合同成立时的要约与承诺']]],
  technology: [['信息技术','理解编码、数据处理、算法与信息系统。',['跟踪循环变量和终止条件','判断筛选前后的数据字段','识别传感器数据流向']],['通用技术','以约束和评价标准分析设计方案。',['识别结构受力关键点','区分开环和闭环控制','判断流程能否并行']]],
}

export const outlineNodes = Object.entries(outlines).flatMap(([subject, branches]) =>
  branches.flatMap(([name, definition, leaves], i) => {
    const parent = subject + '-outline-' + (i + 1)
    return groups(subject, [[parent, name, definition], ...leaves.map((leaf, j): [string, string, string, string] =>
      [parent + '-' + (j + 1), leaf, '学习目标：' + leaf + '，并说明使用的依据。', parent])], true)
  }),
)
