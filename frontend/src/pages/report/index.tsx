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
} from "antd";
import { useNavigate, Link, useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { ProblemInterface } from "../../interfaces/IProblem.ts";
import { PostProblemById } from "../../services/https";

interface DataType {
	key: string;
	name: string;
	age: number;
	address: string;
	tags: string[];
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
		dataIndex: "Username",
		key: "username",
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
	const [form] = Form.useForm();

	const onFinish = async (values: ProblemInterface) => {
		let payload = {
			...values,
		};

		const res = await PostProblemById(payload);
		if (res.status == 200) {
			messageApi.open({
				type: "success",
				content: res.data.message,
			});
			form.resetFields();
			setTimeout(() => {
				navigate("/");
			}, 2000);
		} else {
			messageApi.open({
				type: "error",
				content: res.data.error,
			});
		}
	};

	return (
		<div>
			{contextHolder}
			<Card>
				<h2>แจ้งปัญหา</h2>
				<Divider />

				<Form
					name="basic"
					form={form}
					layout="vertical"
					onFinish={onFinish}
					autoComplete="off"
				>
					<Row gutter={[16, 0]}>
						<Col xs={24} sm={24} md={24} lg={24} xl={24}>
							<Form.Item
								label="หัวเรื่อง"
								name="title"
								rules={[
									{
										required: true,
										message: "กรุณากรอกหัวเรื่อง !",
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>

						<Col xs={24} sm={24} md={24} lg={24} xl={24}>
							<Form.Item
								label="รายละเอียด"
								name="description"
								rules={[
									{
										message: "รายละเอียด !",
									},
									{
										required: true,
										message: "รายละเอียด !",
									},
								]}
							>
								<Input.TextArea rows={5} />
							</Form.Item>
						</Col>
					</Row>

					<Row justify="end">
						<Col style={{ marginTop: "40px" }}>
							<Form.Item>
								<Space>
									<Link to="/">
										<Button htmlType="button" style={{ marginRight: "10px" }}>
											ยกเลิก
										</Button>
									</Link>

									<Button
										type="primary"
										htmlType="submit"
										icon={<PlusOutlined />}
									>
										บันทึก
									</Button>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Card>
		</div>
	);
}
