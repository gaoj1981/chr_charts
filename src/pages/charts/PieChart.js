import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';

class pieChart extends React.Component {
  componentDidMount() {}

  render() {
    const { DataView } = DataSet;
    const { data } = this.props;
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        min: 0,
        formatter(val) {
          return `${(val * 100).toFixed(2)}%`;
        },
      },
    };
    return (
      <div>
        <Chart height={400} data={dv} scale={cols} forceFit>
          <Coord type="theta" radius={0.75} />
          <Axis name="percent" />
          <Legend onClick={() => false} />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color={['item', ['#09BB07', 'red']]}
            tooltip={[
              'item*percent',
              (item, percent) => ({
                name: item,
                value: percent,
              }),
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
          >
            <Label
              content="percent"
              textStyle={{
                rotate: 0,
                textAlign: 'center',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)',
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default pieChart;
