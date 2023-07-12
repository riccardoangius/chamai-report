
import ReactECharts from 'echarts-for-react';
import { usePrepareData } from './prepareData'
import { scores, scoreColours } from './common'

import { useChartWidth } from './chartwidth';

export const BarChart = props => {
    const { scoreQuestionsBySection } = props;

    const { frequencies, ready, colors, categories, labeller } = usePrepareData({ scoreQuestionsBySection });

    const { width } = useChartWidth();

    let series;

    if (ready) {

        series = scores.map(score => ({
            name: score.toString(),
            type: 'bar',
            data: frequencies.map(f => f[score]),
            itemStyle: {
                color: scoreColours[score]
            },
            stack: '1'
        }))
    }

    const option = ready && {

        title: [{
            text: 'Frequency of answers',
            left: '0',
            top: '0%'
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
        legend: {
            data: scores.map(s => s.toString()),
            bottom: 0
        },
        yAxis: {
            data: categories,
            name: 'Survey Section'
        },
        xAxis: {
            min: 0,
            max: 100,
            name: 'Proportion'
        },

        series,
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            },

            formatter: function (param) {

                if (param.componentSubType != 'scatter') {
                    
                    return [
                        `<b>${param.name}</b>`,
                        `<i>Score ${param.seriesName}</i>: ${Number.parseFloat(param.data).toFixed(1)}%`
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