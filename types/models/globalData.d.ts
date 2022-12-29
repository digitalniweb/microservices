import {
	Model,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	ForeignKey,
	BelongsToCreateAssociationMixin,
	BelongsToSetAssociationMixin,
	BelongsToGetAssociationMixin,
} from "sequelize";
export namespace globalData {
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
		extends Model<
			InferAttributes<AppType>,
			InferCreationAttributes<AppType>
		> {
		id: CreationOptional<number>;
		name: string;
	}
	export interface Module
		extends Model<
			InferAttributes<Module>,
			InferCreationAttributes<Module>
		> {
		id: CreationOptional<number>;
		name: string;
		active: boolean;
		dedicatedTable: boolean;
		usersRoleId?: number;
		creditsCost?: number; // per month
	}
	export interface Role
		extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
		id: CreationOptional<number>;
		name: string;
		type: "admin" | "user";

		/*
		Users: NonAttribute<User[]>;
		// It's like this but I think this won't work
		// associations: {
		// 	Users: Association<Role, User>;
		// }; 
		*/
	}

	export interface Privilege
		extends Model<
			InferAttributes<Privilege>,
			InferCreationAttributes<Privilege>
		> {
		id: CreationOptional<number>;
		name: string;
		type: "admin" | "user";
	}
	export interface Currency
		extends Model<
			InferAttributes<Currency>,
			InferCreationAttributes<Currency>
		> {
		id: CreationOptional<number>;
		sign: string; // €
		code: string; // EUR
	}
	export interface CurrencyLanguage
		extends Model<
			InferAttributes<CurrencyLanguage>,
			InferCreationAttributes<CurrencyLanguage>
		> {
		id: CreationOptional<number>;
		CurrencyId: ForeignKey<Currency["id"]>;
		LanguageId: ForeignKey<Language["id"]>;
		name: string;
	}
	export interface ServiceRegistry
		extends Model<
			InferAttributes<ServiceRegistry>,
			InferCreationAttributes<ServiceRegistry>
		> {
		id: CreationOptional<number>;
		host: string;
		port: number;
		uniqueName: string;
		MicroserviceId: ForeignKey<Microservice["id"]>;
		apiKey?: string;
	}
	export interface Microservice
		extends Model<
			InferAttributes<Microservice>,
			InferCreationAttributes<Microservice>
		> {
		id: CreationOptional<number>;
		name: string;
		mainServiceRegistryId?: ForeignKey<ServiceRegistry["id"]>;
		ServiceRegistries?: ServiceRegistry[];

		getServiceRegistry: BelongsToGetAssociationMixin<ServiceRegistry>;
		createServiceRegistry: BelongsToCreateAssociationMixin<ServiceRegistry>;
		setMainServiceRegistry: BelongsToSetAssociationMixin<
			ServiceRegistry,
			number
		>;
	}
}
