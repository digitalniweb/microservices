type serviceInfoType = {
	PORT: number;
	HOST: string;
	MS_NAME: string;
	MS_KEY: string;
};
type serviceInfoParametersType = keyof serviceInfoType;
let serviceInfo = {} as serviceInfoType;
let serviceInfoParameters: Array<serviceInfoParametersType> = [
	"PORT",
	"HOST",
	"MS_NAME",
	"MS_KEY",
];
serviceInfoParameters.forEach((e) => {
	serviceInfo[e] = "some string";
});
