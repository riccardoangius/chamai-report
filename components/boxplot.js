
import ReactECharts from 'echarts-for-react';

import { useEffect } from 'react';
import { usePrepareData } from './prepareData'
import { useChartWidth } from './chartwidth';

export const BoxPlot = props => {
    const { scoreQuestionsBySection } = props;
    const { width } = useChartWidth();
    const { answersBySection, ready, source, boxData, colors, categories, labeller } = usePrepareData({ scoreQuestionsBySection });

    useEffect(() => {
        if (answersBySection) {
            // console.log('answersBySection', answersBySection)
            // console.log('dict: ', Object.values(answersBySection))
            // Object.values(answersBySection).map(s => { console.log(s); return 0 })
        }
    }, [answersBySection]);

    useEffect(() => {
        if (source) {
            // console.log('source', source)
            // console.log('labeller', labeller)
            // console.log('dict: ', Object.values(answersBySection))
            // Object.values(answersBySection).map(s => { console.log(s); return 0 })
        }
    }, [source, labeller]);

    const option = ready && {

        title: [
            {
                text: 'Distribution of answers',
                left: '0',
                top: '0%'
            },
            {
                text: 'Upper: Q3 + 1.5 * IQR \nLower: Q1 - 1.5 * IQR\nIQR: Q3 - Q1',
                
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 14,
                    lineHeight: 20
                },
                left: '10%',
                bottom: '0%'
            }
        ],
        dataset: [
            {
                source,
            },
            {
                transform: {
                    type: 'boxplot'
                },
            },
            {
                fromDatasetIndex: 1,
                fromTransformResult: 1
            }
        ],

        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            containLabel: true,
            backgroundColor: 'white',
            show: true
        },
        yAxis: {
            type: 'category',
            name: 'Survey Section',
            axisData: categories,
            axisLabel: {
                formatter: labeller,
            },
            boundaryGap: true,
            nameGap: 30,
            splitArea: {
                show: true
            },
            splitLine: {
                show: false
            }
        },
        xAxis: {
            min: 1,
            max: 6,
            type: 'value',
            name: 'Score',
            splitArea: {
                show: false
            }
        },
        series: [
            {
                name: 'boxplot',
                type: 'boxplot',
                data: boxData,
                colorBy: 'data',

            },
            {
                name: 'outlier',
                type: 'scatter',
                datasetIndex: 2
            }
        ],
        color: colors,
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            },

            formatter: function (param) {

                if (param.componentSubType != 'scatter') {

                    return [
                        `<b>${labeller(param.name)}</b>`,
                        'Upper: ' + param.data.value[5],
                        'Q3: ' + param.data.value[4],
                        'Median: ' + param.data.value[3],
                        'Q1: ' + param.data.value[2],
                        'Lower: ' + param.data.value[1]
                    ].join('<br/>')
                }
                return ''
            }

        },

    };

    return (
        option && <ReactECharts showLoading={!ready} option={option} style={{ width, height: '500px' }}
        />

    )
}