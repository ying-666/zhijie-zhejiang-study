import type { Node, Subject } from './types.ts'

const essential = ['教材学习', '学考']
const national = [...essential, '高考']
const elective = [...essential, '浙江选考']

export const subjects: Subject[] = [
  { id: 'math', name: '数学', mark: '∑', tracks: national, focus: '课标知识点 · 精选运算 · 应试训练', modules: ['集合与逻辑用语', '函数与导数', '几何与代数', '概率与统计'] },
  { id: 'english', name: '英语', mark: 'Aa', tracks: national, focus: '听力、阅读与写作题型 · 课标词汇', modules: ['主题与语篇', '语言知识', '语言技能', '文化知识与学习策略'] },
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

export const activeSubjects = subjects.filter(subject => subject.focus)

export const groupsAndPlanned = [
  ...groups('math', [
    ['math-curriculum', '高中新课标知识点', '按必修与选择性必修学习概念、公式、例题和易错点。'],
    ['math-required', '必修', '学习预备知识、函数、几何与代数、概率统计及建模。','math-curriculum'],
    ['math-prep', '预备知识', '集合、逻辑、等式与不等式，以及二次函数与方程。','math-required'],
    ['math-functions', '函数', '先理解函数的概念与性质，再学习基本函数与函数应用。','math-required'],
    ['math-geometry', '几何与代数', '学习平面向量、解三角形、复数、立体几何初步。','math-required'],
    ['math-data-basic', '概率与统计', '从随机事件、抽样和统计量入手理解数据。','math-required'],
    ['math-selective', '选择性必修', '学习数列与导数、空间向量与解析几何、计数及概率统计。','math-curriculum'],
    ['math-advanced-functions', '数列与导数', '用离散变化规律和瞬时变化率研究函数。','math-selective'],
    ['math-advanced-geometry', '空间向量与解析几何', '把几何关系转化为向量和坐标方程。','math-selective'],
    ['math-advanced-data', '计数、概率与统计', '从计数原理走向随机变量、分布及统计推断。','math-selective'],
    ['calculation', '运算能力', '集中练习多项式展开、因式分解和保留定义域的分式化简。'],
    ['algebra', '代数式运算', '通过恒等变形将代数式整理为目标形式。', 'calculation'],
    ['polynomial', '整式运算', '按幂次整理或拆解多项式。', 'algebra'],
    ['fraction', '分式运算', '在定义域内化简并合并有理式。', 'algebra'],
    ['functions-calc', '指数、对数与三角变形', '依照指数、对数、三角关系选择改写。', 'math-functions'],
    ['equations', '方程求解', '在原方程定义域内获得解集。', 'math-prep'],
    ['quadratic', '一元二次方程', '利用系数、根和图像信息求解或判根。', 'equations'],
    ['parametric', '含参数二次方程', '按参数使次数或根的性质变化的位置分情况。', 'quadratic'],
    ['inequality', '二次与分式不等式', '按符号与临界点确定解集。', 'math-prep'],
  ]),
  ...groups('english', [
    ['information','细节理解题','定位题干条件对应的原文，并核对同义改写。','reading'],
    ['inference','推理判断题','根据证据作有限推论，辨认作者态度和目的。','reading'],
    ['en-main-idea','主旨大意题','提炼全文主题与核心观点，辨别合适的标题。','reading'],
    ['vocabulary','词义猜测题','用构词、搭配和上下文推断语境义。','reading'],
    ['syntax','长难句辅助','借助谓语、连接词与修饰边界还原句子结构。','reading'],
    ['discourse','语篇衔接辅助','识别上下文的指代、转折和因果。','reading'],
    ['strategy','选项辨析与时间分配','核对证据与选项，安排答题和回查。','reading'],
  ]),
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
