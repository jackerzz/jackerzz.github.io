---
title: Prompt Engineering co star framework(提示词工程架构)

tags:
  - nlp
categories:
  - llm 
date: 2024-07-12 23:01:52
---
# 什么事co star framework
```md
CO-STAR Framework 是一个在 Prompt 工程中具有重要应用的框架。例如在新加坡政府举办的 Prompt 工程大赛中，它曾获得冠军。

CO-STAR Framework 的主要特点和应用方式如下：
(C)上下文：为任务提供背景信息，通过为大语言模型(LLM)提供详细的背景信息，帮助其精确理解讨论的具体场景，确保提供的反馈具有相关性。
(O)目标：明确要求大语言模型完成的任务，清晰界定任务目标，使大语言模型更专注地调整其回应以实现这一具体目标。
(S)风格：明确期望的写作风格，可以指定一个特定的著名人物或某个行业专家的写作风格，指导大语言模型以符合需求的方式和词汇选择进行回应。
(T)语气：设置回应的情感调，设定适当的语气，确保大语言模型的回应能够与预测的情感或情绪背景相协调。
(A)受众：识别目标受众，针对特定受众定制大语言模型的回应，确保内容在特定上下文中适当且容易理解。
®响应：规定输出的格式，确定输出格式是为了确保大语言模型按照具体需求进行输出，便于执行下游任务。常见的格式包括列表、JSON 格式的数据、专业报告等，对于大部分需要程序化处理大语言模型输出的应用来说，JSON 格式是理想的选择。

CO-STAR Framework 为构建有效的提示语提供了结构化的方法，有助于优化大语言模型的回答效果，在各种应用场景中具有重要的价值。 
### CO-STAR Framework 在不同领域的应用案例
CO-STAR Framework 在多个领域都有着广泛的应用。例如在自然语言处理领域，它能够为模型提供精确的任务背景、明确的目标设定、特定的写作风格、恰当的语气控制、准确的受众识别以及规定的响应格式，从而帮助模型生成更贴合需求的回答。在软件开发中，通过明确软件需求的上下文、目标、风格等，提高开发效率和质量。以一个在线购物网站的开发为例，运用 CO-STAR Framework 可以清晰地定义用户界面的设计风格，是简洁现代还是复古华丽；明确用户需求的目标，是提供快速便捷的购物体验还是强调商品的丰富多样性；确定回复用户咨询的语气，是热情友好还是专业严谨；识别主要受众是年轻消费者还是成熟消费者；规定数据输出格式，如订单详情是以列表还是图表形式呈现。在自动化测试领域，CO-STAR Framework 可以为测试脚本的编写提供结构化的指导，确保测试任务的准确性和有效性。
### CO-STAR Framework 的优化策略
为了进一步优化 CO-STAR Framework，可以从多个方面入手。首先，在上下文方面，应不断丰富和细化背景信息，确保大语言模型对任务的理解更加全面和深入。比如，在进行文本生成任务时，不仅提供主题相关的基本信息，还可以包括类似文本的风格特点、目标受众的偏好等细节。在目标设定上，要更加明确和具体，将复杂的任务分解为多个可量化和可操作的小目标。例如，在内容推荐任务中，明确是基于用户的浏览历史、兴趣标签还是实时行为来进行推荐。对于写作风格，可以建立更多样化的风格库，涵盖不同行业、领域和文化背景的特点。在语气控制方面，引入更多情感分析工具和技术，以更精准地设定和调整语气。在受众识别上，利用大数据和机器学习算法，对受众进行更细致的分类和画像。最后，在响应格式方面，根据不同的应用场景和需求，定制更多个性化的输出格式。
### 如何评估 CO-STAR Framework 的效果
评估 CO-STAR Framework 的效果可以从多个维度进行考量。一是准确性，检查模型生成的回答是否准确地满足了设定的目标和需求。例如，在问答系统中，回答是否切中问题的核心，提供的信息是否准确无误。二是相关性，判断生成的内容与提供的上下文和目标的关联程度。比如在文本摘要任务中，摘要是否紧密围绕原文的主旨。三是风格和语气的一致性，确保生成的文本在风格和语气上符合预设。例如在商务写作中，是否保持了专业、正式的风格。四是受众适应性，考察输出是否适合目标受众的理解水平和需求。例如为儿童编写的故事，语言是否简单易懂、充满趣味。五是效率，观察使用该框架是否提高了模型的响应速度和资源利用效率。通过对大量实际应用案例的分析和比较，综合以上多个方面的评估指标，可以全面、客观地评价 CO-STAR Framework 的效果。
### CO-STAR Framework 与其他框架的比较
CO-STAR Framework 与其他框架相比，具有自身的独特优势。与传统的框架相比，CO-STAR Framework 更加注重对任务的全面定义和结构化描述，包括上下文、目标、风格、语气、受众和响应等多个方面。以 ICIO 框架为例，它将指令内容分为角色、任务、背景知识等部分，而 CO-STAR Framework 则在此基础上进一步细化和扩展了对任务要素的描述。与一些特定领域的框架相比，如在自动化测试领域的 Robot Framework，CO-STAR Framework 具有更广泛的适用性，不仅局限于某一特定领域，而是能够应用于多种自然语言处理任务和场景。然而，不同框架在不同的应用场景中都有其价值，具体的选择应根据实际需求和任务特点来决定。
### CO-STAR Framework 的发展趋势
随着技术的不断进步和应用需求的日益增长，CO-STAR Framework 呈现出以下发展趋势。一方面，它将与更先进的人工智能技术深度融合，如深度学习、强化学习等，以提升框架的性能和适应性。另一方面，CO-STAR Framework 将更加注重个性化和定制化，以满足不同用户和行业的特定需求。例如，在医疗领域，根据不同病症和患者群体的特点，定制特定的提示策略。同时，随着多语言和跨文化交流的增加，CO-STAR Framework 也将不断优化对多种语言和文化背景的支持，提高在全球范围内的应用效果。此外，与其他技术框架和工具的集成将成为发展的重要方向，以构建更强大、更全面的解决方案。

综上所述，CO-STAR Framework 在不同领域展现出了广泛的应用前景和潜力，通过不断优化、评估和与其他技术的融合，将为自然语言处理和相关领域带来更多的创新和突破。
```

