import React from 'react';
import { Card } from 'antd';
import styles from './Analysis.less';
import { TimelineChart } from '@/components/Charts';

const OfflineData = ({ loading, offlineChartData, type }) => (
  <Card loading={loading} className={styles.offlineCard} bordered={false} style={{ marginTop: 32 }}>
    <div style={{ padding: '0 24px' }}>
      <TimelineChart
        height={400}
        data={offlineChartData}
        titleMap={{
          y1: 'Mean ',
          y2: 'Standard Dev（Max）',
          y3: 'Standard Dev（Min）',
          y4: 'Zone（Max）',
          y5: 'Zone（Min）',
        }}
        type={type}
      />
    </div>
  </Card>
);

export default OfflineData;
