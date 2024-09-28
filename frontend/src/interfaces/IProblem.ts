import { UsersInterface } from "./IUser";

export interface ProblemInterface {
	ID?: number;
	Title?: string;
	Description?: string;
	UserID?: number;
	DT?: Date;
	Users?: UsersInterface;
}