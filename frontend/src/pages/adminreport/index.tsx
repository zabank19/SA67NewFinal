import { useState, useEffect } from "react";
import {
	AuditOutlined,
	UserOutlined,
	PieChartOutlined,
	StockOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
	Space,
	Button,
	Col,
	Row,
	Divider,
	Form,
	Input,
	Card,
	message,
	DatePicker,
	InputNumber,
	Select,
	Table,
} from "antd";
import { useNavigate, Link, useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { ProblemInterface } from "../../interfaces/IProblem.ts";
import { GetProblems } from "../../services/https/index";
import dayjs from "dayjs";

interface DataType {
	key: string;
	name: string;
	age: number;
	address: string;
	tags: string[];
	username: string;
}

const columns: ColumnsType<DataType> = [
	{
		title: "ลำดับ",
		dataIndex: "ID",
		key: "id",
	},
	{
		title: "ชื่อ",
		dataIndex: "FirstName",
		key: "firstname",
	},
	{
		title: "นามสกุุล",
		dataIndex: "LastName",
		key: "lastname",
	},
	{
		title: "อีเมล",
		dataIndex: "email",
		key: "email",
	},
	{
		title: "เบอร์โทร",
		dataIndex: "Phone",
		key: "phone",
	},
];

const data: DataType[] = [];

export default function index() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: any }>();
	const [messageApi, contextHolder] = message.useMessage();
	const [problems, setProblems] = useState<ProblemInterface[]>([]);
	const [form] = Form.useForm();

	const onFinish = async (values: ProblemInterface) => {
		let payload = {
			...values,
		};

		// const res = await UpdateUsersById(id, payload);
		// if (res.status == 200) {
		// 	messageApi.open({
		// 		type: "success",
		// 		content: res.data.message,
		// 	});
		// 	setTimeout(() => {
		// 		navigate("/customer");
		// 	}, 2000);
		// } else {
		// 	messageApi.open({
		// 		type: "error",
		// 		content: res.data.error,
		// 	});
		// }
	};

	const columns: ColumnsType<ProblemInterface> = [
		{
			title: "",
			// render: (record) => (
			// 	<>
			// 		{myId == record?.ID ? (
			// 			<></>
			// 		) : (
			// 			<Button
			// 				type="dashed"
			// 				danger
			// 				icon={<DeleteOutlined />}
			// 				onClick={() => deleteUserById(record.ID)}
			// 			></Button>
			// 		)}
			// 	</>
			// ),
		},
		{
			title: "ลำดับ",
			dataIndex: "ID",
			key: "id",
		},
		{
			title: "หัวเรื่อง",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "รายละเอียด",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "อีเมล",
			dataIndex: ["Users", "email"],
			key: "Users.email",
		},
		{
			title: "วันที่แจ้ง",
			key: "dt",
			render: (record) => <>{dayjs(record.dt).format("DD/MM/YYYY")}</>,
		},
		// {
		// 	title: "",
		// 	render: (record) => (
		// 		<>
		// 			<Button
		// 				type="primary"
		// 				icon={<DeleteOutlined />}
		// 				onClick={() => navigate(`/customer/edit/${record.ID}`)}
		// 			>
		// 				แก้ไขข้อมูล
		// 			</Button>
		// 		</>
		// 	),
		// },
	];

	const getProblems = async () => {
		let res = await GetProblems();

		if (res.status == 200) {
			console.log("data:" + JSON.stringify(res.data));
			setProblems(res.data);
			console.log("problems:" + JSON.stringify(problems));
		} else {
			setProblems([]);
			messageApi.open({
				type: "error",
				content: res.data.error,
			});
		}
	};

	useEffect(() => {
		getProblems();
	}, []);

	return (
		<div>
			{contextHolder}
			<Card>
				<h2>แสดงรายการปัญหา</h2>
				<Divider />

				<div style={{ marginTop: 20 }}>
					<Table
						rowKey="ID"
						columns={columns}
						dataSource={problems}
						style={{ width: "100%", overflow: "scroll" }}
					/>
				</div>
			</Card>
		</div>
	);
}