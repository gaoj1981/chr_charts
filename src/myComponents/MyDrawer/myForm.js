import React from 'react';
import { Form, Row, Table, Icon } from 'antd';
import { formatMessage } from 'umi/locale';

const myDate = formatMessage({ id: 'Date' });
const ScanN = formatMessage({ id: 'ScanN' });
const partStyle = formatMessage({ id: 'partStyle' });
const myHost = formatMessage({ id: 'host' });

const columns = [
  {
    title: `${myHost}`,
    dataIndex: 'host',
    key: 'host',
    align: 'center',
    render: text => (
      <span>
        <Icon type="laptop" /> {text}
      </span>
    ),
  },
  {
    title: `${partStyle}`,
    dataIndex: 'partStyle',
    key: 'partStyle',
    align: 'center',
  },
  {
    title: `${ScanN}`,
    dataIndex: 'scanN',
    key: 'scanN',
    align: 'center',
  },
  {
    title: `${myDate}`,
    dataIndex: 'date',
    key: 'date',
    align: 'center',
    render: text => (
      <span>
        <Icon type="calendar" /> {text}
      </span>
    ),
  },
];

const editForm = (props, handlePageChange) => {
  const { findFail } = props;
  const { content, totalElements, size } = findFail;
  const dataSource = [];
  if (content) {
    content.forEach(v => {
      const add = {
        host: v.host,
        partStyle: v.partStyle,
        scanN: v.scanN,
        date: v.date,
      };
      dataSource.push(add);
    });
  }

  return (
    <Form>
      <Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          align="center"
          pagination={{
            onChange: page => {
              handlePageChange(page);
            },
            pageSize: size,
            total: totalElements,
          }}
        />
      </Row>
    </Form>
  );
};

export default editForm;
