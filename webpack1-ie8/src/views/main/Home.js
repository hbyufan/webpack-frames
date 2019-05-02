import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, InputNumber, Spin, Tooltip, Table, Cascader, Collapse, DatePicker, Timeline } from "antd";
import Select from "../../components/Select";
import { shimAntdTable } from "./antd";

const List = ({ items, ...res }) => (
	<Collapse accordion {...res}>
		{items.map(v => {
			const { id, name, description } = v;
			const url = v["html_url"];
			const count = v["stargazers_count"];
			return (
				<Collapse.Panel
					key={id}
					header={
						<span>
							<Tooltip title={url}>
								<a href={url}>{name}</a>
							</Tooltip>
							<span className="offset">
								<Icon type="star" />
								{`stars: ${count}`}
							</span>
						</span>
					}
				>
					{description}
				</Collapse.Panel>
			);
		})}
	</Collapse>
);

class Test extends Component {
	changeLang = reddit => this.props.dispatch({
		type: "home/GET_DATA",
		payload: { reddit },
	});
	changeOrder = order => this.props.dispatch({
		type: "home/GET_DATA",
		payload: { order },
	});
	render() {
		const { reddit, order, reddits, orders, history } = this.props;
		const key = `${reddit}|${order}`;
		const { data = [], loading } = history[key];
		return <div>
			<span className="offset">语言:</span>
			<Select
				isSearch
				value={reddit}
				options={reddits.map(v => ({ value: v, label: v }))}
				onChange={this.changeLang}
				className="wd120"
			/>
			<span className="offset">排序:</span>
			<Select
				value={order}
				options={orders.map(v => ({ value: v, label: v }))}
				onChange={this.changeOrder}
			/>
			<Spin spinning={loading}>
				<List items={data} />
			</Spin>
		</div>;
	}
}
class Hello extends Component {
	cols = data => {
		const columns = [
			{
				key: "idx",
				title: "序号",
				fixed: "left",
				render: (_v, r) => data.indexOf(r) + 1,
			},
			{
				key: "act",
				title: "操作",
				fixed: "right",
				render: (_v, r) => (
					<span>
						<Icon type="copy anchor" />
						<Icon type="edit anchor" />
						<Icon
							type="delete danger"
							onClick={() => {
								const i = data.indexOf(r);
								const list = data.slice();
								list.splice(i, 1);
								this.setState({ list });
							}}
						/>
					</span>
				),
			},
		];
		if (data && data[0]) {
			for (const x in data[0]) {
				columns.splice(-1, 0, {
					title: x,
					dataIndex: x,
					key: x,
				});
			}
		}
		return columns;
	};
	componentDidUpdate = shimAntdTable;
	render() {
		const { patent, division, loading } = this.props;
		return <Spin spinning={loading}>
			<Cascader
				className="wd200"
				placeholder="请选择省市行政区..."
				options={division}
				showSearch
			/>
			<Table
				dataSource={patent}
				columns={this.cols(patent)}
				scroll={{ x: 800, y: 200 }}
			/>
		</Spin>;
	}
}
const mapStateToProps = state => state.home;
const T = connect(mapStateToProps)(Test);
const H = connect(mapStateToProps)(Hello);
const Home = () => <div>
	<T />
	<H />
	<DatePicker.RangePicker
		showTime
		format="yyyy-MM-dd HH:mm:ss"
	/>
	<br />
	<DatePicker.RangePicker />
	<br />
	<DatePicker />
	<br />
	<InputNumber />
	<Timeline>
		<Timeline.Item>创建服务现场 2015-09-01</Timeline.Item>
		<Timeline.Item>初步排除网络异常 2015-09-01</Timeline.Item>
		<Timeline.Item dot={<Icon type="clock-circle-o" />}>技术测试异常 2015-09-01</Timeline.Item>
		<Timeline.Item>网络异常正在修复 2015-09-01</Timeline.Item>
	</Timeline>
</div>;
export default Home;