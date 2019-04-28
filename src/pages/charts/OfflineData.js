import React from 'react';
import { formatMessage } from 'umi/locale';
import { Card } from 'antd';
import styles from './Analysis.less';
import { TimelineChart } from '@/components/Charts';

const mean = formatMessage({ id: 'Mean' });
const standard = formatMessage({ id: 'Standard Dev' });
const max = formatMessage({ id: 'Max' });
const min = formatMessage({ id: 'Min' });

const OfflineData = ({ loading, zone, getAnalyze, zl, offlineChartData, type }) => {
  const chartData = [];
  if (zl !== 'my') {
    if (getAnalyze[0]) {
      getAnalyze.forEach(v => {
        const ow = {
          x: v.id,
          y1: v.w,
          y2: v.W[0],
          y3: v.W[1],
          y4: zone[0].zones[v.z] === undefined ? 0 : zone[0].zones[v.z].width.maximum,
          y5: zone[0].zones[v.z] === undefined ? 0 : zone[0].zones[v.z].width.minimum,
          y6: v.wc,
        };
        const oh = {
          x: v.id,
          y1: v.h,
          y2: v.H[0],
          y3: v.H[1],
          y4: zone[0].zones[v.z] === undefined ? 0 : zone[0].zones[v.z].height.maximum,
          y5: zone[0].zones[v.z] === undefined ? 0 : zone[0].zones[v.z].height.minimum,
          y6: v.hc,
        };
        const ov = {
          x: v.id,
          y1: v.v,
          y2: v.V[0],
          y3: v.V[1],
          y4: zone[0].zones[v.z] === undefined ? 0 : zone[0].zones[v.z].volume.maximum,
          y5: zone[0].zones[v.z] === undefined ? 0 : zone[0].zones[v.z].volume.minimum,
          y6: v.vc,
        };
        switch (zl) {
          case 'width':
            chartData.push(ow);
            break;
          case 'height':
            chartData.push(oh);
            break;
          case 'volume':
            chartData.push(ov);
            break;
          default:
            break;
        }
      });
    }
  }

  return (
    <Card
      loading={loading}
      className={styles.offlineCard}
      bordered={false}
      style={{ marginTop: 32 }}
    >
      <div style={{ padding: '0 24px' }}>
        <TimelineChart
          height={400}
          data={chartData[0] ? chartData : offlineChartData}
          titleMap={{
            y1: `${mean}`,
            y2: `${standard}（${max}）`,
            y3: `${standard}（${min}）`,
            y4: `Zone（${max}）`,
            y5: `Zone（${min}）`,
            y6: `Cpk`,
          }}
          type={type}
        />
      </div>
    </Card>
  );
};

export default OfflineData;
