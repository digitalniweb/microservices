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
	BelongsToGetAssociationMixin,
	ModelAttributes,
	AssociationOptions,
	HasOneGetAssociationMixin,
	HasManySetAssociationsMixin,
	ForeignKey,
	BelongsToCreateAssociationMixin,
	BelongsToSetAssociationMixin,
	BelongsToManySetAssociationsMixin,
	HasOneSetAssociationMixin,
	BelongsToManyAddAssociationMixin,
	BelongsToManyAddAssociationsMixin,
} from "sequelize";
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

		createApp: HasManyCreateAssociationMixin<App, "id">;
	}
	export interface App
		extends Model<InferAttributes<App>, InferCreationAttributes<App>> {
		id: CreationOptional<number>;
		parentId?: number;
		name: string;
		port?: number;
		AppTypeId: CreationOptional<number>;

		setParent: HasOneSetAssociationMixin<App, "id">;
		setLanguages: BelongsToManySetAssociationsMixin<Language, number>;
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
		createdAt?: CreationOptional<Date>;
		updatedAt?: CreationOptional<Date>;
		deletedAt?: Date;

		setAlias: HasManySetAssociationsMixin<Url, number>;
		createAlias: HasManyCreateAssociationMixin<Url, "id">;
		createMainUrl: BelongsToCreateAssociationMixin<Url>;
		setMainLanguage: BelongsToSetAssociationMixin<Language, number>;
		setLanguages: BelongsToManySetAssociationsMixin<Language, number>;
		setApp: BelongsToSetAssociationMixin<App, number>;
		addModule: BelongsToManyAddAssociationMixin<Module, number>;
		addModules: BelongsToManyAddAssociationsMixin<Module, number>;
		setModules: BelongsToManySetAssociationsMixin<Module, number>;
	}
	export interface Module
		extends Model<InferAttributes<Module>, InferCreationAttributes<Module>> {
		id: CreationOptional<number>;
		name: string;
		active: boolean;
		dedicatedTable: boolean;
		usersRoleId?: number;
		creditsCost?: number; // per month
		addWebsite: BelongsToManyAddAssociationMixin<Website, number>;
		setWebsites: BelongsToManySetAssociationsMixin<Website, number>;
	}
	export interface ModulesPagesLanguage
		extends Model<
			InferAttributes<ModulesPagesLanguage>,
			InferCreationAttributes<ModulesPagesLanguage>
		> {
		id: CreationOptional<number>;
		ModuleId: CreationOptional<number>;
		LanguageId: CreationOptional<number>;
		url: string;
		title?: string;
		description?: string;
		headline?: string;
		image?: string;
		content?: string;
		translations?: any;
	}

	export interface WebsiteModule
		extends Model<
			InferAttributes<WebsiteModule>,
			InferCreationAttributes<WebsiteModule>
		> {
		id: CreationOptional<number>;
		WebsiteId: CreationOptional<number>;
		ModuleId: CreationOptional<number>;
		active: boolean;
		billingDay: number;
		createdAt?: CreationOptional<Date>;
		deletedAt?: Date;
	}
	export interface WebsiteLanguageMutation
		extends Model<
			InferAttributes<WebsiteLanguageMutation>,
			InferCreationAttributes<WebsiteLanguageMutation>
		> {
		WebsiteId: CreationOptional<number>;
		LanguageId: CreationOptional<number>;
	}
	export interface AppLanguage
		extends Model<
			InferAttributes<AppLanguage>,
			InferCreationAttributes<AppLanguage>
		> {
		AppId: CreationOptional<number>;
		LanguageId: CreationOptional<number>;
	}
}
