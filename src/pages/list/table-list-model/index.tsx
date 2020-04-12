import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu } from 'antd';
import React, { FC, useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, createIntl, IntlProvider } from '@ant-design/pro-table';
import { connect, Dispatch } from 'umi';
import { findDOMNode } from 'react-dom';
import { ConnectProps, ConnectState } from '@/models/connect';
// import CreateForm from './components/CreateForm';
// import UpdateForm, { FormValueType } from './components/UpdateForm';
import CreateUpdateModal from './components/CreateUpdateModal';
import { TableListItem } from './data.d';
import { StateType } from './model';
// import { queryRule, updateRule, addRule, removeRule } from './service';

interface TableListProps extends ConnectProps {
  rule: StateType;
  dispatch: Dispatch;
  loading: boolean;
}

// https://protable.ant.design/intl
const enUSIntl = createIntl('en_US', {
  tableForm: {
    search: 'Query',
    reset: 'Reset',
    submit: 'Submit',
    collapsed: 'Expand',
    expand: 'Collapse',
    inputPlaceholder: 'Please enter',
    selectPlaceholder: 'Please select',
  },
  alert: {
    clear: 'Clear',
  },
  tableToolBar: {
    leftPin: 'Pin to left',
    rightPin: 'Pin to right',
    noPin: 'Unpinned',
    leftFixedTitle: 'Fixed the left',
    rightFixedTitle: 'Fixed the right',
    noFixedTitle: 'Not Fixed',
    reset: 'Reset',
    columnDisplay: 'Column Display',
    columnSetting: 'Settings',
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    reload: 'Refresh',
    density: 'Scale',
    densityDefault: 'Default',
    densityLarger: 'Large',
    densityMiddle: 'Medium',
    densitySmall: 'Compact',
  },
  tableColumnSorter: {
    caretUp: 'Sort Ascend',
  },
});

export const TableList: FC<TableListProps> = (props) => {
  const {
    loading,
    dispatch,
    rule: { list },
  } = props;
  const addBtn = useRef(null);
  /* const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({}); */
  const actionRef = useRef<ActionType>();

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<TableListItem> | undefined>(undefined);

  useEffect(() => {
    dispatch({
      type: 'rule/fetch',
      /* payload: {
        count: 5,
      }, */
    });
  }, [1]);

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: TableListItem) => {
    // console.log('Edit item: ', item);
    setVisible(true);
    setCurrent(item);
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Rule name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'desc',
    },
    {
      title: 'Service calls',
      dataIndex: 'callNo',
      sorter: true,
      renderText: (val: string) => `${val} 万`,
    },
    {
      title: 'status',
      dataIndex: 'status',
      valueEnum: {
        0: { text: 'Shut Down', status: 'Default' },
        1: { text: 'Running', status: 'Processing' },
        2: { text: 'Online', status: 'Success' },
        3: { text: 'Abnormal', status: 'Error' },
      },
    },
    {
      title: 'Last scheduled time',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              // setVisible(true); // was handleUpdateModalVisible
              // setStepFormValues(record);
              showEditModal(record);
            }}
          >
            Edit
          </a>
          <Divider type="vertical" />
          <a href="">Sign off</a>
        </>
      ),
    },
  ];

  /**
   * 添加节点
   * @param fields
   */
  /* const handleAdd = async (fields: FormValueType) => {
    const hide = message.loading('正在添加');
    try {
      await addRule({
        desc: fields.desc,
      });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  }; */

  /**
   *  删除节点
   * @param selectedRows
   */
  /* const handleRemove = async (selectedRows: TableListItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await removeRule({
        key: selectedRows.map((row) => row.key),
      });
      hide();
      message.success('删除成功，即将刷新');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  }; */
  const handleRemove = (selectedRows: TableListItem[]) => {
    // const hide = message.loading('Deleting..');
    if (!selectedRows) return true;
    // try {
    /* await removeRule({
        key: selectedRows.map((row) => row.key),
      }); */
    dispatch({
      // remove
      type: 'rule/submit',
      payload: { key: selectedRows.map((row) => row.key) },
    });
    /* hide();
      message.success('Successfully deleted, will be refreshed soon');
      return true;
    } catch (error) {
      hide();
      message.error('Failed to delete, please try again');
      console.error(error);
      return false;
    } */
    return null;
  };

  /**
   * 更新节点
   * @param fields
   */
  /* const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('正在配置');
    try {
      await updateRule({
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      });
      hide();
      message.success('配置成功');
      return true;
    } catch (error) {
      hide();
      message.error('配置失败请重试！');
      return false;
    }
  }; */

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();
    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: TableListItem) => {
    const key = current ? current.key : '';
    setAddBtnblur();
    setDone(true);
    /* dispatch({ // update
      type: 'rule/submit',
      payload: { id, ...values },
    }); */
    /* dispatch({ // remove
      type: 'rule/submit',
      payload: { key: selectedRows.map((row) => row.key) },
    }); */
    /* dispatch({ // add
      type: 'rule/submit',
      payload: { desc: fields.desc },
    }); */
    dispatch({
      type: 'rule/submit',
      payload: { key, ...values },
    });
    /* if (actionRef.current) {
      actionRef.current.reload();
    } */
  };

  return (
    <PageHeaderWrapper>
      <IntlProvider value={enUSIntl}>
        <ProTable<TableListItem>
          headerTitle="Inquiry form"
          actionRef={actionRef}
          rowKey="key"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon={<PlusOutlined />}
              type="primary"
              // onClick={() => setVisible(true)} // was handleModalVisible
              onClick={showModal}
              ref={addBtn}
            >
              New
            </Button>,
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={async (e) => {
                      if (e.key === 'remove') {
                        await handleRemove(selectedRows);
                        action.reload();
                      }
                    }}
                    selectedKeys={[]}
                  >
                    <Menu.Item key="remove">Deletion</Menu.Item>
                    <Menu.Item key="approval">Sign off</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  Bulk operations <DownOutlined />
                </Button>
              </Dropdown>
            ),
          ]}
          tableAlertRender={({ selectedRowKeys, selectedRows }) => (
            <div>
              Chosen <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> item&nbsp;&nbsp;
              <span>
                Total service calls {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} Ten
                thousand
              </span>
            </div>
          )}
          // request={(params) => queryRule(params)} // see above useEffect 'rule/fetch', and dataSource:
          dataSource={list}
          loading={loading}
          columns={columns}
          rowSelection={{}}
        />
      </IntlProvider>
      {/* <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null} */}
      <CreateUpdateModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    rule,
    loading,
  }: {
    rule: ConnectState;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    rule,
    loading: loading.models.rule,
  }),
)(TableList);
