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
	export interface App
		extends Model<InferAttributes<App>, InferCreationAttributes<App>> {
		id: CreationOptional<number>;
		parentId?: number;
		name: string;
		port?: number;
		appTypeId: CreationOptional<number>;

		setParent: HasOneSetAssociationMixin<App, "id">;
		setAppLanguages: HasManySetAssociationsMixin<AppLanguage, number>;
		createAppLanguage: HasManyCreateAssociationMixin<AppLanguage, "id">;
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
		mainLanguageId?: number;
		active: boolean;
		testingMode: boolean;
		paused: boolean;
		createdAt?: CreationOptional<Date>;
		updatedAt?: CreationOptional<Date>;
		deletedAt?: Date;

		setAlias: HasManySetAssociationsMixin<Url, number>;
		createAlias: HasManyCreateAssociationMixin<Url, "id">;
		createMainUrl: BelongsToCreateAssociationMixin<Url>;
		setApp: BelongsToSetAssociationMixin<App, number>;
	}
	export interface ModulesPagesLanguage
		extends Model<
			InferAttributes<ModulesPagesLanguage>,
			InferCreationAttributes<ModulesPagesLanguage>
		> {
		id: CreationOptional<number>;
		moduleId: CreationOptional<number>;
		languageId: CreationOptional<number>;
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
		moduleId: CreationOptional<number>;
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
		languageId: CreationOptional<number>;
	}
	export interface AppLanguage
		extends Model<
			InferAttributes<AppLanguage>,
			InferCreationAttributes<AppLanguage>
		> {
		id: CreationOptional<number>;
		AppId: CreationOptional<number>;
		languageId: CreationOptional<number>;
	}
}
