---
title:  PaddleNLP信息抽取技术
tags:
  - deepLearning
categories:
  - nlp 
date: 2023-03-21
---
- [PaddleNLP信息抽取技术重磅升级！开放域信息抽取来了！三行代码用起来](https://aistudio.baidu.com/aistudio/projectdetail/3914778?channelType=0&channel=0)
- [金融智能核验：扫描合同关键信息抽取](https://aistudio.baidu.com/aistudio/projectdetail/4434018?channelType=0&channel=0)
- [智能语音指令解析系统全流程搭建，实现语音工单信息抽取](https://aistudio.baidu.com/aistudio/projectdetail/4399703?contributionType=1)
## 信息抽取定义以及难点
- 自动从无结构或半结构的文本中抽取出结构化信息的任务, 主要包含的任务包含了实体识别、关系抽取、事件抽取、情感分析、评论抽取等任务; 同时信息抽取涉及的领域非常广泛，信息抽取的技术需求高，下面具体展现一些示例

![](https://ai-studio-static-online.cdn.bcebos.com/e6930d6fc8004a67976368346d2a1e96b08fd4f15b0a45c68371936e482173dd#pic_center)

- 需求跨领域跨任务：领域之间知识迁移难度高，如通用领域知识很难迁移到垂类领域，垂类领域之间的知识很难相互迁移；存在实体、关系、事件等不同的信息抽取任务需求。
- 定制化程度高：针对实体、关系、事件等不同的信息抽取任务，需要开发不同的模型，开发成本和机器资源消耗都很大。
- 训练数据无或很少：部分领域数据稀缺，难以获取，且领域专业性使得数据标注门槛高。
- 针对以上难题，中科院软件所和百度共同提出了一个大一统诸多任务的通用信息抽取技术 UIE（Unified Structure Generation for Universal Information Extraction）。
- UIE在实体、关系、事件和情感等4个信息抽取任务、13个数据集的全监督、低资源和少样本设置下，UIE均取得了SOTA性能。

PaddleNLP结合文心大模型中的知识增强NLP大模型ERNIE 3.0，发挥了UIE在中文任务上的强大潜力，开源了首个面向通用信息抽取的产业级技术方案，不需要标注数据（或仅需少量标注数据），即可快速完成各类信息抽取任务。


## speech_web
- ![](https://user-images.githubusercontent.com/30135920/196076507-7eb33d39-2345-4268-aee7-6270b9ac8b98.png)
- [](https://github.com/PaddlePaddle/PaddleSpeech/tree/develop/demos/speech_web)
- 语音聊天：PaddleSpeech 的语音识别能力+语音合成能力，对话部分基于 PaddleNLP 的闲聊功能
- 声纹识别：PaddleSpeech 的声纹识别功能展示
- 语音识别：支持【实时语音识别】，【端到端识别】，【音频文件识别】三种模式
- 语音合成：支持【流式合成】与【端到端合成】两种方式
- 语音指令：基于 PaddleSpeech 的语音识别能力与 PaddleNLP 的信息抽取，实现交通费的智能报销


## PaddleOCR + PaddleNLP优势
扫描合同的关键信息提取可以使用 PaddleOCR + PaddleNLP 组合实现，两个工具均有以下优势: 
- 使用简单:whl包一键安装，3行命令调用
- 效果领先:优秀的模型效果可覆盖几乎全部的应用场景
- 调优成本低:OCR模型可通过后处理参数的调整适配略有偏差的扫描文本，UIE模型可以通过极少的标注样本微调，成本很低。



## OCR 参数
- configs/det/ch_PP-OCRv2_det_student.yml
```yml
Global.epoch_num: 1200:本实验设置为100
Global.pretrained_model：指向预训练模型路径
Train.dataset.data_dir：指向训练集图片存放目录
Train.dataset.label_file_list：指向训练集标注文件
Eval.dataset.data_dir：指向验证集图片存放目录
Eval.dataset.label_file_list：指向验证集标注文件
Optimizer.lr.learning_rate：调整学习率，本实验设置为0.005
Train.dataset.transforms.EastRandomCropData.size：训练尺寸改为[1600, 1600]
Eval.dataset.transforms.DetResizeForTest：评估尺寸，添加如下参数
limit_side_len: 1600
limit_type: 'min'
```

- configs/det/ch_PP-OCRv2/ch_PP-OCRv2_det_distill.yml
```yml
Eval.dataset.data_dir：指向验证集图片存放目录
Eval.dataset.label_file_list：指向验证集标注文件
```


## 数据预处理
DecodeImage: 将图像转为Numpy格式
ResizeTableImage: 对图片进行resize，长边resize到指定尺寸，短边等比例缩放
TableLabelEncode: 解析标注文件中的标签信息，并按统一格式进行保存
NormalizeImage: 通过规范化手段，把神经网络每层中任意神经元的输入值分布改变成均值为0，方差为1的标准正太分布，使得最优解的寻优过程明显会变得平缓，训练过程更容易收敛；
PaddingTableImage: 对图像的短边进pad，将其pad到和长边一样的尺寸
ToCHWImage: 图像的数据格式为[H, W, C]（即高度、宽度和通道数），而神经网络使用的训练数据的格式为[C, H, W]，因此需要对图像数据重新排列，例如[224, 224, 3]变为[3, 224, 224]；
KeepKeys: dict过滤


## 配置解释
```yml
Architecture : 
    Backbone : 
        name : PPLCNet
        pretrained : True
        scale : 1.0
        use_ssld : True
    Head : 
        hidden_size : 256
        loc_reg_num : 8
        max_text_length : 500
        name : SLAHead
    Neck : 
        name : CSPPAN
        out_channels : 96
    algorithm : SLANet
    model_type : table
Eval : 
    dataset : 
        data_dir : /home/aistudio/data/data165849
        label_file_list : ['/home/aistudio/val.txt']
        name : PubTabDataSet
        transforms : 
            DecodeImage : 
                channel_first : False
                img_mode : BGR
            TableLabelEncode : 
                learn_empty_box : False
                loc_reg_num : 8
                max_text_length : 500
                merge_no_span_structure : True
                replace_empty_cell_token : False
            TableBoxEncode : 
                in_box_format : xyxyxyxy
                out_box_format : xyxyxyxy
            ResizeTableImage : 
                max_len : 488
            NormalizeImage : 
                mean : [0.485, 0.456, 0.406]
                order : hwc
                scale : 1./255.
                std : [0.229, 0.224, 0.225]
            PaddingTableImage : 
                size : [488, 488]
            ToCHWImage : None
            KeepKeys : 
                keep_keys : ['image', 'structure', 'bboxes', 'bbox_masks', 'shape']
    loader : 
        batch_size_per_card : 48
        drop_last : False
        num_workers : 1
        shuffle : False
Global : 
     box_format : xyxyxyxy
     cal_metric_during_train : True
     character_dict_path : ppocr/utils/dict/table_structure_dict_ch.txt
     character_type : ch
     checkpoints : None
     distributed : False
     epoch_num : 150
     eval_batch_step : [0, 375]
     infer_img : ppstructure/docs/table/table.jpg
     infer_mode : False
     log_smooth_window : 20
     max_text_length : 500
     pretrained_model : ./pretrain_models/ch_ppstructure_mobile_v2.0_SLANet_train/best_accuracy.
     print_batch_step : 20
     save_epoch_step : 400
     save_inference_dir : ./output/SLANet_ch/infer
     save_model_dir : output/SLANet_ch/
     save_res_path : output/infer
     use_gpu : True
     use_sync_bn : True
     use_visualdl : False
 Loss : 
     loc_loss : smooth_l1
     loc_weight : 2.0
     name : SLALoss
     structure_weight : 1.0
 Metric : 
     box_format : xyxyxyxy
     compute_bbox_metric : False
     del_thead_tbody : True
     loc_reg_num : 8
     main_indicator : acc
     name : TableMetric
 Optimizer : 
     beta1 : 0.9
     beta2 : 0.999
     clip_norm : 5.0
     lr : 
         learning_rate : 0.0005
         name : Const
         warmup_epoch : 0
     name : Adam
     regularizer : 
         factor : 0.0
         name : L2
 PostProcess : 
     merge_no_span_structure : True
     name : TableLabelDecode
 Train : 
     dataset : 
         data_dir : /home/aistudio/data/data165849
         label_file_list : ['/home/aistudio/train.txt']
         name : PubTabDataSet
         transforms : 
             DecodeImage : 
                 channel_first : False
                 img_mode : BGR
             TableLabelEncode : 
                 learn_empty_box : False
                 loc_reg_num : 8
                 max_text_length : 500
                 merge_no_span_structure : True
                 replace_empty_cell_token : False
             TableBoxEncode : 
                 in_box_format : xyxyxyxy
                 out_box_format : xyxyxyxy
             ResizeTableImage : 
                 max_len : 488
             NormalizeImage : 
                 mean : [0.485, 0.456, 0.406]
                 order : hwc
                 scale : 1./255.
                 std : [0.229, 0.224, 0.225]
             PaddingTableImage : 
                 size : [488, 488]
             ToCHWImage : None
             KeepKeys : 
                 keep_keys : ['image', 'structure', 'bboxes', 'bbox_masks', 'shape']
     loader : 
         batch_size_per_card : 48
         drop_last : True
         num_workers : 1
         shuffle : True
 profiler_options : None
```