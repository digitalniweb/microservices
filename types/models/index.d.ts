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
	HasManyAddAssociationsMixin,
	NonAttribute,
	CreationAttributes,
	moel,
	BelongsToGetAssociationMixin,
	ModelAttributes,
	AssociationOptions,
} from "sequelize";

/* models */

export namespace users {
	export interface Tenant
		extends Model<InferAttributes<Tenant>, InferCreationAttributes<Tenant>> {
		id: CreationOptional<number>;
		UserId: ForeignKey<User["id"]>;
		countryId?: number;
		academicDegree?: string;
		firstName: string;
		lastName: string;
		telephone: string;
		city: string;
		zip: string;
		streetAddress: string;
		houseNumber: number;
		landRegistryNumber: number;
		company: boolean;
		companyName?: string;
		tin?: string;
		vatId?: string;
		subscribeNewsletters: boolean;

		getUser: BelongsToGetAssociationMixin<User>;
	}
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
		Tenant?: Tenant;
		Privileges: NonAttribute<Privilege[]>;

		addPrivileges?: HasManyAddAssociationsMixin<Privilege[]>;
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

	export interface Privilege
		extends Model<
			InferAttributes<Privilege>,
			InferCreationAttributes<Privilege>
		> {
		id: CreationOptional<number>;
		name: string;
		type: "admin" | "user";

		Users: NonAttribute<User[]>;

		/* getUsers: HasManyGetAssociationsMixin<User>;
		createUser: HasManyCreateAssociationMixin<User>; */
	}

	export interface UserPrivilege
		extends Model<
			InferAttributes<UserPrivilege>,
			InferCreationAttributes<UserPrivilege>
		> {
		UserId: CreationOptional<number>;
		PrivilegeId: CreationOptional<number>;
	}
}
