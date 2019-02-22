import React from 'react';
import { Card } from 'antd';
import styles from './Analysis.less';
import { TimelineChart } from '@/components/Charts';

const OfflineData = ({ loading, offlineChartData }) => (
  <Card loading={loading} className={styles.offlineCard} bordered={false} style={{ marginTop: 32 }}>
    <div style={{ padding: '0 24px' }}>
      <TimelineChart
        height={400}
        data={offlineChartData}
        titleMap={{
          y1: '平均值 ',
          y2: '标准差（上限） ',
          y3: '标准差（下限）',
          y4: 'Zone（上限）',
          y5: 'Zone（下限）',
        }}
      />
    </div>
  </Card>
);

export default OfflineData;
