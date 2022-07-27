import {
	Sequelize,
	ModelDefined,
	Association,
	Model,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	HasManyGetAssociationsMixin,
	HasManyCreateAssociationMixin,
	NonAttribute,
} from "sequelize";

/* models */

export interface User
	extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	id: CreationOptional<number>;
	nickname?: string;
	email: string;
	password: string;
	refreshTokenSalt: CreationOptional<string>;
	RoleId: ForeignKey<Role["id"]>;
	domainId?: number;
	active: boolean;
	createdAt?: CreationOptional<Date>;
	updatedAt?: CreationOptional<Date>;
	deletedAt?: Date;
}

export interface Role
	extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
	id: CreationOptional<number>;
	name: string;
	type: "admin" | "user";

	Users: NonAttribute<User[]>;
	/* associations: {
		Users: Association<Role, User>;
	}; */

	getUsers: HasManyGetAssociationsMixin<User>;
	createUser: HasManyCreateAssociationMixin<User>;
}