# colab 中案例
- [colab Basic Prompting](https://colab.research.google.com/github/dmatrix/genai-cookbook/blob/main/llm-prompts/1_how_to_use_basic_prompt.ipynb)
- [how to conduct common nlp llm tasks](https://colab.research.google.com/github/dmatrix/genai-cookbook/blob/main/llm-prompts/2_how_to_conduct_common_nlp_llm_tasks.ipynb)
- [GenAI Cookbook-向量嵌入的简明直观指南：生成式人工智能的构建块](https://github.com/dmatrix/genai-cookbook/blob/main/README.md)
- [`llm-prompts-github`](https://github.com/dmatrix/genai-cookbook/tree/main/llm-prompts)
- [OpenAI和Anyscale端点函数调用](https://github.com/dmatrix/genai-cookbook/tree/main/function-calling)


# [抖音-——豆包使用](https://www.doubao.com/chat/68166286883074)
## requests
```md
# CONTEXT # 
I am a personal productivity developer. In the realm of personal development and productivity, there is a growing demand for systems that not only help individuals set goals but also convert those goals into actionable steps. Many struggle with the transition from aspirations to concrete actions, highlighting the need for an effective goal-to-system conversion process.

#########

# OBJECTIVE #
Your task is to guide me in creating a comprehensive system converter. This involves breaking down the process into distinct steps, including identifying the goal, employing the 5 Whys technique, learning core actions, setting intentions, and conducting periodic reviews. The aim is to provide a step-by-step guide for seamlessly transforming goals into actionable plans.

#########

# STYLE #
Write in an informative and instructional style, resembling a guide on personal development. Ensure clarity and coherence in the presentation of each step, catering to an audience keen on enhancing their productivity and goal attainment skills.

#########

# Tone #
 Maintain a positive and motivational tone throughout, fostering a sense of empowerment and encouragement. It should feel like a friendly guide offering valuable insights.

# AUDIENCE #
The target audience is individuals interested in personal development and productivity enhancement. Assume a readership that seeks practical advice and actionable steps to turn their goals into tangible outcomes.

#########

# RESPONSE FORMAT #
Provide a structured list of steps for the goal-to-system conversion process. Each step should be clearly defined, and the overall format should be easy to follow for quick implementation. 

#############

# START ANALYSIS #
If you understand, ask me for my goals.
```
## 如何保持目标的积极性和动力？
### response
```md
以下是一些关于目标设定的最佳实践：

**1. 明确性（Specific）**
 - 清晰地定义目标的具体内容，避免模糊不清。例如，不要说“我要变得更健康”，而是“我要在三个月内通过每周至少三次的锻炼，将体重减轻 5 公斤，并将体脂率降低 3%”。
 - 明确目标的衡量标准，比如“我要在本季度末将销售额提高 20%”，这里的“20%”就是明确的衡量标准。

**2. 可衡量性（Measurable）**
 - 确定能够量化目标进展的指标。比如，如果目标是提高英语水平，可设定为“在两个月内通过雅思考试，达到总分 6.5 分”。
 - 为目标设定具体的数字、时间或程度，如“每天学习英语 2 小时”。

**3. 可实现性（Attainable）**
 - 基于自身的资源、能力和条件来设定目标。比如，一个没有编程基础的人，不宜将目标设为“一个月内成为高级程序员”，而可以是“三个月内掌握基础编程知识”。
 - 考虑过去的经验和现有能力，逐步挑战自己，但不要过度超出能力范围。

**4. 相关性（Relevant）**
 - 确保目标与个人的长期愿景、价值观和当前需求相关。比如，如果您的职业规划是成为市场营销专家，那么学习市场营销相关的知识和技能就是相关目标。
 - 目标应与个人的生活、工作或兴趣领域有直接的联系。

**5. 时限性（Time-bound）**
 - 为目标设定明确的截止日期，这能增加紧迫感和行动力。例如，“在今年年底前完成小说的初稿”。
 - 分解长期目标为阶段性的短期目标，并为每个阶段设定时间节点，如“在本月内完成小说大纲，下个月完成前 5 章的内容”。

**6. 平衡与多样性**
 - 涵盖生活的不同方面，如事业、健康、家庭、个人成长等，避免过度专注于某一方面。比如，既设定工作上的晋升目标，也设定保持每周运动三次的健康目标。
 - 保持不同类型目标之间的平衡，以实现全面发展。

**7. 灵活性**
 - 认识到外部环境和自身情况可能发生变化，愿意适时调整目标。比如，由于突发的工作变动，原本设定的旅行计划可能需要推迟或修改。
 - 但也要注意不要过于频繁地改变目标，以免失去方向。

**8. 可视化与分享**
 - 将目标写下来或制作成图片、图表等视觉形式，放在显眼的位置，时刻提醒自己。
 - 与他人分享目标，获得支持和监督，增加实现目标的动力和责任感。

**9. 定期回顾与调整**
 - 定期检查目标的进展情况，分析是否按计划进行。
 - 如果发现偏差，及时调整策略和行动方案，以确保最终能够实现目标。

希望这些最佳实践对您设定有效的目标有所帮助！
```


# 参考资料
- [`最佳LLM响应的最佳提示技巧`](https://medium.com/the-modern-scientist/best-prompt-techniques-for-best-llm-responses-24d2ff4f6bca)
- [释放COSTAR快速工程的力量：将目标转化为可操作项目系统的指南和示例](https://medium.com/@frugalzentennial/unlocking-the-power-of-costar-prompt-engineering-a-guide-and-example-on-converting-goals-into-dc5751ce9875)
- [通过CO-STAR框架提示提高GPT的潜力](https://generativeai.pub/boost-your-gpts-potential-with-co-star-framework-prompt-e53ed0917df0)