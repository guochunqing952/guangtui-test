import React, { useState, useEffect } from 'react';
import { SettingOutlined } from '@ant-design/icons'
import { Select, Button } from "antd"
import { labelColorList } from './constants';
import "./app.css";

const { Option } = Select;
interface LabelItem {
    name: string;
    description?: string;
    color: string;
}
// 功能点
// 1、支持单选、多选；
// 2、支持数据的异步加载，可以自己模拟一个 json 文件；
// 3、支持键盘操作，上下选择、回车确认，高亮显示当前选项；
// 4、支持输入后筛选内容。

export default function App() {
    const [showSelectLabelsConfig, setShowSelectLabelsConfig] = useState(false);// 展示选择列表
    const [labelList, setLabelList] = useState<LabelItem[]>([]);// 列表项有哪些
    const [selectedLabelNameList, setSelectedLabelNameList] = useState<string[]>([]); // 选择的列表项

    useEffect(() => {
        // 支持数据的异步加载，mock 简单的 json 文件；
        (
            async () => {
                const response = await fetch(`${process.env.PUBLIC_URL}/test.json`)
                const { data } = await response.json();
                const changedData = data.map((item: any, index: number) => ({ ...item, color: labelColorList[index] }))
                setLabelList(changedData)
            }
        )()
    }, [])

    // 列表项详细配置
    const labelOptionList = labelList.map((label, index) => {
        return (
            <Option
                key={label.name}
                value={label.name}
                className="option"
            >
                <div>
                    <span style={{ background: label.color }} className="label-icon" />
                    <span>{label.name}</span>
                </div>
                <div>{label.description}</div>
            </Option>
        )
    })

    // 得到选择的列表名称列表
    const selectedLabelNames = selectedLabelNameList.map((name, index) => {
        const color = labelList.filter(label => label.name === name)?.[0].color;
        return (
            <div
                style={{ background: color }}
                key={name}
                className="target-config"
            >
                {name}
            </div>
        )
    })

    // Selct组件支持键盘操作，上下选择、回车确认，高亮显示当前选项；
    // Selct组件直接支持输入后筛选内容。
    // 点击列表右侧的按钮进行选项确认，点击上方的设置icon，展示列表选项
    return (
        <div className="label-warpper">
            <div className="header">
                <span>Labels </span>
                <SettingOutlined onClick={() => setShowSelectLabelsConfig(true)} className="setting-icon" />
            </div>
            {showSelectLabelsConfig &&
                <div>
                    <div>选择配置项列表</div>
                    <Select
                        placeholder="请选择配置项列表"
                        mode="multiple" // 该配置上下拉列表支持单选、多选；
                        onChange={(val: any) => setSelectedLabelNameList(val)}
                        className="select-list"
                        value={selectedLabelNameList}
                    >
                        {labelOptionList}
                    </Select>
                    <Button onClick={() => setShowSelectLabelsConfig(false)}>确认</Button>
                </div>
            }
            {!showSelectLabelsConfig && <div >{selectedLabelNames}</div>}
        </div>
    );
}
