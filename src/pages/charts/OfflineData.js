import React from 'react';
import { formatMessage } from 'umi/locale';
import { Card } from 'antd';
import styles from './Analysis.less';
import { TimelineChart } from '@/components/Charts';

const mean = formatMessage({ id: 'Mean' });
const standard = formatMessage({ id: 'Standard Dev' });
const max = formatMessage({ id: 'Max' });
const min = formatMessage({ id: 'Min' });

const OfflineData = ({ loading, offlineChartData, type }) => (
  <Card loading={loading} className={styles.offlineCard} bordered={false} style={{ marginTop: 32 }}>
    <div style={{ padding: '0 24px' }}>
      <TimelineChart
        height={400}
        data={offlineChartData}
        titleMap={{
          y1: `${mean}`,
          y2: `${standard}（${max}）`,
          y3: `${standard}（${min}）`,
          y4: `Zone（${max}）`,
          y5: `Zone（${min}）`,
        }}
        type={type}
      />
    </div>
  </Card>
);

export default OfflineData;
