import React from 'react';
import { Form, Row, Table, Icon, Button } from 'antd';
import { formatMessage } from 'umi/locale';

const mytimes = formatMessage({ id: 'times' });
const ScanN = formatMessage({ id: 'ScanN' });
const partStyle = formatMessage({ id: 'partStyle' });
const myHost = formatMessage({ id: 'host' });
const myDetails = formatMessage({ id: 'Details' });

const sameForm = (props, childrenVisible) => {
  const { sameName, handlePageChange, form } = props;
  const { getFieldValue } = form;
  const hosts = getFieldValue('hosts');
  const partStyles = getFieldValue('lingjian');
  const dataSource = [];
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
      title: `${mytimes}`,
      dataIndex: 'times',
      key: 'times',
      align: 'center',
    },
    {
      title: `${myDetails}`,
      dataIndex: 'findSame',
      key: 'findSame',
      align: 'center',
      render: (text, record) => (
        <Button
          onClick={() => {
            childrenVisible(true, record.scanN);
          }}
        >
          {myDetails}
        </Button>
      ),
    },
  ];
  if (sameName[0]) {
    sameName.forEach(v => {
      const { _id: scanN } = v;
      const { times } = v;
      const add = {
        host: hosts,
        partStyle: partStyles,
        scanN,
        times,
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
            pageSize: 10,
          }}
        />
      </Row>
    </Form>
  );
};

export default sameForm;
