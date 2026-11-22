import type { Guide } from './types.ts'

export const englishGuides: Guide[] = [
  {
    id: 'en-listen', subject: 'english', kind: '英语题型', name: '听力',
    definition: '抓住对话中的时间、地点、人物关系和说话意图。',
    points: [
      '读题时先确认问的是当前安排、改变后的安排还是说话者的判断。听到 but、instead、actually 时留意信息更新。',
      '记必要线索，例如时间、否定、转折后的结果。没有听到的细节不要用生活常识补齐。',
    ],
    example: {
      prompt: '听录音，判断两人最后约在几点见面。可先听，再打开解析核对。',
      audioText: 'Can we meet at three? I have a class until four. How about half past four? That works for me.',
      answer: '最后约在 4:30。三点是初始提议，四点是下课时间。录音原文：Can we meet at three? I have a class until four. How about half past four? That works for me.',
    },
    check: {
      prompt: '听录音。说话人最终决定从哪个入口进去？',
      audioText: 'We usually use the east door. But it is closed today. Let us go in through the south entrance.',
      answer: '南门。east door 是往常的选择。录音原文：We usually use the east door. But it is closed today. Let us go in through the south entrance.',
    },
  },
  {
    id: 'reading', subject: 'english', kind: '英语题型', name: '阅读理解',
    definition: '按细节理解、推理判断、主旨大意和词义猜测四类题找证据。',
    points: [
      '细节题回到题干指定的人、时间和条件，核对选项改写。推断题找能支持结论的最短证据链，保留原文的范围和语气。',
      '主旨题说清全文主题和主要观点。词义题用上下文提出释义，把释义代回词所在句检查。',
    ],
    example: {
      prompt: 'The club once met indoors. This spring, members moved outside so younger learners could join. Why did the club move outdoors?',
      answer: 'To allow younger learners to join. 问原因，直接定位 so 后的内容即可。',
    },
  },
  {
    id: 'en-gap-fill', subject: 'english', kind: '英语题型', name: '七选五',
    definition: '用段落功能、指代关系和逻辑衔接判断缺句。',
    points: [
      '先判空格帮助开启、承接、举例还是收束。再回到空格两侧检查人称、单复数、指代对象和逻辑方向。',
      '填完重读整个段落。选项与前一句能接上还不够，后一句的代词和论证方向也需要吻合。',
    ],
    example: {
      prompt: 'A notice can be clear in print but hard to read on a phone. ___. This lets people find the date and place without scrolling. A. Put the key details at the top. B. Print the notice on thicker paper.',
      answer: '选 A。This 指把关键信息放在顶部，后一句说明这种调整在手机上的效果。',
    },
    check: {
      prompt: 'Some walkers bring reusable bottles. ___. These stations make refilling easy. A. The park has installed water stations. B. Reusable bottles come in many colours.',
      answer: '选 A。These stations 需要前文提供对应对象，整段也围绕补水展开。',
    },
  },
  {
    id: 'en-cloze', subject: 'english', kind: '英语题型', name: '完形填空',
    definition: '结合故事发展、词义和搭配判断整段中最合适的词。',
    points: [
      '先读清人物、目标和发生的变化，再处理空格。用相邻句排除意思不符的词，用后文核对人物态度和因果。',
      '几个选项都能搭配时，比较哪个动作能解释后文结果。做完连读，特别检查转折后的语义方向。',
    ],
    example: {
      prompt: 'Jia had never fixed a bicycle. She almost gave up, but a neighbour offered to __ her through each step. By noon, the bicycle was working again. A. guide B. carry C. push D. hide',
      answer: '选 guide。through each step 和自行车修好表明邻居逐步指导她。单独看单词无法得出这个具体行动。',
    },
    check: {
      prompt: 'The light went out. As no one could see the labels, we __ the experiment until morning. A. paused B. shared C. proved D. measured',
      answer: '选 paused。照明故障让实验暂时无法继续，until morning 与暂停吻合。',
    },
  },
  {
    id: 'en-language', subject: 'english', kind: '英语题型', name: '语法填空',
    definition: '先找句法缺口，再用结构、时态和上下文确定词形。',
    points: [
      '遇到动词提示词，先标从句边界，再检查该分句是否已有谓语。需要谓语时处理时态、语态与主谓一致；已有谓语时检查是否需非谓语。',
      '没有提示词时，查看句子缺少冠词、介词、代词或连接成分。填完重读，检查语义和语法同时成立。',
    ],
    example: {
      prompt: 'The bridge, ___ (build) in 1920, was reopened last month.',
      answer: '填 built。主句已有谓语 was reopened，build 作补充修饰。bridge 是被建造的对象，用过去分词。',
    },
    check: {
      prompt: 'Last winter, the volunteers ___ (collect) more than 200 coats for the shelter.',
      answer: '填 collected。主语 volunteers 后需要谓语，Last winter 提供明确的过去时间。',
    },
  },
  {
    id: 'en-write', subject: 'english', kind: '英语题型', name: '应用文写作',
    definition: '按身份、对象和写作目的组织信息，用合适的语气完成任务。',
    points: [
      '先圈身份、收件对象、写作目的和要求覆盖的要点。开头表明来意，中间交代必要内容，结尾给出行动或回应方式。',
      '邀请、道歉和建议需要不同的语气。检查读者能否据此行动，特别是时间、地点和联系方式之类的实际信息。',
    ],
    example: {
      prompt: '你要邀请交换生参加周五下午四点在校图书馆举办的读书分享会。给出开头及活动安排。',
      answer: 'I’d like to invite you to our book-sharing session at 4 p.m. this Friday in the school library. Please bring a book you enjoyed and be ready to tell us why you liked it.',
    },
    check: {
      prompt: '为学校图书馆写一句倡议，既说清问题，又给出可执行做法。',
      answer: '参考：Some library books have been returned with notes on their pages, so please write on a separate sheet and leave the books clean for the next reader.',
    },
  },
  {
    id: 'en-continuation', subject: 'english', kind: '英语题型', name: '读后续写',
    definition: '接住原文的冲突和人物动机，再用两段完成合理的情节发展。',
    points: [
      '先记人设、关系、场景和冲突，圈出可回收的线索。两段首句都要读，尤其要倒推第一段如何接到第二段。',
      '先把故事写通，再用动作、对话或感知表现情绪。避免突然增加能解决所有问题的人物和巧合。',
    ],
    example: {
      prompt: '原文：Leo 怕在台上忘词，练习伙伴 Mia 给他一张写着三个关键词的小卡片。首段开头：When Leo stepped onto the stage, his mind went blank. 次段开头：After the talk, Leo found Mia by the door. 第一段可以怎样发展？',
      answer: '先写他停顿并摸到卡片，借三个词找回演讲线索，逐渐讲完。第二段再回到 Mia，写感谢与人物成长。卡片是原文提供的伏笔。',
    },
    check: {
      prompt: '如果第一段写 Leo 当场离开，第二段仍以 After the talk 开头，需要补上什么？',
      answer: '需说明他怎样回到舞台并完成演讲，否则次段首句与第一段的结尾断裂。',
    },
  },
]
