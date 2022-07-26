import {
	Sequelize,
	ModelDefined,
	Association,
	Model,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
} from "sequelize";

/* models */

export interface User
	extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	id: CreationOptional<number>;
	nickname?: string;
	email: string;
	password: string;
	refreshTokenSalt: string;
	RoleId: ForeignKey<Role["id"]>;
	domainId?: number;
	active: boolean;
	createdAt?: CreationOptional<Date>;
	updatedAt?: CreationOptional<Date>;
	deletedAt?: Date;
}

export interface Role
	extends Model<
		InferAttributes<Role, { omit: "user" }>,
		InferCreationAttributes<Role, { omit: "user" }>
	> {
	id: CreationOptional<number>;
	name: string;
	type: "admin" | "user";

	user: NonAttribute<User>;

	/* associations?: {
		user: Association<Role, User>;
	}; */
}
