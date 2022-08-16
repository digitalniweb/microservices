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
	HasOneGetAssociationMixin,
	HasManySetAssociationsMixin,
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

		addPrivileges: HasManyAddAssociationsMixin<Privilege, number>;
		getRole: HasOneGetAssociationMixin<Role>;
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
	}

	export interface UserPrivilege
		extends Model<
			InferAttributes<UserPrivilege>,
			InferCreationAttributes<UserPrivilege>
		> {
		UserId: CreationOptional<number>;
		PrivilegeId: CreationOptional<number>;
	}
	export interface Blacklist
		extends Model<
			InferAttributes<Blacklist>,
			InferCreationAttributes<Blacklist>
		> {
		id: CreationOptional<number>;
		service: string;
		type: string;
		value: string;
		reason?: string;
		otherData?: any;
		blockedTill: Date;
		type: "admin" | "user";

		createdAt?: CreationOptional<Date>;
		deletedAt?: Date;
	}
	export interface LoginLog
		extends Model<
			InferAttributes<LoginLog>,
			InferCreationAttributes<LoginLog>
		> {
		id: CreationOptional<number>;
		userLogin: string;
		UserId?: number | null;
		ip: string;
		userAgent: Object;
		successful: boolean;

		createdAt?: CreationOptional<Date>;
	}
}

export namespace websites {
	export interface Language
		extends Model<
			InferAttributes<Language>,
			InferCreationAttributes<Language>
		> {
		id: CreationOptional<number>;
		name: string;
		code: string;
		icon: string;
	}
	export interface AppType
		extends Model<InferAttributes<AppType>, InferCreationAttributes<AppType>> {
		id: CreationOptional<number>;
		name: string;
	}
	export interface App
		extends Model<InferAttributes<App>, InferCreationAttributes<App>> {
		id: CreationOptional<number>;
		parentId?: number;
		name: string;
		port?: number;
		AppTypeId: CreationOptional<number>;
	}

	export interface Url
		extends Model<InferAttributes<Url>, InferCreationAttributes<Url>> {
		id: CreationOptional<number>;
		url: string;
		WebsiteId?: string;
	}

	export interface Website
		extends Model<InferAttributes<Website>, InferCreationAttributes<Website>> {
		id: CreationOptional<number>;
		uniqueName: CreationOptional<string>;
		MainUrlId?: number;
		userId?: number;
		AppId?: number;
		MainLanguageId?: number;
		active: boolean;
		testingMode: boolean;
		paused: boolean;

		setAliases: HasManySetAssociationsMixin<Url, number>;
	}
}
