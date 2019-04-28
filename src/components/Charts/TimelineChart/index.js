import React from 'react';
import { formatMessage } from 'umi/locale';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';
import styles from './index.less';

const frame = formatMessage({ id: 'Scan Frame' });
const myValue = formatMessage({ id: 'Value' });
@autoHeight()
class TimelineChart extends React.Component {
  render() {
    const {
      title,
      height = 400,
      padding = [60, 20, 40, 40],
      type,
      titleMap = {
        y1: 'y1',
        y2: 'y2',
        y3: 'y3',
        y4: 'y4',
        y5: 'y5',
        y6: 'y6',
      },

      data = [
        {
          x: 0,
          y1: 0,
          y2: 0,
          y3: 0,
          y4: 0,
          y5: 0,
          y6: 0,
        },
      ],
    } = this.props;

    // data.sort((a, b) => a.x - b.x);
    let max;
    let min;
    if (
      data[0] &&
      data[0].y1 &&
      data[0].y2 &&
      data[0].y3 &&
      data[0].y4 &&
      data[0].y5 &&
      data[0].y6
    ) {
      max = Math.max(
        [...data].sort((a, b) => b.y1 - a.y1)[0].y1,
        [...data].sort((a, b) => b.y2 - a.y2)[0].y2,
        [...data].sort((a, b) => b.y3 - a.y3)[0].y3,
        [...data].sort((a, b) => b.y4 - a.y4)[0].y4,
        [...data].sort((a, b) => b.y5 - a.y5)[0].y5,
        [...data].sort((a, b) => b.y6 - a.y6)[0].y6
      );
      min = Math.min(
        [...data].sort((a, b) => a.y1 - b.y1)[0].y1,
        [...data].sort((a, b) => a.y2 - b.y2)[0].y2,
        [...data].sort((a, b) => a.y3 - b.y3)[0].y3,
        [...data].sort((a, b) => a.y4 - b.y4)[0].y4,
        [...data].sort((a, b) => a.y5 - b.y5)[0].y5,
        [...data].sort((a, b) => a.y6 - b.y6)[0].y6
      );
    }

    const ds = new DataSet({
      state: {
        start: 0,
        end: data.length,
      },
    });

    const dv = ds.createView();
    dv.source(data)
      .transform({
        type: 'filter',
        callback: obj => {
          const date = obj.x;
          return date <= ds.state.end && date >= ds.state.start;
        },
      })
      .transform({
        type: 'map',
        callback(row) {
          const newRow = { ...row };
          newRow[titleMap.y1] = row.y1;
          newRow[titleMap.y2] = row.y2;
          newRow[titleMap.y3] = row.y3;
          newRow[titleMap.y4] = row.y4;
          newRow[titleMap.y5] = row.y5;
          newRow[titleMap.y6] = row.y6;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap.y1, titleMap.y2, titleMap.y3, titleMap.y4, titleMap.y5, titleMap.y6], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const xid = data.x;

    const cols = {
      x: xid,
      value: {
        max,
        min,
      },
    };

    const SliderGen = () => (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="x"
        yAxis="y1"
        scales={{
          x: {
            formatter: x => parseInt(x, 10),
          },
        }}
        data={data}
        start={ds.state.start}
        end={ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={({ startValue, endValue }) => {
          ds.setState('start', startValue);
          ds.setState('end', endValue);
        }}
      />
    );
    return (
      <div className={styles.timelineChart} style={{ height: height + 60 }}>
        <div>{dv.origin.length > 0 ? `${myValue}(${type})` : null}</div>
        <div>
          {title && <h4>{title}</h4>}
          <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
            <Axis name="x" />
            <Tooltip
              offset={80}
              containerTpl='<div class="g2-tooltip"><p class="g2-tooltip-title"></p><table class="g2-tooltip-list"></table></div>'
              itemTpl='<tr class="g2-tooltip-list-item"><td style="color:{color}">{name}</td><td>{value}</td></tr>'
              g2-tooltip={{
                position: 'absolute',
                visibility: 'hidden',
                border: '1px solid #efefef',
                backgroundColor: 'white',
                color: '#000',
                opacity: '0.8',
                transition: 'top 400ms,left 300ms',
                padding: '5px 25px',
                width: '25%',
              }}
              g2-tooltip-list={{
                margin: '10px',
              }}
            />
            <Geom
              type="line"
              position="x*value"
              size={['key', [2, 2, 2, 1, 1]]}
              color={['key', ['#1890FF', '#2FC25B', '#FACC14', '#888', '#666', '#7B61B5']]}
            />
            <Legend
              name="key"
              position="top"
              useHtml
              itemTpl={
                '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}" style="cursor: pointer;font-size: 14px;height: 40px;">' +
                '<button><i class="g2-legend-marker" style="width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:10px;background-color: {color};"></i>' +
                '<span class="g2-legend-text">{value}</span></button>' +
                '</li>'
              }
            />
          </Chart>
          <p style={{ textAlign: 'center' }}>{dv.origin.length > 0 ? `${frame}` : null}</p>
          <div style={{ marginRight: -20 }}>
            <SliderGen />
          </div>
        </div>
      </div>
    );
  }
}

export default TimelineChart;
