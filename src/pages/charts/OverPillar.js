import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';

/* eslint-disable */
class OverPillar extends React.Component {
  render() {
    const { data } = this.props;
    const ds = new DataSet();
    const dv = ds
      .createView()
      .source(data)
      .transform({
        type: 'percent',
        field: 'value',
        // 统计销量
        dimension: 'country',
        // 每年的占比
        groupBy: ['year'],
        // 以不同产品类别为分组
        as: 'percent',
      });
    const cols = {
      percent: {
        min: 0,
        formatter(val) {
          return (val * 100).toFixed(2) + '%';
        },
      },
    };
    const tooltipCfg = {
      itemTpl:
        '<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{name}:{value} ({number}) </li>',
    };

    return (
      <div>
        <Chart height={400} data={dv} scale={cols} forceFit>
          <Legend name="country" />
          <Axis name="year" />
          <Axis name="percent" />
          <Tooltip {...tooltipCfg} />
          <Geom
            type="intervalStack"
            position="year*percent"
            color={['country', ['#09BB07', 'red']]}
            tooltip={[
              'year*percent*country*value',
              (year, percent, country, value) => {
                return {
                  //自定义 tooltip 上显示的 title 显示内容等。
                  value: (percent * 100).toFixed(2) + '%',
                  number: value,
                };
              },
            ]}
          />
        </Chart>
      </div>
    );
  }
}

export default OverPillar;
