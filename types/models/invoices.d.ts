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
} from "sequelize";
export namespace invoices {
	export interface Invoice
		extends Model<InferAttributes<Invoice>, InferCreationAttributes<Invoice>> {
		id: CreationOptional<number>;
		invoiceNumber: string;
		amount: number;
		CurrencyId: ForeignKey<Currency["id"]>;
		StatusId: ForeignKey<Status["id"]>;
		CreditBalanceLogId?: ForeignKey<CreditBalanceLog["id"]>;
		dueDate: Date;
		createdAt?: CreationOptional<Date>;
		updatedAt?: CreationOptional<Date>;
		deletedAt?: Date;
	}
	export interface Status
		extends Model<InferAttributes<Status>, InferCreationAttributes<Status>> {
		id: CreationOptional<number>;
		name: string;
	}
	export interface CreditBalanceLog
		extends Model<
			InferAttributes<CreditBalanceLog>,
			InferCreationAttributes<CreditBalanceLog>
		> {
		id: CreationOptional<number>;
		userId: number;
		websiteId: number;
		creditDifference: number;
		createdAt?: CreationOptional<Date>;
		CreditBalanceTypeId: ForeignKey<CreditBalanceType["id"]>;
	}
	export interface CreditBalanceType
		extends Model<
			InferAttributes<CreditBalanceType>,
			InferCreationAttributes<CreditBalanceType>
		> {
		id: CreationOptional<number>;
		name: string;
		description: string;
		creditGain: boolean; // true addition, false subtraction
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
	export interface CurrencyLanguages
		extends Model<
			InferAttributes<CurrencyLanguages>,
			InferCreationAttributes<CurrencyLanguages>
		> {
		id: CreationOptional<number>;
		CurrencyId: ForeignKey<Currency["id"]>;
		languageId: number;
		name: string;
	}
}
