import type { Node, Subject } from './types.ts'

export const subjects: Subject[] = [
  { id: 'math', name: '数学', mark: '∑', focus: '必修与选择性必修，覆盖函数、几何、数列、导数和概率统计。' },
  { id: 'physics', name: '物理', mark: 'φ', focus: '力学、电磁学、热光波、近代物理和实验。' },
]

const groups = (subject: Subject['id'], rows: [string, string, string, string?][]): Node[] =>
  rows.map(([id, name, definition, parent]) => ({ id, subject, name, definition, parent }))

export const chapters = [
  ...groups('math', [
    ['math-curriculum', '数学知识目录', '通过必修和选择性必修两个目录定位概念、公式及其使用条件。'],
    ['math-required', '必修', '集合与逻辑、函数、几何、概率统计和数学建模。','math-curriculum'],
    ['math-prep', '预备知识', '集合、逻辑、等式与不等式，以及二次函数与方程。','math-required'],
    ['math-functions', '函数', '定义域与性质、指数与对数、三角函数和零点。','math-required'],
    ['math-trig-tools', '三角恒等变形', '单位圆、同角关系、诱导公式、和差角及二倍角。','math-functions'],
    ['math-geometry', '几何与代数', '平面向量、解三角形、复数、立体几何初步。','math-required'],
    ['math-data-basic', '概率与统计', '随机事件、样本和数字特征。','math-required'],
    ['math-selective', '选择性必修', '数列与导数、空间向量与解析几何、计数及概率统计。','math-curriculum'],
    ['math-advanced-functions', '数列与导数', '离散变化规律与瞬时变化率。','math-selective'],
    ['math-sequence-chapter', '数列', '等差、等比、由前项和求通项与裂项求和。','math-advanced-functions'],
    ['math-derivative-chapter', '导数', '切线、单调性、极值及最值。','math-advanced-functions'],
    ['math-advanced-geometry', '空间向量与解析几何', '把空间和曲线的位置关系转化为可计算的方程。','math-selective'],
    ['math-analytic-chapter', '平面解析几何', '直线、圆、圆锥曲线及弦长。','math-advanced-geometry'],
    ['math-advanced-data', '计数、概率与统计', '计数原理、条件概率、随机变量与统计推断。','math-selective'],
    ['calculation', '代数变形', '整式和分式的等价变形，注意定义域与可逆性。','math-prep'],
    ['algebra', '代数式运算', '通过恒等变形将代数式整理为目标形式。','calculation'],
    ['polynomial', '整式运算', '按幂次整理或拆解多项式。','algebra'],
    ['fraction', '分式运算', '在定义域内化简并合并有理式。','algebra'],
    ['functions-calc', '指数与对数变形', '在保留底数和定义域条件时统一底数或合并对数。','math-functions'],
    ['equations', '方程求解', '在原方程定义域内获得解集。','math-prep'],
    ['quadratic', '一元二次方程', '利用系数、根和图像信息求解或判根。','equations'],
    ['parametric', '含参数二次方程', '按参数使次数或根的性质变化的位置分情况。','quadratic'],
    ['inequality', '二次与分式不等式', '按符号与临界点确定解集。','math-prep'],
  ]),
  ...groups('physics', [
    ['physics-mechanics', '力学', '运动图像、受力分析、牛顿定律、曲线运动、功与能、引力和动量。'],
    ['physics-electricity', '电磁学', '电场、电路、磁场、电磁感应、交流电和传感器。'],
    ['physics-modern', '热学、光学、振动与波、近代物理', '从物理模型与适用条件入手，区分容易混淆的物理量。'],
    ['physics-experiments', '物理实验', '测量原理、图像处理和误差方向。'],
  ]),
]
